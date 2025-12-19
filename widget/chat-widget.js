/**
 * Metalogics Chat Widget
 * A clean, production-ready chat widget with Metalogics branding
 * Version: 1.0.0
 */

(function () {
  "use strict";

  // Widget configuration
  const CONFIG = {
    apiUrl: "https://latest-chatbot-production.up.railway.app/api/chat",
    apiKey: "c608cf9ace6a39a48451f2fc67a15e08c00a1f2c287d21ed38ea4c0652fa500d",
    colors: {
      primary: "#1e40af",
      secondary: "#3b82f6",
      accent: "#06b6d4",
      text: "#1f2937",
      textLight: "#6b7280",
      background: "#ffffff",
      backgroundLight: "#f8fafc",
      border: "#e5e7eb",
      success: "#10b981",
      error: "#ef4444",
    },
  };

  class ChatWidget {
    constructor(options = {}) {
      this.config = { ...CONFIG, ...options };
      this.isOpen = false;
      this.sessionId = this.generateSessionId();
      this.messages = [];

      this.init();
    }

    generateSessionId() {
      return (
        "chat-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9)
      );
    }

    init() {
      this.injectStyles();
      this.createWidget();
      this.attachEventListeners();
      this.addWelcomeMessage();
    }

    injectStyles() {
      const styles = `
        #metalogics-chat-widget * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        #metalogics-chat-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          z-index: 999999;
        }

        .mcw-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${this.config.colors.primary} 0%, ${this.config.colors.secondary} 50%, ${this.config.colors.accent} 100%);
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(30, 64, 175, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .mcw-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(30, 64, 175, 0.5);
        }

        .mcw-button svg {
          width: 28px;
          height: 28px;
          fill: white;
        }

        .mcw-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 380px;
          height: 600px;
          background: ${this.config.colors.background};
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          display: none;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid ${this.config.colors.border};
        }

        .mcw-window.open {
          display: flex;
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

        .mcw-header {
          background: linear-gradient(135deg, ${this.config.colors.primary} 0%, ${this.config.colors.secondary} 100%);
          color: white;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .mcw-header-title {
          font-size: 18px;
          font-weight: 600;
        }

        .mcw-header-subtitle {
          font-size: 13px;
          opacity: 0.9;
          margin-top: 4px;
        }

        .mcw-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .mcw-close:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .mcw-close svg {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }

        .mcw-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: ${this.config.colors.backgroundLight};
        }

        .mcw-messages::-webkit-scrollbar {
          width: 6px;
        }

        .mcw-messages::-webkit-scrollbar-thumb {
          background: ${this.config.colors.border};
          border-radius: 3px;
        }

        .mcw-message {
          display: flex;
          margin-bottom: 16px;
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

        .mcw-message.user {
          flex-direction: row-reverse;
        }

        .mcw-message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .mcw-message.bot .mcw-message-avatar {
          background: linear-gradient(135deg, ${this.config.colors.primary}, ${this.config.colors.secondary});
        }

        .mcw-message.user .mcw-message-avatar {
          background: ${this.config.colors.text};
        }

        .mcw-message-content {
          max-width: 70%;
          margin: 0 12px;
        }

        .mcw-message-bubble {
          padding: 12px 16px;
          border-radius: 16px;
          word-wrap: break-word;
          white-space: pre-wrap;
          line-height: 1.5;
          font-size: 14px;
        }

        .mcw-message.bot .mcw-message-bubble {
          background: ${this.config.colors.background};
          color: ${this.config.colors.text};
          border: 1px solid ${this.config.colors.border};
        }

        .mcw-message.user .mcw-message-bubble {
          background: ${this.config.colors.primary};
          color: white;
        }

        .mcw-message-time {
          font-size: 11px;
          color: ${this.config.colors.textLight};
          margin-top: 4px;
        }

        .mcw-typing {
          display: none;
          align-items: center;
          margin-bottom: 16px;
        }

        .mcw-typing.show {
          display: flex;
        }

        .mcw-typing-bubble {
          background: ${this.config.colors.background};
          border: 1px solid ${this.config.colors.border};
          border-radius: 16px;
          padding: 12px 16px;
          margin-left: 12px;
          display: flex;
          gap: 4px;
        }

        .mcw-typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${this.config.colors.primary};
          animation: typing 1.4s infinite;
        }

        .mcw-typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .mcw-typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }

        .mcw-input-area {
          padding: 16px;
          background: ${this.config.colors.background};
          border-top: 1px solid ${this.config.colors.border};
        }

        .mcw-input-container {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          background: ${this.config.colors.backgroundLight};
          border-radius: 24px;
          padding: 8px 12px;
          border: 2px solid transparent;
          transition: border-color 0.2s;
        }

        .mcw-input-container.focused {
          border-color: ${this.config.colors.primary};
        }

        .mcw-input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          font-size: 14px;
          font-family: inherit;
          resize: none;
          max-height: 100px;
          min-height: 20px;
          color: ${this.config.colors.text};
        }

        .mcw-input::placeholder {
          color: ${this.config.colors.textLight};
        }

        .mcw-send {
          background: linear-gradient(135deg, ${this.config.colors.primary}, ${this.config.colors.secondary});
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
          flex-shrink: 0;
        }

        .mcw-send:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .mcw-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .mcw-send svg {
          width: 16px;
          height: 16px;
          fill: white;
        }

        .mcw-quick-actions {
          padding: 12px 16px;
          background: ${this.config.colors.background};
          border-top: 1px solid ${this.config.colors.border};
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .mcw-quick-btn {
          background: ${this.config.colors.backgroundLight};
          border: 1px solid ${this.config.colors.border};
          color: ${this.config.colors.primary};
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mcw-quick-btn:hover {
          background: ${this.config.colors.primary};
          color: white;
          border-color: ${this.config.colors.primary};
        }

        .mcw-error {
          background: ${this.config.colors.error};
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          margin-bottom: 12px;
          text-align: center;
        }

        @media (max-width: 480px) {
          #metalogics-chat-widget {
            bottom: 10px;
            right: 10px;
            left: 10px;
          }

          .mcw-window {
            width: 100%;
            height: calc(100vh - 100px);
            max-height: 600px;
          }
        }
      `;

      const styleEl = document.createElement("style");
      styleEl.textContent = styles;
      document.head.appendChild(styleEl);
    }

    createWidget() {
      const widget = document.createElement("div");
      widget.id = "metalogics-chat-widget";
      widget.innerHTML = `
        <button class="mcw-button" id="mcw-toggle">
          <svg viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        </button>

        <div class="mcw-window" id="mcw-window">
          <div class="mcw-header">
            <div>
              <div class="mcw-header-title">Metalogics AI Assistant</div>
              <div class="mcw-header-subtitle">How can we help you?</div>
            </div>
            <button class="mcw-close" id="mcw-close">
              <svg viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>

          <div class="mcw-messages" id="mcw-messages"></div>

          <div class="mcw-typing" id="mcw-typing">
            <div class="mcw-message-avatar">🤖</div>
            <div class="mcw-typing-bubble">
              <div class="mcw-typing-dot"></div>
              <div class="mcw-typing-dot"></div>
              <div class="mcw-typing-dot"></div>
            </div>
          </div>

          <div class="mcw-quick-actions">
            <button class="mcw-quick-btn" data-msg="What services do you offer?">Our Services</button>
            <button class="mcw-quick-btn" data-msg="Check availability this week">Check Availability</button>
            <button class="mcw-quick-btn" data-msg="I want to book an appointment">Book Appointment</button>
          </div>

          <div class="mcw-input-area">
            <div class="mcw-input-container" id="mcw-input-container">
              <textarea 
                class="mcw-input" 
                id="mcw-input" 
                placeholder="Type your message..."
                rows="1"
              ></textarea>
              <button class="mcw-send" id="mcw-send" disabled>
                <svg viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(widget);
    }

    attachEventListeners() {
      const toggle = document.getElementById("mcw-toggle");
      const close = document.getElementById("mcw-close");
      const input = document.getElementById("mcw-input");
      const send = document.getElementById("mcw-send");
      const container = document.getElementById("mcw-input-container");
      const quickBtns = document.querySelectorAll(".mcw-quick-btn");

      toggle.addEventListener("click", () => this.toggleChat());
      close.addEventListener("click", () => this.closeChat());

      input.addEventListener("focus", () => container.classList.add("focused"));
      input.addEventListener("blur", () =>
        container.classList.remove("focused")
      );
      input.addEventListener("input", () => {
        this.autoResize(input);
        send.disabled = !input.value.trim();
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });

      send.addEventListener("click", () => this.sendMessage());

      quickBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const msg = btn.getAttribute("data-msg");
          this.sendMessage(msg);
        });
      });
    }

    toggleChat() {
      this.isOpen = !this.isOpen;
      const window = document.getElementById("mcw-window");

      if (this.isOpen) {
        window.classList.add("open");
        setTimeout(() => {
          document.getElementById("mcw-input").focus();
        }, 300);
      } else {
        window.classList.remove("open");
      }
    }

    closeChat() {
      this.isOpen = false;
      document.getElementById("mcw-window").classList.remove("open");
    }

    autoResize(textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 100) + "px";
    }

    addWelcomeMessage() {
      this.addMessage(
        "bot",
        "👋 Hello! I'm the Metalogics AI Assistant. I can help you with:\n\n• Information about our services\n• Checking available appointment times\n• Booking consultations\n• Rescheduling or canceling appointments\n\nHow can I assist you today?"
      );
    }

    addMessage(type, text) {
      const messagesEl = document.getElementById("mcw-messages");
      const messageEl = document.createElement("div");
      messageEl.className = `mcw-message ${type}`;

      const avatar = type === "bot" ? "🤖" : "👤";
      const time = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      messageEl.innerHTML = `
        <div class="mcw-message-avatar">${avatar}</div>
        <div class="mcw-message-content">
          <div class="mcw-message-bubble">${this.escapeHtml(text)}</div>
          <div class="mcw-message-time">${time}</div>
        </div>
      `;

      messagesEl.appendChild(messageEl);
      this.messages.push({ type, text, time });
      this.scrollToBottom();
    }

    escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML.replace(/\n/g, "<br>");
    }

    showTyping(show) {
      const typing = document.getElementById("mcw-typing");
      if (show) {
        typing.classList.add("show");
      } else {
        typing.classList.remove("show");
      }
      this.scrollToBottom();
    }

    scrollToBottom() {
      const messages = document.getElementById("mcw-messages");
      setTimeout(() => {
        messages.scrollTop = messages.scrollHeight;
      }, 100);
    }

    async sendMessage(text = null) {
      const input = document.getElementById("mcw-input");
      const message = text || input.value.trim();

      if (!message) return;

      // Clear input
      if (!text) {
        input.value = "";
        input.style.height = "auto";
        document.getElementById("mcw-send").disabled = true;
      }

      // Add user message
      this.addMessage("user", message);

      // Show typing
      this.showTyping(true);

      try {
        const response = await fetch(this.config.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.config.apiKey}`,
          },
          body: JSON.stringify({
            message: message,
            sessionId: this.sessionId,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          this.addMessage("bot", data.response);
        } else {
          throw new Error(data.error || "Failed to get response");
        }
      } catch (error) {
        console.error("Chat error:", error);
        this.addMessage(
          "bot",
          "❌ Sorry, I encountered an error. Please try again or contact us directly."
        );
      } finally {
        this.showTyping(false);
      }
    }

    // Public API
    open() {
      if (!this.isOpen) this.toggleChat();
    }

    close() {
      if (this.isOpen) this.toggleChat();
    }

    send(message) {
      this.sendMessage(message);
    }
  }

  // Initialize widget when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      window.MetalogicsChat = new ChatWidget();
    });
  } else {
    window.MetalogicsChat = new ChatWidget();
  }
})();
