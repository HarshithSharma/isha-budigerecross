# Setup Guide — Isha Place, Budigere Website

## What you have
- `index.html` — Home page  
- `programs.html` — Programs listing  
- `volunteering.html` — Volunteering listing  
- `detail.html` — Detail page + contact form  
- `style.css` — All styling  
- `config.js` — Where you paste your Apps Script URL  
- `apps-script.js` — The Google Apps Script code  

---

## STEP 1 — Create Your Google Sheet

1. Go to **sheets.google.com** → New spreadsheet
2. Name it: `Isha Place, Budigere`
3. Create **3 tabs** (click + at bottom):
   - `Programs`
   - `Volunteering`
   - `Contacts` *(the script creates this automatically, but you can make it now)*

### Programs tab — add these headers in Row 1:
| title | description | date | location | duration | image | registerlink | status |
|-------|-------------|------|----------|----------|-------|--------------|--------|

### Volunteering tab — add these headers in Row 1:
| title | description | date | location | duration | image | status |
|-------|-------------|------|----------|----------|-------|--------|

**Tips:**
- `status` column for **Programs**: type `Open` to show, anything else (or `Closed`) to hide
- `status` column for **Volunteering**: type `active` to show, `inactive` to hide
- `image` column: paste the Google Drive shareable URL (see Step 1b)
- `registerlink`: paste the external registration URL (for programs only)

---

## STEP 1b — Upload Images to Google Drive

1. Create a folder in Google Drive called `Centre Images`
2. Upload your images there
3. Right-click any image → **Share** → **Anyone with the link can view** → Copy link
4. The link looks like: `https://drive.google.com/file/d/FILEID/view`
5. Convert it to a direct image URL:
   - Take the `FILEID` from the link
   - Use this format: `https://drive.google.com/uc?id=FILEID`
   - Paste **that** URL into the image column

---

## STEP 2 — Set Up Google Apps Script

1. In your Google Sheet → click **Extensions** → **Apps Script**
2. Delete all existing code in the editor
3. Open `apps-script.js` from your files → **copy all the code**
4. Paste it into the Apps Script editor
5. Click 💾 **Save** (name the project "Centre Website")

### Deploy as Web App:
1. Click **Deploy** (top right) → **New deployment**
2. Click the gear icon ⚙️ next to "Type" → select **Web app**
3. Fill in:
   - Description: `Centre Website`
   - Execute as: **Me** (your email)
   - Who has access: **Anyone** ⚠️ **IMPORTANT: Must be "Anyone", not "Anyone with Google account"**
4. Click **Deploy**
5. Click **Authorize access** → Choose your Google account → Allow
6. **Copy the Web App URL** — it looks like:
   `https://script.google.com/macros/s/XXXXXXXXX/exec`
   
   ⚠️ **CRITICAL**: The URL must end with `/exec` (not `/dev`) for the website to access it

---

## STEP 3 — Paste the URL into config.js

1. Open `config.js`
2. Replace `YOUR_APPS_SCRIPT_URL_HERE` with the URL you copied
3. Save the file

```js
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/XXXXXX/exec";
```

---

## STEP 4 — Host on GitHub Pages

1. Go to **github.com** → Sign up (free)
2. Click **New repository**
   - Name: `centre-website`
   - Visibility: **Public**
   - Click **Create repository**
3. Click **uploading an existing file**
4. Drag and drop ALL your files:
   - index.html
   - programs.html
   - volunteering.html
   - detail.html
   - style.css
   - config.js
5. Click **Commit changes**
6. Go to **Settings** → **Pages** (left sidebar)
7. Under "Branch" → select **main** → click **Save**
8. Wait ~1 minute → your site is live at:
   `https://yourusername.github.io/centre-website`

---

## STEP 5 — Add Your First Program

1. Open your Google Sheet → `Programs` tab
2. Add a row under the headers:

| title | description | date | location | duration | image | registerlink | status |
|-------|-------------|------|----------|----------|-------|--------------|--------|
| Morning Yoga | A rejuvenating yoga session... | May 10, 2025 | Isha Place, Budigere, Bangalore | 2 hours | https://drive.google.com/uc?id=YOUR_ID | https://bookmyshow.com/... | Open |

3. Go to your website URL → click Programs → your listing appears!

---

## How to Update Content Later

- **Add a program/volunteering:** Add a new row in the Google Sheet → site updates instantly
- **Hide a program:** Change `status` to `Closed` (or anything except `Open`)
- **Hide a volunteering item:** Change `status` to `inactive`
- **Update website design:** Edit the HTML/CSS files on GitHub

---

## Troubleshooting

### 🔍 Use the Diagnostic Tool
Open `test-api.html` in your browser to test your Google Apps Script connection and get specific error messages.

**"Could not load programs" error / CORS error / Blocked by CORS policy:**
- ✅ Check that your Apps Script URL is correctly pasted in `config.js`
- ✅ **CRITICAL**: Make sure you deployed with "Who has access: **Anyone**" (NOT "Anyone with Google account")
- ✅ Verify the URL ends with `/exec` (not `/dev`)
- ✅ After changing deployment settings, you must create a **New deployment** (not just re-save)
- ✅ Clear your browser cache and try again (Ctrl+Shift+R or Cmd+Shift+R)

**Images not showing:**
- Make sure you used the `https://drive.google.com/uc?id=FILEID` format
- Check that the Drive file is shared as "Anyone with link"

**Form submissions not saving:**
- Re-deploy your Apps Script (Deploy → Manage deployments → Edit → New Version)
- Make sure you authorized the script

---

## Your Site Structure

```
yourusername.github.io/centre-website/
├── index.html         ← Home
├── programs.html      ← All programs
├── volunteering.html  ← All volunteering
├── detail.html        ← Single item detail
├── style.css          ← Styling
└── config.js          ← Apps Script URL
```
