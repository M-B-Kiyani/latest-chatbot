(function () {
  "use strict";

  // Default configuration
  const DEFAULT_CONFIG = {
    apiBaseUrl: "https://latest-chatbot-production.up.railway.app",
    apiKey: "", // Must be provided
    containerId: "booking-widget-container",
    theme: {
      primaryColor: "#667eea",
      secondaryColor: "#764ba2",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  };

  class EmbeddableBookingWidget {
    constructor(config) {
      this.config = { ...DEFAULT_CONFIG, ...config };
      this.selectedSlot = null;

      if (!this.config.apiKey) {
        console.error("BookingWidget: API key is required");
        return;
      }

      this.init();
    }

    init() {
      this.injectStyles();
      this.renderWidget();
      this.initializeEventListeners();
      this.setMinDate();
    }

    injectStyles() {
      if (document.getElementById("booking-widget-styles")) return;

      const styles = `
                .booking-widget {
                    font-family: ${this.config.theme.fontFamily};
                    max-width: 500px;
                    margin: 0 auto;
                    background: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    border: 1px solid #e5e7eb;
                }
                
                .booking-widget * {
                    box-sizing: border-box;
                }
                
                .booking-widget-header {
                    background: linear-gradient(135deg, ${this.config.theme.primaryColor} 0%, ${this.config.theme.secondaryColor} 100%);
                    color: white;
                    padding: 24px;
                    text-align: center;
                }
                
                .booking-widget-header h2 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 600;
                }
                
                .booking-widget-header p {
                    margin: 8px 0 0 0;
                    opacity: 0.9;
                    font-size: 14px;
                }
                
                .booking-widget-content {
                    padding: 24px;
                }
                
                .booking-widget .form-group {
                    margin-bottom: 20px;
                }
                
                .booking-widget .form-label {
                    display: block;
                    margin-bottom: 6px;
                    font-weight: 500;
                    color: #374151;
                    font-size: 14px;
                }
                
                .booking-widget .form-input {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: border-color 0.2s;
                    font-family: inherit;
                }
                
                .booking-widget .form-input:focus {
                    outline: none;
                    border-color: ${this.config.theme.primaryColor};
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }
                
                .booking-widget .form-textarea {
                    min-height: 80px;
                    resize: vertical;
                }
                
                .booking-widget .form-select {
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
                    background-position: right 12px center;
                    background-repeat: no-repeat;
                    background-size: 16px;
                    padding-right: 40px;
                }
                
                .booking-widget .datetime-section {
                    background: #f9fafb;
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 20px;
                }
                
                .booking-widget .datetime-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-top: 12px;
                }
                
                .booking-widget .slots-container {
                    max-height: 200px;
                    overflow-y: auto;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 8px;
                }
                
                .booking-widget .slot-button {
                    display: block;
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 6px;
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 14px;
                    font-family: inherit;
                }
                
                .booking-widget .slot-button:hover {
                    background: #f3f4f6;
                    border-color: ${this.config.theme.primaryColor};
                }
                
                .booking-widget .slot-button.selected {
                    background: ${this.config.theme.primaryColor};
                    color: white;
                    border-color: ${this.config.theme.primaryColor};
                }
                
                .booking-widget .slot-button:last-child {
                    margin-bottom: 0;
                }
                
                .booking-widget .submit-button {
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, ${this.config.theme.primaryColor} 0%, ${this.config.theme.secondaryColor} 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s;
                    font-family: inherit;
                }
                
                .booking-widget .submit-button:hover {
                    transform: translateY(-1px);
                }
                
                .booking-widget .submit-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .booking-widget .loading {
                    text-align: center;
                    padding: 20px;
                    color: #6b7280;
                }
                
                .booking-widget .error-message {
                    background: #fef2f2;
                    color: #dc2626;
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 16px;
                    font-size: 14px;
                }
                
                .booking-widget .success-message {
                    background: #f0fdf4;
                    color: #16a34a;
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 16px;
                    font-size: 14px;
                }
                
                .booking-widget .hidden {
                    display: none;
                }
                
                @media (max-width: 480px) {
                    .booking-widget {
                        margin: 0;
                        border-radius: 0;
                    }
                    
                    .booking-widget .datetime-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `;

      const styleSheet = document.createElement("style");
      styleSheet.id = "booking-widget-styles";
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    renderWidget() {
      const container = document.getElementById(this.config.containerId);
      if (!container) {
        console.error(
          `BookingWidget: Container with ID "${this.config.containerId}" not found`
        );
        return;
      }

      container.innerHTML = `
                <div class="booking-widget">
                    <div class="booking-widget-header">
                        <h2>Book a Consultation</h2>
                        <p>Schedule your free consultation with our experts</p>
                    </div>
                    
                    <div class="booking-widget-content">
                        <div id="bw-error-container"></div>
                        <div id="bw-success-container"></div>
                        
                        <form id="bw-booking-form">
                            <div class="form-group">
                                <label class="form-label" for="bw-name">Full Name *</label>
                                <input type="text" id="bw-name" name="name" class="form-input" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="bw-company">Company *</label>
                                <input type="text" id="bw-company" name="company" class="form-input" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="bw-email">Email Address *</label>
                                <input type="email" id="bw-email" name="email" class="form-input" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="bw-phone">Phone Number</label>
                                <input type="tel" id="bw-phone" name="phone" class="form-input">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="bw-inquiry">What would you like to discuss? *</label>
                                <textarea id="bw-inquiry" name="inquiry" class="form-input form-textarea" required 
                                          placeholder="Tell us about your project, goals, or questions..."></textarea>
                            </div>
                            
                            <div class="datetime-section">
                                <label class="form-label">Select Date & Duration *</label>
                                <div class="datetime-grid">
                                    <div class="form-group">
                                        <input type="date" id="bw-booking-date" class="form-input" required>
                                    </div>
                                    <div class="form-group">
                                        <select id="bw-duration" class="form-input form-select" required>
                                            <option value="">Duration</option>
                                            <option value="15">15 minutes</option>
                                            <option value="30">30 minutes</option>
                                            <option value="45">45 minutes</option>
                                            <option value="60">60 minutes</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div id="bw-slots-section" class="hidden">
                                    <label class="form-label">Available Times</label>
                                    <div id="bw-slots-container" class="slots-container">
                                        <div class="loading">Loading available times...</div>
                                    </div>
                                </div>
                            </div>
                            
                            <button type="submit" class="submit-button" id="bw-submit-btn" disabled>
                                Book Consultation
                            </button>
                        </form>
                    </div>
                </div>
            `;
    }

    initializeEventListeners() {
      const dateInput = document.getElementById("bw-booking-date");
      const durationSelect = document.getElementById("bw-duration");
      const form = document.getElementById("bw-booking-form");

      dateInput.addEventListener("change", () => this.handleDateChange());
      durationSelect.addEventListener("change", () => this.handleDateChange());
      form.addEventListener("submit", (e) => this.handleSubmit(e));

      // Add form validation listeners
      const inputs = form.querySelectorAll(
        "input[required], textarea[required], select[required]"
      );
      inputs.forEach((input) => {
        input.addEventListener("input", () => this.updateSubmitButton());
      });
    }

    setMinDate() {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const dateInput = document.getElementById("bw-booking-date");
      dateInput.min = tomorrow.toISOString().split("T")[0];
    }

    async handleDateChange() {
      const date = document.getElementById("bw-booking-date").value;
      const duration = document.getElementById("bw-duration").value;

      if (!date || !duration) {
        document.getElementById("bw-slots-section").classList.add("hidden");
        this.updateSubmitButton();
        return;
      }

      await this.loadAvailableSlots(date, duration);
    }

    async loadAvailableSlots(date, duration) {
      const slotsSection = document.getElementById("bw-slots-section");
      const slotsContainer = document.getElementById("bw-slots-container");

      slotsSection.classList.remove("hidden");
      slotsContainer.innerHTML =
        '<div class="loading">Loading available times...</div>';

      try {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);

        const response = await fetch(
          `${this.config.apiBaseUrl}/api/bookings/available-slots?` +
            `startDate=${startDate.toISOString()}&` +
            `endDate=${endDate.toISOString()}&` +
            `duration=${duration}`
        );

        if (!response.ok) {
          throw new Error("Failed to load available slots");
        }

        const data = await response.json();
        this.renderSlots(data.data.slots);
      } catch (error) {
        console.error("Error loading slots:", error);
        slotsContainer.innerHTML =
          '<div class="error-message">Failed to load available times. Please try again.</div>';
      }
    }

    renderSlots(slots) {
      const slotsContainer = document.getElementById("bw-slots-container");

      if (slots.length === 0) {
        slotsContainer.innerHTML =
          '<div class="loading">No available times for this date. Please select another date.</div>';
        return;
      }

      slotsContainer.innerHTML = "";

      slots.forEach((slot) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "slot-button";

        const startTime = new Date(slot.startTime);
        const endTime = new Date(slot.endTime);

        button.textContent = `${this.formatTime(startTime)} - ${this.formatTime(
          endTime
        )}`;
        button.dataset.slot = JSON.stringify(slot);

        button.addEventListener("click", () => this.selectSlot(button, slot));

        slotsContainer.appendChild(button);
      });
    }

    selectSlot(button, slot) {
      document.querySelectorAll(".slot-button").forEach((btn) => {
        btn.classList.remove("selected");
      });

      button.classList.add("selected");
      this.selectedSlot = slot;
      this.updateSubmitButton();
    }

    updateSubmitButton() {
      const submitBtn = document.getElementById("bw-submit-btn");
      const form = document.getElementById("bw-booking-form");
      const isFormValid = form.checkValidity() && this.selectedSlot;

      submitBtn.disabled = !isFormValid;
    }

    async handleSubmit(e) {
      e.preventDefault();

      if (!this.selectedSlot) {
        this.showError("Please select a time slot");
        return;
      }

      const formData = new FormData(e.target);
      const bookingData = {
        name: formData.get("name"),
        company: formData.get("company"),
        email: formData.get("email"),
        phone: formData.get("phone") || undefined,
        inquiry: formData.get("inquiry"),
        timeSlot: {
          startTime: this.selectedSlot.startTime,
          duration: this.selectedSlot.duration,
        },
      };

      await this.submitBooking(bookingData);
    }

    async submitBooking(bookingData) {
      const submitBtn = document.getElementById("bw-submit-btn");
      const originalText = submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = "Booking...";

      try {
        const response = await fetch(`${this.config.apiBaseUrl}/api/bookings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.config.apiKey}`,
          },
          body: JSON.stringify(bookingData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error?.message || "Failed to create booking");
        }

        this.showSuccess(
          "Booking confirmed! You will receive a confirmation email shortly."
        );
        this.resetForm();
      } catch (error) {
        console.error("Booking error:", error);
        this.showError(
          error.message || "Failed to create booking. Please try again."
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }

    showError(message) {
      const container = document.getElementById("bw-error-container");
      container.innerHTML = `<div class="error-message">${message}</div>`;
      container.scrollIntoView({ behavior: "smooth" });
    }

    showSuccess(message) {
      const container = document.getElementById("bw-success-container");
      container.innerHTML = `<div class="success-message">${message}</div>`;
      container.scrollIntoView({ behavior: "smooth" });
    }

    resetForm() {
      document.getElementById("bw-booking-form").reset();
      document.getElementById("bw-slots-section").classList.add("hidden");
      this.selectedSlot = null;
      this.updateSubmitButton();
      this.setMinDate();

      setTimeout(() => {
        document.getElementById("bw-error-container").innerHTML = "";
        document.getElementById("bw-success-container").innerHTML = "";
      }, 5000);
    }

    formatTime(date) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  }

  // Expose to global scope
  window.BookingWidget = EmbeddableBookingWidget;
})();
