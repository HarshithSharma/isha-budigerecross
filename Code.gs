/**
 * Code.gs — Google Apps Script Backend
 * =====================================
 * Deploy this as a Google Apps Script Web App:
 *   1. Open https://script.google.com/
 *   2. Create a new project named "Isha Budigere"
 *   3. Paste this code into Code.gs
 *   4. Edit the SHEET_ID constant below to match your Google Sheet ID
 *   5. Run → Deploy → New Deployment
 *      - Type: Web App
 *      - Execute as: Me
 *      - Who has access: Anyone
 *   6. Copy the Web App URL into CONFIG.appsScriptUrl in app.js
 *
 * Google Sheet structure expected:
 * ---------------------------------
 * Sheet "Programs":
 *   Columns: id | title | description | frequency | schedule | venue | contact
 *
 * Sheet "Volunteers":
 *   Columns: id | title | icon | description | tags (comma-separated)
 *
 * Sheet "Submissions" (auto-created):
 *   Columns: timestamp | formType | name | whatsapp | email | ... (form-specific fields)
 */

// ── CONFIGURATION ─────────────────────────────────────────────────────────────

/** Replace with your Google Sheet's ID (the long string in its URL). */
var SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';

// ── MAIN HANDLERS ─────────────────────────────────────────────────────────────

/**
 * Handle GET requests — return programs or volunteering opportunities as JSON.
 * @param {GoogleAppsScript.Events.DoGet} e
 * @returns {GoogleAppsScript.Content.TextOutput}
 */
function doGet(e) {
  var type = (e && e.parameter && e.parameter.type) ? e.parameter.type.toLowerCase() : 'programs';

  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var records;

    if (type === 'volunteers') {
      records = getVolunteers(ss);
    } else {
      records = getPrograms(ss);
    }

    return buildJsonResponse({ records: records });
  } catch (err) {
    return buildJsonResponse({ error: err.message }, 500);
  }
}

/**
 * Handle POST requests — accept form submissions and append to the Submissions sheet.
 * @param {GoogleAppsScript.Events.DoPost} e
 * @returns {GoogleAppsScript.Content.TextOutput}
 */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var formType = body.formType || 'unknown';

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = getOrCreateSheet(ss, 'Submissions');

    // Ensure header row exists
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'Form Type', 'Name', 'WhatsApp', 'Email',
        'Area / Program', 'Participants', 'Message / Notes',
      ]);
    }

    var now = new Date().toISOString();

    sheet.appendRow([
      now,
      formType,
      sanitize(body.name),
      sanitize(body.whatsapp),
      sanitize(body.email || ''),
      sanitize(body.area || body.program || ''),
      sanitize(String(body.participants || '')),
      sanitize(body.message || body.notes || ''),
    ]);

    // Optional: send a notification email to the coordinator
    // sendNotificationEmail(formType, body);

    return buildJsonResponse({ success: true });
  } catch (err) {
    return buildJsonResponse({ success: false, message: err.message }, 500);
  }
}

// ── DATA READERS ──────────────────────────────────────────────────────────────

/**
 * Read all rows from the "Programs" sheet and return as an array of objects.
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss
 * @returns {Array<Object>}
 */
function getPrograms(ss) {
  var sheet = ss.getSheetByName('Programs');
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  var headers = data[0].map(function(h) { return String(h).trim().toLowerCase(); });
  return data.slice(1).map(function(row) {
    return rowToObject(headers, row);
  }).filter(function(r) { return r.title; }); // skip blank rows
}

/**
 * Read all rows from the "Volunteers" sheet and return as an array of objects.
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss
 * @returns {Array<Object>}
 */
function getVolunteers(ss) {
  var sheet = ss.getSheetByName('Volunteers');
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  var headers = data[0].map(function(h) { return String(h).trim().toLowerCase(); });
  return data.slice(1).map(function(row) {
    var obj = rowToObject(headers, row);
    // Split comma-separated tags into an array
    if (obj.tags && typeof obj.tags === 'string') {
      obj.tags = obj.tags.split(',').map(function(t) { return t.trim(); }).filter(Boolean);
    } else {
      obj.tags = [];
    }
    return obj;
  }).filter(function(r) { return r.title; });
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

/**
 * Convert a row array to a plain object using the header names as keys.
 * @param {string[]} headers
 * @param {any[]}    row
 * @returns {Object}
 */
function rowToObject(headers, row) {
  var obj = {};
  headers.forEach(function(h, i) {
    obj[h] = row[i] !== undefined ? String(row[i]).trim() : '';
  });
  return obj;
}

/**
 * Get a sheet by name, creating it if it does not exist.
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss
 * @param {string} name
 * @returns {GoogleAppsScript.Spreadsheet.Sheet}
 */
function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  return sheet;
}

/**
 * Strip potentially dangerous characters from user-supplied strings.
 * @param {string} value
 * @returns {string}
 */
function sanitize(value) {
  if (!value) return '';
  // Prevent formula injection by stripping leading formula characters
  var str = String(value).trim();
  if (['=', '+', '-', '@', '\t', '\r'].includes(str.charAt(0))) {
    str = "'" + str;
  }
  return str;
}

/**
 * Build a JSON TextOutput with CORS headers.
 * @param {Object} data
 * @param {number} [statusCode]
 * @returns {GoogleAppsScript.Content.TextOutput}
 */
function buildJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * (Optional) Send an email notification to the center coordinator.
 * Uncomment and configure the TO_EMAIL constant to enable.
 */
// var TO_EMAIL = 'coordinator@example.com';
// function sendNotificationEmail(formType, body) {
//   var subject = '[Isha Budigere] New ' + formType + ' submission';
//   var message = 'Name: '     + body.name     + '\n'
//               + 'WhatsApp: ' + body.whatsapp + '\n'
//               + 'Email: '    + (body.email || 'N/A') + '\n\n'
//               + JSON.stringify(body, null, 2);
//   MailApp.sendEmail(TO_EMAIL, subject, message);
// }
