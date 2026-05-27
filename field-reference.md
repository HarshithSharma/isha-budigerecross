# Field Reference Guide

Complete reference for all fields in your Google Sheet for the Isha Place, Budigere website.

---

## Programs Sheet

### Required Columns

| Column | Description | Example | Notes |
|--------|-------------|---------|-------|
| **title** | Program name | `Inner Engineering` | Required. Shows as the main heading. |
| **description** | Full description | `A comprehensive course that explores...` | Can be long text. |
| **date** | Date or schedule | `June 10-17, 2025` or `Every Sunday` | Flexible format. Shows on card. |
| **location** | Venue | `Isha Place, Budigere, Bangalore` | Shows with 📍 icon. |
| **duration** | Time length | `7 days` or `2 hours` | Displays below date. |
| **image** | Google Drive URL | `https://drive.google.com/uc?id=FILE_ID` | See Image Format section below. |
| **registerlink** | Registration URL | `https://isha.sadhguru.org/register` | External registration link. Optional. |
| **status** | Visibility control | `Open` or `Closed` | See Status Keywords section. |

### Optional Columns

| Column | Description | Example | Notes |
|--------|-------------|---------|-------|
| **frequency** | Recurrence type | `Daily`, `Weekly`, `Monthly`, `Scheduled` | Powers filter buttons. See Frequency Keywords. |
| **timings** | Time of day | `6:00 AM - 7:30 AM` | Shows on program card. |

---

## Volunteering Sheet

### Required Columns

| Column | Description | Example | Notes |
|--------|-------------|---------|-------|
| **title** | Opportunity name | `Kitchen Volunteer` | Required. Shows as the main heading. |
| **description** | Full description | `Help prepare meals for visitors...` | Can be long text. |
| **date** | Schedule | `Weekdays` or `Flexible` | Flexible format. |
| **location** | Where | `Isha Place, Budigere` | Shows with 📍 icon. |
| **duration** | Commitment | `3-4 hours per day` | Time requirement. |
| **image** | Google Drive URL | `https://drive.google.com/uc?id=FILE_ID` | See Image Format section. |
| **status** | Visibility control | `active` or `inactive` | See Status Keywords section. |

---

## Status Keywords

### For Programs Sheet

Use the **`status`** column to control visibility:

| Value | Effect | Use Case |
|-------|--------|----------|
| `Open` | ✅ Shows on website | Program is accepting registrations |
| `Closed` | ❌ Hidden from website | Registration closed |
| `Full` | ❌ Hidden from website | Program is full |
| _(anything else)_ | ❌ Hidden from website | Default behavior |
| _(empty)_ | ❌ Hidden from website | No status = hidden |

**Important:** Must be exactly `Open` (capital O, lowercase pen) to show.

### For Volunteering Sheet

Use the **`status`** column to control visibility:

| Value | Effect | Use Case |
|-------|--------|----------|
| `active` | ✅ Shows on website | Currently recruiting volunteers |
| `inactive` | ❌ Hidden from website | Not currently recruiting |
| _(empty)_ | ❌ Hidden from website | No status = hidden |

**Note:** Case-insensitive. `active`, `Active`, or `ACTIVE` all work.

---

## Frequency Keywords

**Column name:** `frequency` (in Programs sheet)

These keywords control which filter button will show the program:

### Daily Programs

Use any of these values:
- `Daily`
- `Daily meditation`
- `Daily yoga`
- _(anything starting with "daily")_

**Shows in:** "Daily" filter button

### Weekly Programs

Use any of these values:
- `Weekly`
- `Weekly class`
- `Weekly session`
- _(anything starting with "weekly")_

**Shows in:** "Weekly" filter button

### Monthly Programs

Use any of these values:
- `Monthly`
- `Monthly retreat`
- `Monthly gathering`
- _(anything starting with "monthly")_

**Shows in:** "Monthly" filter button

### Scheduled Programs (One-time Events)

Use any of these values:
- `Scheduled`
- `Once`
- `One-time`
- `One time`
- `Event`
- _(anything containing these words)_

**Shows in:** "Scheduled Programs" filter button

### All Programs

If you don't add a `frequency` column, or leave it empty, programs show in the "All" filter only.

**Notes:**
- Keywords are **case-insensitive** (`daily` = `Daily` = `DAILY`)
- Whitespace is automatically normalized
- A program can only match ONE filter category
- All programs always show in the "All" filter

---

## Image Format

### Getting the Google Drive Image URL

1. Upload your image to Google Drive
2. Right-click the image → **Share** → **Anyone with the link can view**
3. Click **Copy link** — you'll get something like:
   ```
   https://drive.google.com/file/d/1a2B3c4D5e6F7g8H9i0J/view?usp=sharing
   ```
4. Extract the FILE_ID (the long string between `/d/` and `/view`)
5. Convert to direct image URL:
   ```
   https://drive.google.com/uc?id=FILE_ID
   ```
6. Paste this URL into the `image` column

**Example:**
- Original: `https://drive.google.com/file/d/1a2B3c4D5e6F7g8H9i0J/view`
- Use this: `https://drive.google.com/uc?id=1a2B3c4D5e6F7g8H9i0J`

**Troubleshooting:**
- If images don't load, verify the Drive file is shared as "Anyone with the link"
- The code automatically converts various Drive URL formats
- Leave the `image` column empty to show a default 🌿 icon

---

## Example Row Data

### Programs Example

| title | description | date | location | duration | image | registerlink | status | frequency | timings |
|-------|-------------|------|----------|----------|-------|--------------|--------|-----------|---------|
| Inner Engineering | A comprehensive program... | June 10-17, 2025 | Isha Place, Budigere | 7 days | https://drive.google.com/uc?id=ABC123 | https://isha.sadhguru.org/ie | Open | Scheduled | 6:00 AM - 8:00 PM |
| Morning Yoga | Daily yoga practice for all levels | Every day | Isha Place, Budigere | 1.5 hours | https://drive.google.com/uc?id=XYZ789 | | Open | Daily | 6:00 AM - 7:30 AM |

### Volunteering Example

| title | description | date | location | duration | image | status |
|-------|-------------|------|----------|----------|-------|--------|
| Kitchen Volunteer | Help prepare meals for visitors | Weekdays | Isha Place, Budigere | 3-4 hours/day | https://drive.google.com/uc?id=DEF456 | active |

---

## Quick Tips

✅ **DO:**
- Use exact status keywords: `Open` for programs, `active` for volunteering
- Keep titles concise (under 50 characters works best)
- Use consistent date formats
- Always make Drive images publicly viewable
- Add frequency values to enable filter buttons

❌ **DON'T:**
- Use `active` for Programs (use `Open` instead)
- Use `Open` for Volunteering (use `active` instead)
- Leave the first column (title) empty — row will be skipped
- Use complex HTML in descriptions
- Forget to re-deploy Apps Script after changing the sheet structure

---

## Testing Your Changes

1. Make changes in Google Sheet
2. Save (changes auto-save)
3. Refresh your website (Ctrl+F5 for hard refresh)
4. Check browser console (F12) for any error messages
5. If changes don't appear, verify:
   - Status is correct (`Open` or `active`)
   - Title column is not empty
   - Apps Script is deployed with "Anyone" access

---

## Need Help?

- See [setup-guide.md](setup-guide.md) for initial setup
- Check that your Apps Script URL is correctly set in [config.js](config.js)
- Make sure the sheet tab names match exactly: `Programs` and `Volunteering`
