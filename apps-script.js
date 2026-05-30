// =============================================
// Isha Place, Budigere — Google Apps Script
// Paste this entire file into:
// Google Sheet → Extensions → Apps Script
// Then deploy as Web App (see setup-guide.md)
//
// Creates / uses these tabs for form submissions:
//   HomeQueries, ProgramInterest, ProgramVolunteer, VolunteeringInterest
// =============================================

// ---- CONFIGURE THESE (content sheets) ----
const PROGRAMS_SHEET = "Programs";
const VOLUNTEER_SHEET = "Volunteering";

// ---- Form response tabs (one per form) ----
const HOME_QUERIES_SHEET = "HomeQueries";
const PROGRAM_INTEREST_SHEET = "ProgramInterest";
const PROGRAM_VOLUNTEER_SHEET = "ProgramVolunteer";
const VOLUNTEERING_INTEREST_SHEET = "VolunteeringInterest";
// -------------------------

function doGet(e) {
  const type = e.parameter.type;
  const id = e.parameter.id;

  let result;

  if (type === "programs") {
    result = id ? getSingleItem(PROGRAMS_SHEET, id) : getAllItems(PROGRAMS_SHEET);
  } else if (type === "volunteering") {
    result = id ? getSingleItem(VOLUNTEER_SHEET, id) : getAllItems(VOLUNTEER_SHEET);
  } else {
    result = { error: "Unknown type" };
  }

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const formType = data.formType;

    if (formType === "homeQuery") {
      saveHomeQuery(data);
    } else if (formType === "programInterest") {
      saveProgramInterest(data);
    } else if (formType === "programVolunteer") {
      saveProgramVolunteer(data);
    } else if (formType === "volunteeringInterest") {
      saveVolunteeringInterest(data);
    } else {
      return ContentService.createTextOutput(
        JSON.stringify({
          error:
            "Unknown formType. Use homeQuery, programInterest, programVolunteer, or volunteeringInterest.",
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message })).setMimeType(
      ContentService.MimeType.JSON
    );
  }
}

// ---- Unified status check for both Programs and Volunteering ----
// Only a column named "status" is recognized. Value must be "Open" (case-insensitive) to show.
// Empty / missing status is treated as visible.

function normalizeStatus_(raw) {
  if (raw === undefined || raw === null) return "";
  return String(raw)
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** Returns normalized status string, or null if no "status" column exists. */
function getRowStatus_(headers, row) {
  const ix = headers.indexOf("status");
  if (ix < 0) return null;
  return normalizeStatus_(row[ix]);
}

/** True if the row should be shown (status must be "open", case-insensitive). */
function isRowVisible_(headers, row) {
  const st = getRowStatus_(headers, row);
  if (st === null) return false;
  return st === "open";
}

// ---- GET ALL ITEMS FROM A SHEET ----
function getAllItems(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return { items: [] };

  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return { items: [] };

  const headers = rows[0].map((h) => h.toString().trim().toLowerCase());
  const items = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!isRowVisible_(headers, row)) continue;
    if (!row[0]) continue;

    const item = {};
    headers.forEach((h, idx) => {
      item[h] = row[idx].toString().trim();
    });
    item.id = i.toString();
    items.push(item);
  }

  return { items };
}

// ---- GET SINGLE ITEM BY ROW ID ----
function getSingleItem(sheetName, id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) return { item: null };

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0].map((h) => h.toString().trim().toLowerCase());
  const rowIndex = parseInt(id);

  if (rowIndex < 1 || rowIndex >= rows.length) return { item: null };

  const row = rows[rowIndex];
  const item = {};
  headers.forEach((h, idx) => {
    item[h] = row[idx].toString().trim();
  });
  item.id = id;

  if (!isRowVisible_(headers, row)) return { item: null };

  return { item };
}

function ensureSheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#c8a96e");
  } else {
    // If the sheet already exists, ensure the header row contains all expected headers.
    // This lets us add new fields over time without manually editing existing sheets.
    const existingHeaderRow = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1).getValues()[0];
    const existingHeaders = existingHeaderRow.map((h) => h.toString().trim());
    const existingNorm = existingHeaders.map((h) => h.toLowerCase());
    const missing = (headers || []).filter((h) => existingNorm.indexOf(h.toString().trim().toLowerCase()) === -1);

    if (missing.length > 0) {
      const startCol = existingHeaders.filter((h) => h !== "").length + 1;
      sheet.getRange(1, startCol, 1, missing.length).setValues([missing]);
      sheet.getRange(1, startCol, 1, missing.length).setFontWeight("bold").setBackground("#c8a96e");
    }
  }
  return sheet;
}

// ---- Home page: general query ----
function saveHomeQuery(data) {
  const sheet = ensureSheet_(HOME_QUERIES_SHEET, [
    "Timestamp",
    "Name",
    "WhatsApp",
    "Area",
    "Query",
  ]);
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name || "",
    data.phone || "",
    data.area || "",
    data.query || "",
  ]);
}

// ---- Programs list / detail: program interest ----
function saveProgramInterest(data) {
  const sheet = ensureSheet_(PROGRAM_INTEREST_SHEET, [
    "Timestamp",
    "Name",
    "WhatsApp",
    "Area",
    "Program Name",
    "Program ID",
    "Search Keyword",
  ]);
  const searchKw = (data.searchKeyword && String(data.searchKeyword).trim()) || "";
  const programName =
    (data.programName && String(data.programName).trim()) || searchKw || "";
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name || "",
    data.phone || "",
    data.area || "",
    programName,
    data.programId || "",
    searchKw,
  ]);
}

// ---- Program detail: volunteer for a specific program ----
function saveProgramVolunteer(data) {
  const sheet = ensureSheet_(PROGRAM_VOLUNTEER_SHEET, [
    "Timestamp",
    "Name",
    "WhatsApp",
    "Area",
    "Program Name",
    "Program ID",
  ]);
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name || "",
    data.phone || "",
    data.area || "",
    (data.programName && String(data.programName).trim()) || "",
    data.programId || "",
  ]);
}

// ---- Volunteering list / detail: volunteering interest ----
function saveVolunteeringInterest(data) {
  const sheet = ensureSheet_(VOLUNTEERING_INTEREST_SHEET, [
    "Timestamp",
    "Name",
    "WhatsApp",
    "Area",
    "Opportunity Name",
    "Opportunity ID",
  ]);
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name || "",
    data.phone || "",
    data.area || "",
    data.opportunityName || "",
    data.opportunityId || "",
  ]);
}
