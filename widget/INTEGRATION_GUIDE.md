# Metalogics Chat Widget - Integration Guide

A clean, production-ready chat widget with Metalogics branding and full API integration.

## 🚀 Quick Start

### For bilal.metalogics.io on Hostinger

**Step 1: Upload File**

1. Login to Hostinger Control Panel
2. Go to **File Manager**
3. Navigate to `public_html` folder
4. Upload: `chat-widget.js`

**Step 2: Add to Your Website**

Add this single line before the closing `</body>` tag:

```html
<script src="chat-widget.js"></script>
```

**That's it!** The chat widget will appear automatically in the bottom-right corner.

## 📁 Files

- **`chat-widget.js`** - Complete widget (only file you need)
- **`integration.html`** - Demo page for testing
- **`INTEGRATION_GUIDE.md`** - This guide

## ✨ Features

✅ **Metalogics Branding** - Blue gradient theme matching metalogics.io  
✅ **API Integration** - Properly connected to your chat API  
✅ **Mobile Responsive** - Works on all devices  
✅ **Quick Actions** - Pre-defined buttons for common questions  
✅ **Typing Indicator** - Shows when bot is responding  
✅ **Auto-resize Input** - Text area grows with content  
✅ **Error Handling** - Graceful error messages  
✅ **Session Management** - Maintains conversation context

## 🎨 Design

The widget uses Metalogics' official colors:

- Primary: `#1e40af` (Deep blue)
- Secondary: `#3b82f6` (Bright blue)
- Accent: `#06b6d4` (Cyan)
- Gradient: Blue to cyan

## 🎮 Usage

### Basic Integration

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Website</title>
  </head>
  <body>
    <!-- Your website content -->

    <!-- Add chat widget -->
    <script src="chat-widget.js"></script>
  </body>
</html>
```

### Programmatic Control

```javascript
// Open chat window
window.MetalogicsChat.open();

// Close chat window
window.MetalogicsChat.close();

// Send a message
window.MetalogicsChat.send("Hello!");
```

### Auto-open on Page Load

```html
<script src="chat-widget.js"></script>
<script>
  window.addEventListener("load", function () {
    // Auto-open after 3 seconds
    setTimeout(function () {
      window.MetalogicsChat.open();
    }, 3000);
  });
</script>
```

## 📱 Mobile Support

The widget automatically adapts to mobile screens:

- Full-width on small devices
- Touch-friendly buttons
- Optimized height for mobile keyboards

## 🔧 Configuration

The widget is pre-configured with:

- API URL: `https://latest-chatbot-production.up.railway.app/api/chat`
- API Key: Already included
- Position: Bottom-right corner
- Colors: Metalogics brand theme

To customize, edit the `CONFIG` object in `chat-widget.js`:

```javascript
const CONFIG = {
  apiUrl: "your-api-url",
  apiKey: "your-api-key",
  colors: {
    primary: "#1e40af",
    // ... other colors
  },
};
```

## 🧪 Testing

1. Open `integration.html` in your browser
2. Click the blue chat button in bottom-right
3. Try the demo buttons:
   - Open Chat
   - Close Chat
   - Send Test Message
4. Test the quick action buttons
5. Type messages and verify responses

## 🌐 Browser Support

✅ Chrome 60+  
✅ Firefox 55+  
✅ Safari 12+  
✅ Edge 79+  
✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security

- API key is included (already configured for your domain)
- All requests use HTTPS
- Input sanitization included
- XSS protection built-in

## 📊 What the Widget Does

1. **Displays a chat button** in the bottom-right corner
2. **Opens chat window** when clicked
3. **Sends messages** to your API endpoint
4. **Receives responses** from your AI assistant
5. **Maintains session** across conversation
6. **Shows typing indicator** while waiting
7. **Handles errors** gracefully

## 🎯 API Integration

The widget connects to:

- **Endpoint**: `POST /api/chat`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer {apiKey}`
- **Body**:
  ```json
  {
    "message": "user message",
    "sessionId": "unique-session-id"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "response": "bot response",
    "sessionId": "session-id"
  }
  ```

## 🐛 Troubleshooting

### Widget not appearing

- Check browser console for errors
- Verify `chat-widget.js` is uploaded correctly
- Ensure script tag is before `</body>`

### Messages not sending

- Check network tab in browser dev tools
- Verify API endpoint is accessible
- Check API key is correct

### Styling issues

- Clear browser cache
- Check for CSS conflicts
- Verify no other chat widgets are loaded

## 📞 Support

If you encounter issues:

1. Open browser console (F12)
2. Check for error messages
3. Verify network requests in Network tab
4. Test with `integration.html` demo page

## 🎉 You're Done!

The widget is ready for production use on bilal.metalogics.io. Just upload `chat-widget.js` and add the script tag to your pages.

**File to upload**: `chat-widget.js`  
**Code to add**: `<script src="chat-widget.js"></script>`  
**Location**: Before `</body>` tag

That's all you need!
