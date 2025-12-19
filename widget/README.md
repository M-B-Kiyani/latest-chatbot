# Booking Widget Integration Guide

This booking widget allows you to easily integrate your booking system into any website. It provides a complete booking experience with real-time availability checking and seamless form submission.

## Features

- ✅ **Real-time availability** - Fetches available time slots from your API
- ✅ **Responsive design** - Works on desktop, tablet, and mobile
- ✅ **Customizable theme** - Match your brand colors and fonts
- ✅ **Form validation** - Client-side validation with error handling
- ✅ **Multiple durations** - Support for 15, 30, 45, and 60-minute slots
- ✅ **Business hours aware** - Respects your configured business hours
- ✅ **Email notifications** - Automatic confirmation emails
- ✅ **CRM integration** - Syncs with HubSpot automatically

## Quick Start

### Option 1: Standalone HTML Page

Use `booking-widget.html` as a complete standalone booking page:

1. Download `booking-widget.html`
2. Update the API configuration:
   ```javascript
   const widget = new BookingWidget({
     apiBaseUrl: "https://latest-chatbot-production.up.railway.app",
     apiKey: "YOUR_API_KEY_HERE", // Replace with your actual API key
   });
   ```
3. Upload to your web server

### Option 2: Embed in Existing Website

Use `booking-widget-embed.js` to embed the widget in any existing page:

1. **Add the container div** where you want the widget to appear:

   ```html
   <div id="booking-widget-container"></div>
   ```

2. **Include the widget script**:

   ```html
   <script src="booking-widget-embed.js"></script>
   ```

3. **Initialize the widget**:
   ```html
   <script>
     document.addEventListener("DOMContentLoaded", function () {
       new BookingWidget({
         apiKey: "YOUR_API_KEY_HERE",
         apiBaseUrl: "https://latest-chatbot-production.up.railway.app",
         containerId: "booking-widget-container",
       });
     });
   </script>
   ```

## Configuration Options

```javascript
new BookingWidget({
  // Required
  apiKey: "your-api-key", // Your API key for authentication

  // Optional
  apiBaseUrl: "https://your-api-domain.com", // Your API base URL
  containerId: "booking-widget-container", // Container element ID

  // Theme customization
  theme: {
    primaryColor: "#667eea", // Primary brand color
    secondaryColor: "#764ba2", // Secondary brand color
    fontFamily: "Your Font Family", // Custom font family
  },
});
```

## API Requirements

Your booking API must support these endpoints:

### 1. Get Available Slots

```
GET /api/bookings/available-slots
Query Parameters:
- startDate: ISO 8601 date string
- endDate: ISO 8601 date string
- duration: 15 | 30 | 45 | 60
```

### 2. Create Booking

```
POST /api/bookings
Headers:
- Content-Type: application/json
- Authorization: Bearer your-api-key

Body:
{
  "name": "John Doe",
  "company": "Acme Corp",
  "email": "john@example.com",
  "phone": "+1234567890",
  "inquiry": "I need help with...",
  "timeSlot": {
    "startTime": "2024-12-20T10:00:00Z",
    "duration": 30
  }
}
```

## Styling Customization

### Custom CSS

You can override the default styles by adding custom CSS after the widget loads:

```css
/* Custom widget styles */
.booking-widget {
  border: 2px solid #your-color;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.booking-widget-header {
  background: linear-gradient(135deg, #your-primary 0%, #your-secondary 100%);
}

.booking-widget .submit-button {
  background: #your-button-color;
}
```

### Theme Configuration

Use the theme configuration for basic customization:

```javascript
new BookingWidget({
  apiKey: "your-api-key",
  theme: {
    primaryColor: "#ff6b6b", // Red theme
    secondaryColor: "#ee5a24", // Orange accent
    fontFamily: "Poppins, sans-serif",
  },
});
```

## Error Handling

The widget handles various error scenarios:

- **Network errors** - Shows retry message
- **Validation errors** - Highlights invalid fields
- **API errors** - Displays user-friendly error messages
- **No available slots** - Suggests alternative dates

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Security Considerations

1. **API Key Protection**: Store your API key securely and consider using environment-specific keys
2. **CORS Configuration**: Ensure your API allows requests from your domain
3. **Rate Limiting**: The API includes built-in rate limiting protection
4. **Input Validation**: All inputs are validated both client-side and server-side

## Troubleshooting

### Widget Not Loading

- Check browser console for JavaScript errors
- Verify the container element exists
- Ensure the script is loaded after DOM content

### API Connection Issues

- Verify API key is correct
- Check CORS settings on your API
- Confirm API base URL is accessible

### Styling Issues

- Check for CSS conflicts with existing styles
- Use browser dev tools to inspect element styles
- Ensure custom CSS is loaded after widget styles

## Integration Examples

### WordPress

```php
// Add to your theme's functions.php
function add_booking_widget_scripts() {
    wp_enqueue_script('booking-widget',
        get_template_directory_uri() . '/js/booking-widget-embed.js',
        array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'add_booking_widget_scripts');

// Add shortcode support
function booking_widget_shortcode($atts) {
    $atts = shortcode_atts(array(
        'api_key' => '',
    ), $atts);

    return '<div id="booking-widget-container"></div>
    <script>
    document.addEventListener("DOMContentLoaded", function() {
        new BookingWidget({
            apiKey: "' . esc_js($atts['api_key']) . '",
            apiBaseUrl: "https://latest-chatbot-production.up.railway.app"
        });
    });
    </script>';
}
add_shortcode('booking_widget', 'booking_widget_shortcode');
```

### React Component

```jsx
import { useEffect } from "react";

const BookingWidget = ({ apiKey }) => {
  useEffect(() => {
    // Load the widget script dynamically
    const script = document.createElement("script");
    script.src = "/booking-widget-embed.js";
    script.onload = () => {
      new window.BookingWidget({
        apiKey: apiKey,
        apiBaseUrl: "https://latest-chatbot-production.up.railway.app",
        containerId: "booking-widget-container",
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [apiKey]);

  return <div id="booking-widget-container"></div>;
};
```

## Support

For technical support or questions:

- Check the browser console for error messages
- Verify API endpoints are responding correctly
- Test with the provided integration example
- Review the API documentation for endpoint requirements

## License

This widget is provided as part of your booking system integration package.
