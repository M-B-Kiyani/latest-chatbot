# Frontend to Backend Connection Guide

## ✅ Completed Steps

Your frontend has been successfully configured to connect to your Railway backend at:
**`https://latest-chatbot-production.up.railway.app`**

### What Was Updated:

1. **Backend Configuration (.env)**:

   - ✅ Updated `API_BASE_URL` to your new Railway URL
   - ✅ Added new URL to `ALLOWED_ORIGINS` for CORS
   - ✅ Updated Retell webhook URLs

2. **Widget Configuration**:

   - ✅ `widget/widget-config.js` - Already configured correctly
   - ✅ `widget/booking-widget-embed.js` - Already configured correctly
   - ✅ `widget/booking-widget.html` - Updated with correct API key

3. **Test Files Created**:
   - ✅ `widget/test-connection.html` - Connection testing page

## 🚀 Next Steps

### 1. Deploy Your Backend to Railway

Make sure your backend is deployed with the updated configuration:

```bash
# If using Railway CLI
railway up

# Or push to your connected Git repository
git add .
git commit -m "Update backend URL configuration"
git push origin main
```

### 2. Configure Environment Variables in Railway

In your Railway dashboard, ensure these environment variables are set:

**Required Variables:**

```
DATABASE_URL=your_postgresql_connection_string
API_KEY=c608cf9ace6a39a48451f2fc67a15e08c00a1f2c287d21ed38ea4c0652fa500d
SMTP_HOST=smtp.hostinger.com
SMTP_USER=bilal@metalogics.io
SMTP_PASSWORD=BKiani123@0
GOOGLE_CALENDAR_ENABLED=true
HUBSPOT_ENABLED=true
```

**CORS Configuration:**

```
ALLOWED_ORIGINS=https://bilal.metalogics.io,https://metalogics.io,https://www.metalogics.io,http://localhost:5173,http://localhost:3000,http://localhost:4173,https://latest-chatbot-production.up.railway.app
```

### 3. Test the Connection

1. **Open the test page**: `widget/test-connection.html` in your browser
2. **Click "Test API Connection"** to verify the backend is responding
3. **Click "Test Available Slots"** to test the booking functionality

### 4. Deploy Your Frontend

#### Option A: Static Hosting (Netlify, Vercel, etc.)

```bash
# Upload these files to your static host:
- widget/booking-widget.html (standalone page)
- widget/booking-widget-embed.js (embeddable widget)
- widget/widget-config.js (configuration)
```

#### Option B: Embed in Existing Website

```html
<!-- Add this to your HTML page -->
<div id="booking-widget-container"></div>
<script src="booking-widget-embed.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", function () {
    new BookingWidget({
      apiKey:
        "c608cf9ace6a39a48451f2fc67a15e08c00a1f2c287d21ed38ea4c0652fa500d",
      apiBaseUrl: "https://latest-chatbot-production.up.railway.app",
      containerId: "booking-widget-container",
    });
  });
</script>
```

## 🔧 Troubleshooting

### Common Issues:

1. **503 Database Error**:

   - Check your `DATABASE_URL` in Railway environment variables
   - Ensure your PostgreSQL database is running and accessible

2. **401 Authentication Error**:

   - Verify the API key matches in both frontend and backend
   - Check the `X-API-Key` header is being sent correctly

3. **CORS Errors**:

   - Ensure your domain is in the `ALLOWED_ORIGINS` environment variable
   - Check that CORS is properly configured in your backend

4. **No Available Slots**:
   - Check your business hours configuration
   - Verify Google Calendar integration is working
   - Ensure the date range is within your booking rules

### Testing Commands:

```bash
# Test API connection
curl -X GET "https://latest-chatbot-production.up.railway.app/api/bookings/available-slots?startDate=2024-12-20T00:00:00Z&endDate=2024-12-21T00:00:00Z&duration=30" \
  -H "Accept: application/json" \
  -H "X-API-Key: c608cf9ace6a39a48451f2fc67a15e08c00a1f2c287d21ed38ea4c0652fa500d"

# Test booking creation
curl -X POST "https://latest-chatbot-production.up.railway.app/api/bookings" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: c608cf9ace6a39a48451f2fc67a15e08c00a1f2c287d21ed38ea4c0652fa500d" \
  -d '{
    "name": "Test User",
    "company": "Test Company",
    "email": "test@example.com",
    "inquiry": "Test booking",
    "timeSlot": {
      "startTime": "2024-12-20T10:00:00Z",
      "duration": 30
    }
  }'
```

## 📁 File Structure

```
widget/
├── booking-widget.html          # Standalone booking page
├── booking-widget-embed.js      # Embeddable widget script
├── widget-config.js            # Configuration file
├── test-connection.html        # Connection testing page
├── integration-example.html    # Integration examples
└── README.md                   # Widget documentation
```

## 🎯 Success Criteria

Your setup is complete when:

- ✅ Test connection page shows "API Connection successful"
- ✅ Available slots load without errors
- ✅ Booking form submits successfully
- ✅ Confirmation emails are sent
- ✅ Bookings appear in Google Calendar (if enabled)
- ✅ Contacts sync to HubSpot (if enabled)

## 🔐 Security Notes

- Your API key is included in the frontend code - consider implementing a more secure authentication method for production
- Ensure HTTPS is used for all communications
- Regularly rotate your API keys
- Monitor your Railway logs for any suspicious activity

## 📞 Support

If you encounter issues:

1. Check the browser console for JavaScript errors
2. Review Railway deployment logs
3. Test API endpoints directly using curl or Postman
4. Verify all environment variables are set correctly in Railway
