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
- `image` column: paste a direct image URL (e.g., from Googleusercontent)
- `registerlink`: paste the external registration URL (for programs only)

---

## STEP 1b — Adding Images

You have two options for adding images:

### Option 1: Paste Image URLs (Recommended)

1. Host your image somewhere (Google Drive, image hosting service, etc.)
2. Get a publicly accessible URL (e.g., `https://lh3.googleusercontent.com/...`)
3. Paste the URL directly into the `image` column as text

**This is the easiest and most reliable method.**

### Option 2: Insert Images Over Cells

1. Go to **Insert** → **Image** → **Image over cells**
2. Upload your image
3. Resize and position it to cover the cell in the `image` column

**Important:** Use "Image over cells" NOT "Image in cell". Images inserted "in cell" will show as "CellImage" text and won't work.

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
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Click **Authorize access** → Choose your Google account → Allow
6. **Copy the Web App URL** — it looks like:
   `https://script.google.com/macros/s/XXXXXXXXX/exec`

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
| Morning Yoga | A rejuvenating yoga session... | May 10, 2025 | Isha Place, Budigere, Bangalore | 2 hours | https://lh3.googleusercontent.com/d/YOUR_ID | https://bookmyshow.com/... | Open |

3. Go to your website URL → click Programs → your listing appears!

---

## How to Update Content Later

- **Add a program/volunteering:** Add a new row in the Google Sheet → site updates instantly
- **Hide a program:** Change `status` to `Closed` (or anything except `Open`)
- **Hide a volunteering item:** Change `status` to `inactive`
- **Update website design:** Edit the HTML/CSS files on GitHub

---

## Troubleshooting

**"Could not load programs" error:**
- Check that your Apps Script URL is correctly pasted in `config.js`
- Make sure you deployed with "Anyone" access

**Images not showing:**
- Make sure the image URL is publicly accessible
- Test the URL by pasting it directly into your browser
- Verify the URL starts with `https://`

**Form submissions not saving:**
- Re-deploy your Apps Script (Deploy → Manage deployments → Edit → Deploy)
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
