#!/usr/bin/env node

/**
 * Test Google Calendar Integration
 * Verifies that the service account key file works correctly
 */

const { CalendarClient } = require("./dist/integrations/calendar.client");
const { config } = require("./dist/config");

async function testGoogleCalendar() {
  console.log("🔍 Testing Google Calendar Integration...\n");

  try {
    // Check configuration
    console.log("📋 Configuration Check:");
    console.log(`   Google Calendar Enabled: ${config.googleCalendar.enabled}`);
    console.log(
      `   Service Account Email: ${config.googleCalendar.serviceAccountEmail}`
    );
    console.log(
      `   Service Account Key Path: ${config.googleCalendar.serviceAccountKeyPath}`
    );
    console.log(`   Calendar ID: ${config.googleCalendar.calendarId}`);
    console.log(`   Timezone: ${config.googleCalendar.timeZone}\n`);

    if (!config.googleCalendar.enabled) {
      console.log("❌ Google Calendar is disabled in configuration");
      return;
    }

    if (!config.googleCalendar.serviceAccountKeyPath) {
      console.log("❌ Service account key path not configured");
      return;
    }

    // Test file existence
    const fs = require("fs");
    if (!fs.existsSync(config.googleCalendar.serviceAccountKeyPath)) {
      console.log(
        `❌ Service account key file not found: ${config.googleCalendar.serviceAccountKeyPath}`
      );
      return;
    }

    console.log("✅ Service account key file exists\n");

    // Initialize calendar client
    console.log("🔐 Initializing Calendar Client...");
    const calendarClient = new CalendarClient();

    await calendarClient.initializeFromConfig();
    console.log("✅ Calendar client initialized successfully\n");

    // Test authentication
    console.log("🔑 Testing Authentication...");
    const isAuthenticated = calendarClient.isAuthenticated();
    console.log(
      `   Authentication Status: ${
        isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"
      }\n`
    );

    if (!isAuthenticated) {
      console.log("❌ Calendar client is not authenticated");
      return;
    }

    // Test calendar access
    console.log("📅 Testing Calendar Access...");
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    console.log(
      `   Fetching events from ${now.toISOString()} to ${tomorrow.toISOString()}`
    );

    const events = await calendarClient.getEvents(now, tomorrow);
    console.log(`✅ Successfully fetched ${events.length} events\n`);

    // Display events
    if (events.length > 0) {
      console.log("📋 Existing Events:");
      events.forEach((event, index) => {
        console.log(`   ${index + 1}. ${event.summary}`);
        console.log(`      Start: ${event.start.dateTime}`);
        console.log(`      End: ${event.end.dateTime}`);
        console.log(`      Status: ${event.status}\n`);
      });
    } else {
      console.log("📋 No events found in the next 24 hours\n");
    }

    // Test creating a test event
    console.log("🧪 Testing Event Creation...");
    const testStartTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
    const testEndTime = new Date(testStartTime.getTime() + 30 * 60 * 1000); // 30 minutes duration

    const testEventData = {
      summary: "Test Event - Google Calendar Integration",
      description:
        "This is a test event created to verify Google Calendar integration is working correctly.",
      startTime: testStartTime,
      endTime: testEndTime,
      attendees: [config.email.adminEmail],
      timeZone: config.googleCalendar.timeZone,
      location: "Test Location",
    };

    const createdEvent = await calendarClient.createEvent(testEventData);
    console.log(
      `✅ Test event created successfully with ID: ${createdEvent.id}\n`
    );

    // Clean up - delete the test event
    console.log("🧹 Cleaning up test event...");
    await calendarClient.deleteEvent(createdEvent.id);
    console.log("✅ Test event deleted successfully\n");

    // Get circuit breaker stats
    const stats = calendarClient.getCircuitBreakerStats();
    console.log("📊 Circuit Breaker Stats:");
    console.log(`   State: ${stats.state}`);
    console.log(`   Failure Count: ${stats.failureCount}`);
    console.log(`   Success Count: ${stats.successCount}\n`);

    console.log("🎉 Google Calendar integration test completed successfully!");
    console.log("✅ All tests passed - Google Calendar is working correctly");
  } catch (error) {
    console.error("❌ Google Calendar test failed:");
    console.error(`   Error: ${error.message}`);

    if (error.stack) {
      console.error("\n📋 Stack Trace:");
      console.error(error.stack);
    }

    process.exit(1);
  }
}

// Run the test
testGoogleCalendar().catch(console.error);
