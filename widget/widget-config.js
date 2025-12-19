// Booking Widget Configuration
// Update this file with your specific settings

window.BookingWidgetConfig = {
  // Your API configuration
  apiKey: "c608cf9ace6a39a48451f2fc67a15e08c00a1f2c287d21ed38ea4c0652fa500d",
  apiBaseUrl: "https://latest-chatbot-production.up.railway.app",

  // Widget container (where the widget will be rendered)
  containerId: "booking-widget-container",

  // Theme customization
  theme: {
    primaryColor: "#667eea",
    secondaryColor: "#764ba2",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  // Widget text customization
  text: {
    title: "Book a Consultation",
    subtitle: "Schedule your free consultation with our experts",
    submitButton: "Book Consultation",
    loadingButton: "Booking...",
  },

  // Business information (displayed in the widget)
  businessInfo: {
    name: "Metalogics",
    timezone: "Europe/London",
    businessHours: "Monday - Friday: 9:00 AM - 5:00 PM",
    durations: [15, 30, 45, 60], // Available duration options in minutes
  },
};
