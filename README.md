# Isha Place – Budigere Website

Official website for Isha Place, Budigere center, showcasing programs, volunteering opportunities, and facilitating community engagement in Bengaluru East.

## Features

- 🎯 **Dynamic programs listing** with real-time search and frequency filters (Daily / Weekly / Monthly / Special)
- 🤝 **Volunteering opportunities** management with an interest-submission form
- 📱 **WhatsApp number validation** — 10-digit Indian mobile numbers (starts with 6–9)
- 📊 **Google Sheets as CMS** — no database required; manage content directly in a spreadsheet
- 🎨 **Mobile-responsive design** with an elegant, spiritual aesthetic
- 📨 **Multiple contact forms** — General Inquiry, Program Registration, and Volunteering Interest
- ⚡ **Static site** — pure HTML/CSS/JS, fast loading, trivially hostable on GitHub Pages

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Pure HTML5, CSS3, JavaScript (no frameworks) |
| Backend | Google Apps Script (Web App) |
| CMS | Google Sheets |
| Hosting | GitHub Pages |

## Live Site

> Replace the URL below once you deploy to GitHub Pages.

[https://HarshithSharma.github.io/isha-budigerecross/](https://HarshithSharma.github.io/isha-budigerecross/)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/HarshithSharma/isha-budigerecross.git
cd isha-budigerecross
```

No build step is required — open `index.html` directly in a browser to preview the site.

The site ships with built-in **demo data** (`CONFIG.useDemoData = true` in `app.js`) so you can preview all features immediately without any backend setup.

---

### 2. Set up Google Sheets (CMS)

1. Create a new Google Sheet.
2. Add two sheets (tabs) named exactly:
   - **Programs** — with these columns in row 1:
     ```
     id | title | description | frequency | schedule | venue | contact
     ```
     `frequency` should be one of: `daily`, `weekly`, `monthly`, `special`
   - **Volunteers** — with these columns in row 1:
     ```
     id | title | icon | description | tags
     ```
     `tags` is a comma-separated list, e.g. `Design, Writing, Social Media`
3. Copy the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/  ← SHEET_ID →  /edit
   ```

---

### 3. Deploy the Google Apps Script backend

1. Open [Google Apps Script](https://script.google.com/).
2. Create a new project (name it e.g. *Isha Budigere*).
3. Replace the default `Code.gs` content with the contents of `Code.gs` in this repo.
4. Set `SHEET_ID` to your Google Sheet ID.
5. Click **Deploy → New Deployment**:
   - Type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click **Deploy** and copy the **Web App URL**.

---

### 4. Connect the frontend to the backend

Open `app.js` and update the `CONFIG` object:

```js
const CONFIG = {
  appsScriptUrl: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
  useDemoData: false,   // ← set to false once the Apps Script is live
};
```

---

### 5. Deploy to GitHub Pages

1. Push your changes to the `main` branch.
2. In the repository, go to **Settings → Pages**.
3. Set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. GitHub will publish the site at `https://<username>.github.io/<repo-name>/`.

---

## Project Structure

```
isha-budigerecross/
├── index.html     # Main single-page site
├── styles.css     # Mobile-responsive stylesheet
├── app.js         # Frontend logic (search, filters, forms, validation)
├── Code.gs        # Google Apps Script backend
└── README.md
```

## Form Submissions

All form submissions are stored in a **Submissions** sheet that Apps Script creates automatically on the first submission. Columns:

| Timestamp | Form Type | Name | WhatsApp | Email | Area / Program | Participants | Message / Notes |

## WhatsApp Validation

Indian mobile numbers are validated client-side:
- Must be exactly **10 digits**
- Must start with **6, 7, 8, or 9**
- Regex: `/^[6-9]\d{9}$/`
- The `+91` country code prefix is added automatically before storing

## Content Management

Update the website content by editing the Google Sheet — no code changes needed:
- Add/edit/remove rows in the **Programs** sheet to update the programs listing.
- Add/edit/remove rows in the **Volunteers** sheet to update volunteering opportunities.
- Changes are reflected on the site instantly on the next page load.

## Contributing

This site is maintained by volunteers of Isha Place, Budigere. Contributions are welcome — please open an issue or pull request.

---

*Crafted with ❤️ by the Isha Budigere volunteer team.*
