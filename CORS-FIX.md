# CORS Fix for Google Apps Script Integration

## Problem
The front-end JavaScript was unable to read the Google Sheet deployed as a script, resulting in CORS (Cross-Origin Resource Sharing) errors in the browser console.

## Root Cause
Google Apps Script Web Apps handle CORS automatically, **BUT only when deployed with the correct settings**. The most common causes of CORS errors are:

1. **Incorrect Access Setting**: Deploying with "Anyone with Google account" instead of "Anyone"
2. **Wrong URL**: Using the `/dev` URL instead of the `/exec` URL
3. **Outdated Deployment**: Not creating a new deployment after changing settings

## Solution

### Step 1: Verify Your Deployment Settings
1. Open your Google Sheet
2. Go to **Extensions** → **Apps Script**
3. Click **Deploy** → **Manage deployments**
4. Click the ✏️ pencil icon to edit your deployment
5. Make sure these settings are correct:
   - **Execute as**: Me (your email)
   - **Who has access**: **Anyone** ⚠️ (NOT "Anyone with Google account")
6. Click **Deploy**
7. Copy the new Web App URL (it should end with `/exec`)

### Step 2: Update Your config.js
1. Open `config.js` in your project
2. Replace the URL with your new deployment URL
3. Make sure it ends with `/exec` (not `/dev`)

```javascript
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_ID_HERE/exec";
```

### Step 3: Test Your Connection
1. Open `test-api.html` in your browser
2. Click "Run Test" for both Programs and Volunteering
3. If you see green ✅ checkmarks, you're all set!
4. If you see red ❌ errors, follow the specific instructions shown

### Step 4: Clear Your Browser Cache
Sometimes the browser caches the CORS error. Press:
- **Windows/Linux**: Ctrl + Shift + R
- **Mac**: Cmd + Shift + R

## Understanding CORS

### What is CORS?
CORS (Cross-Origin Resource Sharing) is a security feature in web browsers that blocks JavaScript from one domain (e.g., `yourusername.github.io`) from accessing data from another domain (e.g., `script.google.com`) unless the server explicitly allows it.

### How Google Apps Script Handles CORS
When you deploy a Google Apps Script as a Web App with "Anyone" access:
- Google automatically adds the necessary CORS headers
- Your website can fetch data without CORS errors
- No manual header configuration is needed

### Why "Anyone with Google account" Doesn't Work
When deployed with "Anyone with Google account", Google Apps Script:
- Requires authentication before serving data
- Does not add proper CORS headers for unauthenticated requests
- Causes browsers to block the response

## Common Error Messages

### "Failed to fetch" or "Network request failed"
**Cause**: The URL is incorrect or the deployment doesn't exist
**Fix**: Check the URL in `config.js` matches your Apps Script deployment URL

### "Access to fetch blocked by CORS policy"
**Cause**: The script is deployed with "Anyone with Google account" instead of "Anyone"
**Fix**: Edit your deployment → Change "Who has access" to "Anyone" → Create new deployment

### "Authorization needed"
**Cause**: The script hasn't been authorized or the deployment is private
**Fix**: Re-deploy with "Execute as: Me" and "Who has access: Anyone", then authorize

## Technical Details

### What Changed in the Code?
1. **apps-script.js**: Added comments explaining that CORS is handled automatically
2. **setup-guide.md**: Added explicit warnings about deployment settings
3. **test-api.html**: NEW - Interactive diagnostic tool to help debug connection issues
4. **README.md**: Added troubleshooting section referencing the diagnostic tool

### Why No Code Changes Were Needed
Google Apps Script handles CORS automatically when deployed correctly. The issue is not in the code but in the deployment configuration. The changes made are:
- Documentation improvements
- Troubleshooting guidance
- A diagnostic tool to help users identify and fix deployment issues

## Additional Resources

- [Google Apps Script Web Apps Documentation](https://developers.google.com/apps-script/guides/web)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- See `setup-guide.md` for full setup instructions
- Use `test-api.html` for real-time debugging

## Still Having Issues?

If you've followed all the steps and still see errors:

1. **Double-check the URL**: Make sure it ends with `/exec` and is correctly pasted in `config.js`
2. **Create a NEW deployment**: Don't just re-deploy the existing one
3. **Clear ALL browser data**: Sometimes a hard refresh isn't enough
4. **Try a different browser**: This helps identify if it's a browser-specific issue
5. **Check the browser console**: Open Developer Tools (F12) and look for specific error messages
6. **Use the diagnostic tool**: `test-api.html` will show exactly what's wrong

## Summary

The fix for CORS issues with Google Apps Script is **not a code change** but a **deployment configuration fix**:
- Deploy with "Who has access: **Anyone**"
- Use the `/exec` URL (not `/dev`)
- Create a new deployment after changing settings
- Use `test-api.html` to verify everything works
