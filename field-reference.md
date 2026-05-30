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
| **image** | Image | [Insert in cell] or URL | Insert image directly in cell OR paste URL. See Image Format. |
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
| **image** | Image | [Insert in cell] or URL | Insert image directly in cell OR paste URL. See Image Format. |
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

### Two Ways to Add Images

#### Method 1: Paste Image URL (Recommended)

Simply paste a publicly accessible image URL into the `image` column.

**This is the easiest and most reliable method.**

#### Method 2: Insert Image Over Cells

1. In your Google Sheet, click on a cell in the `image` column
2. Go to **Insert** → **Image** → **Image over cells**
3. Upload or select your image
4. Resize and position the image to cover the cell

**Important:** You MUST use "Image over cells" NOT "Image in cell". The Apps Script can only read images placed over cells.

**Supported formats:**
- Direct image URLs (e.g., `https://example.com/image.jpg`)
- Googleusercontent URLs (e.g., `https://lh3.googleusercontent.com/...`)
- Any publicly accessible image URL

**Example:**
```
https://lh3.googleusercontent.com/d/1a2B3c4D5e6F7g8H9i0J
```

**Requirements:**
- Image must be publicly accessible (no authentication required)
- Use HTTPS URLs for security
- Recommended image size: 800x800px or larger for best quality
- Supported formats: JPG, PNG, WebP

**Troubleshooting:**
- If images show as "CellImage", you used "Image in cell" - use "Image over cells" instead or switch to Method 1 (paste URL)
- If images don't load, verify the URL is publicly accessible
- Test URLs by pasting them directly into your browser
- For inserted images, make sure they're positioned to cover the image column cell
- Leave the `image` column empty to show a default 🌿 icon

---

## Example Row Data

### Programs Example

| title | description | date | location | duration | image | registerlink | status | frequency | timings |
|-------|-------------|------|----------|----------|-------|--------------|--------|-----------|---------|
| Inner Engineering | A comprehensive program... | June 10-17, 2025 | Isha Place, Budigere | 7 days | https://lh3.googleusercontent.com/d/ABC123 | https://isha.sadhguru.org/ie | Open | Scheduled | 6:00 AM - 8:00 PM |
| Morning Yoga | Daily yoga practice for all levels | Every day | Isha Place, Budigere | 1.5 hours | https://lh3.googleusercontent.com/d/XYZ789 | | Open | Daily | 6:00 AM - 7:30 AM |

### Volunteering Example

| title | description | date | location | duration | image | status |
|-------|-------------|------|----------|----------|-------|--------|
| Kitchen Volunteer | Help prepare meals for visitors | Weekdays | Isha Place, Budigere | 3-4 hours/day | https://lh3.googleusercontent.com/d/DEF456 | active |

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
