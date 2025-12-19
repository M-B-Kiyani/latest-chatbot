// Metalogics Chat Widget Configuration
// This file contains the configuration for the Metalogics-branded chat widget

window.MetalogicsChatConfig = {
  // API Configuration
  apiKey: "c608cf9ace6a39a48451f2fc67a15e08c00a1f2c287d21ed38ea4c0652fa500d",
  apiBaseUrl: "https://latest-chatbot-production.up.railway.app",

  // Widget Position
  position: "bottom-right", // Options: bottom-right, bottom-left, top-right, top-left

  // Branding & Appearance
  title: "Metalogics AI Assistant",
  subtitle: "How can we help you today?",
  placeholder: "Type your message...",

  // Welcome message
  welcomeMessage:
    "👋 Hello! I'm the Metalogics AI Assistant. I can help you with:\n\n• Information about our AI solutions\n• Checking available appointment times\n• Booking consultations\n• Rescheduling or canceling appointments\n\nHow can I assist you today?",

  // Quick action buttons
  quickActions: [
    "What services do you offer?",
    "Check availability",
    "Book an appointment",
    "Reschedule appointment",
    "Get help",
  ],

  // Widget Behavior
  minimized: true, // Start minimized (true) or open (false)
  showQuickActions: true, // Show quick action buttons
  showTypingIndicator: true, // Show typing animation
  maxMessages: 50, // Limit conversation history

  // Metalogics Brand Theme (matches metalogics.io)
  theme: {
    primary: "#1e40af", // Deep blue
    secondary: "#3b82f6", // Bright blue
    accent: "#06b6d4", // Cyan
    success: "#10b981", // Green
    warning: "#f59e0b", // Amber
    error: "#ef4444", // Red
    dark: "#1f2937", // Dark gray
    light: "#f8fafc", // Light gray
    white: "#ffffff",
    gradient: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)",
  },

  // Advanced Options
  autoOpen: false, // Automatically open chat after page load
  autoOpenDelay: 3000, // Delay before auto-opening (milliseconds)
  showNotifications: true, // Show notification badge when minimized
  persistSession: true, // Remember conversation across page reloads

  // Custom CSS (optional - for additional styling)
  customCSS: `
    /* Add any custom styles here */
    .metalogics-chat-widget {
      /* Custom widget styles */
    }
  `,

  // Event callbacks (optional)
  onOpen: function () {
    console.log("Metalogics chat opened");
  },

  onClose: function () {
    console.log("Metalogics chat closed");
  },

  onMessage: function (message, sender) {
    console.log("Message sent:", { message, sender });
  },
};
