(function () {
  "use strict";

  // Metalogics Brand Colors (based on metalogics.io)
  const METALOGICS_THEME = {
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
  };

  // Default configuration
  const DEFAULT_CONFIG = {
    apiBaseUrl: "https://latest-chatbot-production.up.railway.app",
    apiKey: "", // Must be provided
    position: "bottom-right", // bottom-right, bottom-left, top-right, top-left
    theme: METALOGICS_THEME,
    title: "Metalogics AI Assistant",
    subtitle: "How can we help you today?",
    placeholder: "Type your message...",
    welcomeMessage:
      "👋 Hello! I'm the Metalogics AI Assistant. I can help you with information about our services, check available appointment times, or book consultations. How can I assist you today?",
    quickActions: [
      "What services do you offer?",
      "Check availability",
      "Book an appointment",
      "Reschedule appointment",
      "Get help",
    ],
    minimized: true, // Start minimized
    showQuickActions: true,
    showTypingIndicator: true,
    maxMessages: 50, // Limit conversation history
  };

  class MetalogicsChatWidget {
    constructor(config) {
      this.config = { ...DEFAULT_CONFIG, ...config };
      this.isOpen = !this.config.minimized;
      this.sessionId = this.generateSessionId();
      this.messages = [];
      this.isTyping = false;

      if (!this.config.apiKey) {
        console.error("MetalogicsChatWidget: API key is required");
        return;
      }

      this.init();
    }

    generateSessionId() {
      return (
        "chat-" + Math.random().toString(36).substr(2, 9) + "-" + Date.now()
      );
    }

    init() {
      this.injectStyles();
      this.createWidget();
      this.initializeEventListeners();
      this.addWelcomeMessage();
      this.testConnection();
    }

    injectStyles() {
      if (document.getElementById("metalogics-chat-styles")) return;

      const styles = `
        /* Metalogics Chat Widget Styles */
        .metalogics-chat-widget {
          position: fixed;
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          font-size: 14px;
          line-height: 1.5;
        }

        .metalogics-chat-widget * {
          box-sizing: border-box;
        }

        /* Position variants */
        .metalogics-chat-widget.bottom-right {
          bottom: 20px;
          right: 20px;
        }

        .metalogics-chat-widget.bottom-left {
          bottom: 20px;
          left: 20px;
        }

        .metalogics-chat-widget.top-right {
          top: 20px;
          right: 20px;
        }

        .metalogics-chat-widget.top-left {
          top: 20px;
          left: 20px;
        }

        /* Chat button (minimized state) */
        .metalogics-chat-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: ${this.config.theme.gradient};
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(30, 64, 175, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .metalogics-chat-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 25px rgba(30, 64, 175, 0.4);
        }

        .metalogics-chat-button-icon {
          width: 24px;
          height: 24px;
          fill: white;
          transition: transform 0.3s ease;
        }

        .metalogics-chat-button.open .metalogics-chat-button-icon {
          transform: rotate(180deg);
        }

        /* Notification badge */
        .metalogics-chat-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: ${this.config.theme.error};
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 11px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        /* Chat window */
        .metalogics-chat-window {
          width: 380px;
          height: 600px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transform: scale(0.8) translateY(20px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid rgba(30, 64, 175, 0.1);
        }

        .metalogics-chat-window.open {
          transform: scale(1) translateY(0);
          opacity: 1;
        }

        /* Chat header */
        .metalogics-chat-header {
          background: ${this.config.theme.gradient};
          color: white;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .metalogics-chat-header-info {
          flex: 1;
        }

        .metalogics-chat-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .metalogics-chat-subtitle {
          font-size: 13px;
          opacity: 0.9;
          margin: 0;
        }

        .metalogics-chat-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background-color 0.2s;
        }

        .metalogics-chat-close:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .metalogics-chat-close svg {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }

        /* Status indicator */
        .metalogics-chat-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          opacity: 0.8;
        }

        .metalogics-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${this.config.theme.success};
        }

        .metalogics-status-dot.disconnected {
          background: ${this.config.theme.error};
        }

        /* Messages area */
        .metalogics-chat-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background: ${this.config.theme.light};
          scroll-behavior: smooth;
        }

        .metalogics-chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .metalogics-chat-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .metalogics-chat-messages::-webkit-scrollbar-thumb {
          background: rgba(30, 64, 175, 0.2);
          border-radius: 3px;
        }

        /* Message styles */
        .metalogics-message {
          margin-bottom: 16px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .metalogics-message.user {
          flex-direction: row-reverse;
        }

        .metalogics-message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }

        .metalogics-message.assistant .metalogics-message-avatar {
          background: ${this.config.theme.gradient};
          color: white;
        }

        .metalogics-message.user .metalogics-message-avatar {
          background: ${this.config.theme.dark};
          color: white;
        }

        .metalogics-message-content {
          max-width: 75%;
        }

        .metalogics-message-bubble {
          padding: 12px 16px;
          border-radius: 18px;
          word-wrap: break-word;
          white-space: pre-wrap;
          position: relative;
        }

        .metalogics-message.assistant .metalogics-message-bubble {
          background: white;
          color: ${this.config.theme.dark};
          border: 1px solid rgba(30, 64, 175, 0.1);
        }

        .metalogics-message.user .metalogics-message-bubble {
          background: ${this.config.theme.primary};
          color: white;
        }

        .metalogics-message-time {
          font-size: 11px;
          opacity: 0.6;
          margin-top: 4px;
          text-align: right;
        }

        .metalogics-message.assistant .metalogics-message-time {
          text-align: left;
        }

        /* Typing indicator */
        .metalogics-typing-indicator {
          display: none;
          margin-bottom: 16px;
        }

        .metalogics-typing-indicator.show {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .metalogics-typing-bubble {
          background: white;
          border: 1px solid rgba(30, 64, 175, 0.1);
          border-radius: 18px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .metalogics-typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${this.config.theme.primary};
          animation: typing 1.4s infinite ease-in-out;
        }

        .metalogics-typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .metalogics-typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        /* Quick actions */
        .metalogics-quick-actions {
          padding: 16px 20px;
          background: white;
          border-top: 1px solid rgba(30, 64, 175, 0.1);
        }

        .metalogics-quick-actions-title {
          font-size: 12px;
          font-weight: 600;
          color: ${this.config.theme.dark};
          margin: 0 0 8px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metalogics-quick-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .metalogics-quick-button {
          background: ${this.config.theme.light};
          border: 1px solid rgba(30, 64, 175, 0.2);
          color: ${this.config.theme.primary};
          padding: 6px 12px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .metalogics-quick-button:hover {
          background: ${this.config.theme.primary};
          color: white;
          border-color: ${this.config.theme.primary};
          transform: translateY(-1px);
        }

        /* Input area */
        .metalogics-chat-input {
          padding: 20px;
          background: white;
          border-top: 1px solid rgba(30, 64, 175, 0.1);
        }

        .metalogics-input-container {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          background: ${this.config.theme.light};
          border-radius: 24px;
          padding: 8px;
          border: 2px solid transparent;
          transition: border-color 0.2s;
        }

        .metalogics-input-container.focused {
          border-color: ${this.config.theme.primary};
        }

        .metalogics-message-input {
          flex: 1;
          border: none;
          background: none;
          padding: 8px 12px;
          font-size: 14px;
          resize: none;
          outline: none;
          max-height: 100px;
          min-height: 20px;
          font-family: inherit;
          color: ${this.config.theme.dark};
        }

        .metalogics-message-input::placeholder {
          color: rgba(31, 41, 55, 0.5);
        }

        .metalogics-send-button {
          background: ${this.config.theme.gradient};
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .metalogics-send-button:hover:not(:disabled) {
          transform: scale(1.1);
        }

        .metalogics-send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .metalogics-send-button svg {
          width: 16px;
          height: 16px;
          fill: white;
        }

        /* Mobile responsive */
        @media (max-width: 480px) {
          .metalogics-chat-window {
            width: calc(100vw - 20px);
            height: calc(100vh - 40px);
            border-radius: 12px;
          }

          .metalogics-chat-widget.bottom-right,
          .metalogics-chat-widget.bottom-left {
            bottom: 10px;
            right: 10px;
            left: 10px;
          }

          .metalogics-message-content {
            max-width: 85%;
          }
        }

        /* Error and success states */
        .metalogics-error-message {
          background: ${this.config.theme.error};
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          margin-bottom: 12px;
          text-align: center;
        }

        .metalogics-success-message {
          background: ${this.config.theme.success};
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          margin-bottom: 12px;
          text-align: center;
        }

        /* Animations */
        .metalogics-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .metalogics-slide-up {
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `;

      const styleSheet = document.createElement("style");
      styleSheet.id = "metalogics-chat-styles";
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    createWidget() {
      // Remove existing widget if any
      const existing = document.getElementById("metalogics-chat-widget");
      if (existing) {
        existing.remove();
      }

      const widget = document.createElement("div");
      widget.id = "metalogics-chat-widget";
      widget.className = `metalogics-chat-widget ${this.config.position}`;

      widget.innerHTML = `
        <div class="metalogics-chat-button" id="metalogics-chat-button">
          <svg class="metalogics-chat-button-icon" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
          <div class="metalogics-chat-badge" id="metalogics-chat-badge" style="display: none;">1</div>
        </div>

        <div class="metalogics-chat-window" id="metalogics-chat-window">
          <div class="metalogics-chat-header">
            <div class="metalogics-chat-header-info">
              <h3 class="metalogics-chat-title">${this.config.title}</h3>
              <p class="metalogics-chat-subtitle">${this.config.subtitle}</p>
              <div class="metalogics-chat-status">
                <div class="metalogics-status-dot" id="metalogics-status-dot"></div>
                <span id="metalogics-status-text">Connecting...</span>
              </div>
            </div>
            <button class="metalogics-chat-close" id="metalogics-chat-close">
              <svg viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>

          <div class="metalogics-chat-messages" id="metalogics-chat-messages">
            <!-- Messages will be added here -->
          </div>

          <div class="metalogics-typing-indicator" id="metalogics-typing-indicator">
            <div class="metalogics-message-avatar">
              🤖
            </div>
            <div class="metalogics-typing-bubble">
              <div class="metalogics-typing-dot"></div>
              <div class="metalogics-typing-dot"></div>
              <div class="metalogics-typing-dot"></div>
            </div>
          </div>

          ${
            this.config.showQuickActions
              ? `
          <div class="metalogics-quick-actions" id="metalogics-quick-actions">
            <div class="metalogics-quick-actions-title">Quick Actions</div>
            <div class="metalogics-quick-buttons">
              ${this.config.quickActions
                .map(
                  (action) =>
                    `<button class="metalogics-quick-button" data-action="${action}">${action}</button>`
                )
                .join("")}
            </div>
          </div>
          `
              : ""
          }

          <div class="metalogics-chat-input">
            <div class="metalogics-input-container" id="metalogics-input-container">
              <textarea 
                class="metalogics-message-input" 
                id="metalogics-message-input"
                placeholder="${this.config.placeholder}"
                rows="1"
              ></textarea>
              <button class="metalogics-send-button" id="metalogics-send-button">
                <svg viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(widget);

      // Set initial state
      if (this.isOpen) {
        this.openChat();
      }
    }

    initializeEventListeners() {
      const chatButton = document.getElementById("metalogics-chat-button");
      const chatClose = document.getElementById("metalogics-chat-close");
      const messageInput = document.getElementById("metalogics-message-input");
      const sendButton = document.getElementById("metalogics-send-button");
      const inputContainer = document.getElementById(
        "metalogics-input-container"
      );

      // Toggle chat
      chatButton.addEventListener("click", () => this.toggleChat());
      chatClose.addEventListener("click", () => this.closeChat());

      // Input handling
      messageInput.addEventListener("focus", () => {
        inputContainer.classList.add("focused");
      });

      messageInput.addEventListener("blur", () => {
        inputContainer.classList.remove("focused");
      });

      messageInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });

      messageInput.addEventListener("input", () => {
        this.autoResizeTextarea();
        this.updateSendButton();
      });

      sendButton.addEventListener("click", () => this.sendMessage());

      // Quick actions
      if (this.config.showQuickActions) {
        const quickButtons = document.querySelectorAll(
          ".metalogics-quick-button"
        );
        quickButtons.forEach((button) => {
          button.addEventListener("click", () => {
            const action = button.getAttribute("data-action");
            this.sendMessage(action);
          });
        });
      }

      // Close on outside click (optional)
      document.addEventListener("click", (e) => {
        const widget = document.getElementById("metalogics-chat-widget");
        if (this.isOpen && !widget.contains(e.target)) {
          // Uncomment to close on outside click
          // this.closeChat();
        }
      });
    }

    toggleChat() {
      if (this.isOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    }

    openChat() {
      this.isOpen = true;
      const chatWindow = document.getElementById("metalogics-chat-window");
      const chatButton = document.getElementById("metalogics-chat-button");
      const chatBadge = document.getElementById("metalogics-chat-badge");

      chatWindow.classList.add("open");
      chatButton.classList.add("open");
      chatBadge.style.display = "none";

      // Focus input
      setTimeout(() => {
        const messageInput = document.getElementById(
          "metalogics-message-input"
        );
        messageInput.focus();
      }, 300);

      // Scroll to bottom
      this.scrollToBottom();
    }

    closeChat() {
      this.isOpen = false;
      const chatWindow = document.getElementById("metalogics-chat-window");
      const chatButton = document.getElementById("metalogics-chat-button");

      chatWindow.classList.remove("open");
      chatButton.classList.remove("open");
    }

    addWelcomeMessage() {
      this.addMessage("assistant", this.config.welcomeMessage);
    }

    async sendMessage(messageText = null) {
      const messageInput = document.getElementById("metalogics-message-input");
      const text = messageText || messageInput.value.trim();

      if (!text) return;

      // Clear input if it was typed
      if (!messageText) {
        messageInput.value = "";
        this.autoResizeTextarea();
        this.updateSendButton();
      }

      // Add user message
      this.addMessage("user", text);

      // Show typing indicator
      this.showTyping(true);

      try {
        const response = await fetch(`${this.config.apiBaseUrl}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.config.apiKey}`,
          },
          body: JSON.stringify({
            message: text,
            sessionId: this.sessionId,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          this.addMessage("assistant", data.response);
          this.updateStatus("connected", "Online");
        } else {
          const errorMsg = data.error || `Server error (${response.status})`;
          this.addMessage(
            "assistant",
            `❌ Sorry, I encountered an error: ${errorMsg}`
          );
          this.updateStatus("disconnected", "Connection error");
        }
      } catch (error) {
        console.error("Chat error:", error);
        this.addMessage(
          "assistant",
          "❌ Sorry, I couldn't connect to the server. Please check your internet connection and try again."
        );
        this.updateStatus("disconnected", "Connection failed");
      } finally {
        this.showTyping(false);
      }
    }

    addMessage(sender, text) {
      const messagesContainer = document.getElementById(
        "metalogics-chat-messages"
      );

      // Limit message history
      if (this.messages.length >= this.config.maxMessages) {
        const firstMessage = messagesContainer.querySelector(
          ".metalogics-message"
        );
        if (firstMessage) {
          firstMessage.remove();
          this.messages.shift();
        }
      }

      const messageDiv = document.createElement("div");
      messageDiv.className = `metalogics-message ${sender} metalogics-fade-in`;

      const avatar = sender === "assistant" ? "🤖" : "👤";
      const time = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      messageDiv.innerHTML = `
        <div class="metalogics-message-avatar">${avatar}</div>
        <div class="metalogics-message-content">
          <div class="metalogics-message-bubble">${this.formatMessage(
            text
          )}</div>
          <div class="metalogics-message-time">${time}</div>
        </div>
      `;

      messagesContainer.appendChild(messageDiv);
      this.messages.push({ sender, text, time });

      // Show notification if chat is closed
      if (!this.isOpen && sender === "assistant") {
        this.showNotification();
      }

      this.scrollToBottom();
    }

    formatMessage(text) {
      // Basic text formatting
      return text
        .replace(/\n/g, "<br>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>");
    }

    showTyping(show) {
      const typingIndicator = document.getElementById(
        "metalogics-typing-indicator"
      );

      if (show) {
        typingIndicator.classList.add("show");
        this.isTyping = true;
      } else {
        typingIndicator.classList.remove("show");
        this.isTyping = false;
      }

      this.scrollToBottom();
    }

    showNotification() {
      const chatBadge = document.getElementById("metalogics-chat-badge");
      chatBadge.style.display = "flex";
    }

    updateStatus(status, text) {
      const statusDot = document.getElementById("metalogics-status-dot");
      const statusText = document.getElementById("metalogics-status-text");

      statusDot.className = `metalogics-status-dot ${status}`;
      statusText.textContent = text;
    }

    autoResizeTextarea() {
      const textarea = document.getElementById("metalogics-message-input");
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 100) + "px";
    }

    updateSendButton() {
      const messageInput = document.getElementById("metalogics-message-input");
      const sendButton = document.getElementById("metalogics-send-button");

      sendButton.disabled = !messageInput.value.trim();
    }

    scrollToBottom() {
      const messagesContainer = document.getElementById(
        "metalogics-chat-messages"
      );
      setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 100);
    }

    async testConnection() {
      try {
        const response = await fetch(`${this.config.apiBaseUrl}/api/health`);
        if (response.ok) {
          this.updateStatus("connected", "Online");
        } else {
          this.updateStatus("disconnected", "Server unavailable");
        }
      } catch (error) {
        this.updateStatus("disconnected", "Connection failed");
      }
    }

    // Public methods
    open() {
      this.openChat();
    }

    close() {
      this.closeChat();
    }

    sendCustomMessage(message) {
      this.sendMessage(message);
    }

    clearHistory() {
      const messagesContainer = document.getElementById(
        "metalogics-chat-messages"
      );
      messagesContainer.innerHTML = "";
      this.messages = [];
      this.addWelcomeMessage();
    }

    destroy() {
      const widget = document.getElementById("metalogics-chat-widget");
      const styles = document.getElementById("metalogics-chat-styles");

      if (widget) widget.remove();
      if (styles) styles.remove();
    }
  }

  // Expose to global scope
  window.MetalogicsChatWidget = MetalogicsChatWidget;
})();
