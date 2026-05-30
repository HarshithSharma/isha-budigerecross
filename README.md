# Isha Place – Budigere (static site)

## Run locally

From this folder:

```bash
chmod +x serve.sh   # first time only
./serve.sh
```

Then open [http://localhost:8765/](http://localhost:8765/).

Use another port if this one is busy:

```bash
PORT=8080 ./serve.sh
```

Set your Apps Script web app URL in `config.js` (see `setup-guide.md`) so programs, volunteering, and forms work against your Google Sheet.

---

## Deploy to GitHub Pages

This site is deployed as a **static HTML** site using GitHub Actions (no Jekyll).

### Prerequisites

- A GitHub account
- Git installed locally
- [GitHub CLI (`gh`)](https://cli.github.com/) installed (optional, for command-line setup)

### Step 1 — Create the repository

```bash
git init
git remote add origin https://github.com/<your-username>/<your-repo>.git
git add -A
git commit -m "Initial commit"
git push -u origin main
```

### Step 2 — Add your Apps Script URL

Create a `config.js` file in the root (see `config.example.js` for the template):

```js
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
```

> **Note:** This URL is a public endpoint. Anyone with the URL can call it. If that's acceptable, commit it to the repo. Otherwise keep it gitignored and the hosted site won't make API calls.

### Step 3 — Enable GitHub Pages via GitHub Actions

The repo includes a workflow at `.github/workflows/static.yml` that deploys the site as raw static HTML (bypassing Jekyll).

**Option A — Via GitHub web UI:**

1. Go to your repo → **Settings** → **Pages**
2. Under **Build and deployment → Source**, select **GitHub Actions**
3. The workflow will auto-trigger on the next push to `main`

**Option B — Via GitHub CLI:**

```bash
# Authenticate (one-time)
gh auth login -p https -h github.com -w

# Switch Pages source to GitHub Actions
gh api repos/<your-username>/<your-repo>/pages -X PUT -f build_type=workflow

# Manually trigger the deploy workflow
gh workflow run static.yml --ref main
```

### Step 4 — Verify

After 1–2 minutes, your site will be live at:

```
https://<your-username>.github.io/<your-repo>/
```

### Redeployment

Every push to `main` automatically triggers a new deployment. No manual steps needed.

### Troubleshooting

| Issue | Fix |
|-------|-----|
| Site shows raw markdown or Jekyll theme | Ensure **Source** is set to "GitHub Actions" (not "Deploy from a branch") in Pages settings |
| CSS/JS not loading | Verify `.nojekyll` file exists in the repo root |
| Forms/programs not working | Check that `config.js` is committed with a valid Apps Script URL |
| 404 on subpages | Ensure all HTML files are in the repo root (not in a subfolder) |
