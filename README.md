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

## Troubleshooting

If you're having issues connecting to Google Apps Script, open `test-api.html` in your browser to diagnose the problem. This tool will:
- Check your configuration
- Test the API endpoints
- Provide specific error messages and solutions

Common issues:
- **CORS errors**: Make sure your Apps Script is deployed with "Who has access: Anyone" (not "Anyone with Google account")
- **404 errors**: Verify the URL in `config.js` is correct and ends with `/exec`
- See `setup-guide.md` for detailed troubleshooting steps

