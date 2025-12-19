# Widget Troubleshooting Guide

## Quick Fix for CORS Errors

The CORS errors you're seeing are likely because you're opening HTML files directly in the browser (file:// protocol). Here's how to fix it:

### Step 1: Test Your Backend

```bash
node widget/test-backend.js
```

This will test if your Railway backend is responding correctly.

### Step 2: Serve Widget Files Locally

Instead of opening HTML files directly, run a local server:

```bash
node widget/serve-widget.js
```

Then open: http://localhost:8080/test-connection.html

### Step 3: Check Results

- ✅ **All tests pass**: Your setup is working correctly
- ❌ **Backend tests fail**: Check your Railway deployment
- ❌ **CORS errors persist**: Check the allowed origins in your .env file

## Common Issues & Solutions

### 1. "Connection failed: Failed to fetch"

**Cause**: Backend server is not running or not accessible
**Solution**:

- Check Railway deployment status
- Verify your API_BASE_URL in .env
- Run `node widget/test-backend.js` to diagnose

### 2. "Not allowed by CORS"

**Cause**: Origin not in ALLOWED_ORIGINS list
**Solution**:

- Add `http://localhost:8080` to ALLOWED_ORIGINS in .env
- Redeploy to Railway
- Or use the local server method above

### 3. "Authentication failed (401/403)"

**Cause**: API key mismatch
**Solution**:

- Verify API_KEY in .env matches widget-config.js
- Check API_KEY_HEADER setting (should be "Authorization" or "X-API-Key")

### 4. "Service unavailable (503)"

**Cause**: Database connection issue
**Solution**:

- Check DATABASE_URL in Railway environment variables
- Verify database is accessible from Railway

## Environment Variables Checklist

Make sure these are set in your Railway environment:

```env
# Required for CORS
ALLOWED_ORIGINS=https://bilal.metalogics.io,http://localhost:8080,http://localhost:3000

# Required for API
API_KEY=c608cf9ace6a39a48451f2fc67a15e08c00a1f2c287d21ed38ea4c0652fa500d
API_KEY_HEADER=X-API-Key

# Required for database
DATABASE_URL=postgresql://...
```

## Testing Workflow

1. **Backend Test**: `node widget/test-backend.js`
2. **Local Server**: `node widget/serve-widget.js`
3. **Browser Test**: http://localhost:8080/test-connection.html
4. **Widget Test**: http://localhost:8080/test-widget.html

## Debug Information

If issues persist, check:

- Railway deployment logs
- Browser developer console (F12)
- Network tab in browser dev tools
- Railway environment variables

## Contact Support

If you're still having issues, provide:

- Output from `node widget/test-backend.js`
- Browser console errors
- Railway deployment logs
