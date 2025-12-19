# Metalogics Chat Widget Integration Guide

A modern, brand-matched chatbot widget designed specifically for Metalogics.io with the company's official colors and design language.

## 🎨 Features

- **Brand-Matched Design**: Uses Metalogics' official blue gradient theme
- **Modern UI**: Clean, professional interface with smooth animations
- **Mobile Responsive**: Works perfectly on all devices
- **Smart Positioning**: Configurable placement (bottom-right, bottom-left, etc.)
- **AI-Powered**: Intelligent conversation handling with booking capabilities
- **Easy Integration**: Simple setup with minimal code

## 🚀 Quick Integration for bilal.metalogics.io

### Step 1: Upload Files to Hostinger

1. Login to your **Hostinger Control Panel**
2. Go to **File Manager**
3. Navigate to `public_html` folder
4. Upload these files:
   - `metalogics-chatbot-widget.js`
   - `metalogics-chat-config.js`

### Step 2: Add to Your Website

Add this code before the closing `</body>` tag on your pages:

```html
<!-- Metalogics Chat Widget -->
<script src="metalogics-chat-config.js"></script>
<script src="metalogics-chatbot-widget.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", function () {
    window.metalogicsChat = new MetalogicsChatWidget(
      window.MetalogicsChatConfig
    );
  });
</script>
```

### Step 3: Test the Integration

1. Visit your website: `https://bilal.metalogics.io`
2. Look for the blue chat button in the bottom-right corner
3. Click to open and test the chat functionality

## 🎯 Configuration Options

The widget is pre-configured with Metalogics branding, but you can customize it by editing `metalogics-chat-config.js`:

```javascript
window.MetalogicsChatConfig = {
  // Position: bottom-right, bottom-left, top-right, top-left
  position: "bottom-right",

  // Branding
  title: "Metalogics AI Assistant",
  subtitle: "How can we help you today?",

  // Behavior
  minimized: true, // Start closed
  showQuickActions: true, // Show quick action buttons

  // API (already configured)
  apiKey: "your-api-key",
  apiBaseUrl: "https://latest-chatbot-production.up.railway.app",
};
```

## 🎨 Brand Colors Used

The widget uses Metalogics' official brand palette:

- **Primary Blue**: `#1e40af` (Deep blue)
- **Secondary Blue**: `#3b82f6` (Bright blue)
- **Accent Cyan**: `#06b6d4` (Cyan highlight)
- **Gradient**: `linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)`

## 📱 Mobile Optimization

The widget automatically adapts to mobile devices:

- Full-screen on small screens
- Touch-friendly buttons
- Responsive text sizing
- Optimized animations

## 🔧 Advanced Usage

### Programmatic Control

```javascript
// Open chat programmatically
window.metalogicsChat.open();

// Close chat
window.metalogicsChat.close();

// Send a message
window.metalogicsChat.sendCustomMessage("Hello!");

// Clear conversation history
window.metalogicsChat.clearHistory();
```

### Custom Styling

Add custom CSS to override default styles:

```css
/* Custom widget positioning */
.metalogics-chat-widget.bottom-right {
  bottom: 30px;
  right: 30px;
}

/* Custom button size */
.metalogics-chat-button {
  width: 70px;
  height: 70px;
}
```

## 🛠️ Troubleshooting

### Widget Not Appearing

1. Check browser console for JavaScript errors
2. Verify files are uploaded correctly
3. Ensure scripts are loaded after DOM content

### API Connection Issues

1. Verify API key is correct in config file
2. Check network connectivity
3. Confirm API endpoint is accessible

### Styling Issues

1. Check for CSS conflicts with existing styles
2. Use browser dev tools to inspect elements
3. Ensure custom CSS is loaded after widget styles

## 📊 Analytics & Events

The widget supports event tracking:

```javascript
window.MetalogicsChatConfig = {
  // ... other config

  // Event callbacks
  onOpen: function () {
    // Track chat opened
    gtag("event", "chat_opened", {
      event_category: "engagement",
    });
  },

  onMessage: function (message, sender) {
    // Track messages sent
    gtag("event", "chat_message", {
      event_category: "engagement",
      sender: sender,
    });
  },
};
```

## 🔒 Security & Privacy

- API key is configured for your domain
- All communications are encrypted (HTTPS)
- No personal data is stored locally
- GDPR compliant conversation handling

## 📞 Support

For technical support or customization requests:

- Check browser console for error messages
- Test with the integration example file
- Verify API endpoints are responding correctly

## 🚀 Deployment Checklist

- [ ] Files uploaded to Hostinger
- [ ] Integration code added to website
- [ ] Chat button appears on page
- [ ] Chat opens and closes correctly
- [ ] Messages send and receive properly
- [ ] Mobile responsiveness tested
- [ ] Brand colors match Metalogics theme

## 📝 File Structure

```
widget/
├── metalogics-chatbot-widget.js     # Main widget code
├── metalogics-chat-config.js        # Configuration file
├── metalogics-integration-example.html  # Demo page
└── METALOGICS_INTEGRATION_GUIDE.md  # This guide
```

## 🎯 Next Steps

1. **Upload files** to your Hostinger account
2. **Add integration code** to your website pages
3. **Test functionality** on bilal.metalogics.io
4. **Customize** positioning or colors if needed
5. **Monitor** chat interactions and user engagement

The widget is now ready for production use on your Metalogics website!
