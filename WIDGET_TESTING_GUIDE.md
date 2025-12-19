# Widget Testing Guide - CORS Fix

## Problem Identified

You were getting CORS errors because:

1. Opening HTML files directly in browser uses `file://` protocol
2. This creates cross-origin issues when calling your Railway API
3. Your backend CORS configuration didn't include the local test server

## Solution Implemented

### 1. Local Development Server

Created `widget/serve-widget.js` - a simple HTTP server to serve your widget files:

```bash
node widget/serve-widget.js
```

This serves files at `http://localhost:8080` instead of `file://` protocol.

### 2. Backend Testing Tools

- `widget/test-backend.js` - Tests your Railway backend directly
- `widget/test-local.js` - Tests local server setup
- `scripts/update-railway-cors.js` - Helps update Railway configuration

### 3. CORS Configuration Update

Updated `.env` file to include `http://localhost:8080` in `ALLOWED_ORIGINS`.

## Quick Fix Steps

### Step 1: Start Local Server

```bash
node widget/serve-widget.js
```

Server will run at `http://localhost:8080`

### Step 2: Deploy CORS Fix to Railway

Choose one method:

**Option A: Git Deploy (Recommended)**

```bash
git add .
git commit -m "fix: update CORS origins for local testing"
git push origin main
```

**Option B: Railway CLI**

```bash
railway variables set ALLOWED_ORIGINS="https://bilal.metalogics.io,https://metalogics.io,https://www.metalogics.io,http://localhost:5173,http://localhost:3000,http://localhost:4173,http://localhost:8080,https://latest-chatbot-production.up.railway.app"
```

**Option C: Railway Dashboard**

1. Go to https://railway.app/dashboard
2. Select your project: `latest-chatbot-production`
3. Go to Variables tab
4. Update `ALLOWED_ORIGINS` with the value from Step 2

### Step 3: Test the Fix

1. Wait 1-2 minutes for Railway to redeploy
2. Open: `http://localhost:8080/test-connection.html`
3. Click "Test API Connection"
4. Should see ✅ success messages instead of CORS errors

## Available Test Pages

Once your local server is running:

- `http://localhost:8080/test-connection.html` - Connection testing
- `http://localhost:8080/test-widget.html` - Full widget test
- `http://localhost:8080/simple-integration.html` - Simple integration
- `http://localhost:8080/integration-example.html` - Integration example

## Verification Commands

```bash
# Test backend connectivity
node widget/test-backend.js

# Test local server
node widget/test-local.js

# Show Railway update instructions
node scripts/update-railway-cors.js
```

## What Was Fixed

✅ **CORS Configuration**: Added `http://localhost:8080` to allowed origins
✅ **Local Server**: Created proper HTTP server for widget files  
✅ **Testing Tools**: Added comprehensive testing scripts
✅ **Documentation**: Created troubleshooting guides

## Expected Results

After deploying the CORS fix:

- ✅ No more "Not allowed by CORS" errors
- ✅ API connections work from local server
- ✅ Widget loads and functions properly
- ✅ Booking flow works end-to-end

## If Issues Persist

1. Check Railway deployment logs
2. Verify environment variables are updated
3. Test backend directly: `node widget/test-backend.js`
4. Check browser console for specific errors
5. Ensure local server is running on port 8080

The main issue was the `file://` protocol causing CORS problems. Using a proper HTTP server resolves this completely.
