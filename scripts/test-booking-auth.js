#!/usr/bin/env node

/**
 * Test booking creation with correct Authorization header
 */

const https = require("https");

const API_BASE_URL = "https://latest-chatbot-production.up.railway.app";
const API_KEY =
  "c608cf9ace6a39a48451f2fc67a15e08c00a1f2c287d21ed38ea4c0652fa500d";

console.log("🔐 Testing Booking Authentication Fix\n");

async function testBookingAuth() {
  console.log("🧪 Testing booking creation with correct Authorization header");
  console.log("─".repeat(60));

  // Create a test booking
  const bookingData = {
    name: "Test User",
    email: "test@example.com",
    phone: "+1234567890",
    company: "Test Company",
    inquiry: "Test booking via API",
    timeSlot: {
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      duration: 30,
    },
  };

  console.log("📋 Booking Data:");
  console.log(JSON.stringify(bookingData, null, 2));
  console.log("");

  // Test with correct Authorization header
  console.log("1️⃣ Testing with Authorization: Bearer header (CORRECT)");
  await testBookingRequest(bookingData, `Bearer ${API_KEY}`);

  // Test with old X-API-Key header for comparison
  console.log("\n2️⃣ Testing with X-API-Key header (INCORRECT - should fail)");
  await testBookingRequestOldFormat(bookingData, API_KEY);
}

async function testBookingRequest(bookingData, authHeader) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(bookingData);

    const options = {
      hostname: "latest-chatbot-production.up.railway.app",
      port: 443,
      path: "/api/bookings",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log(`   📊 Status: ${res.statusCode}`);

        if (res.statusCode === 201) {
          console.log("   ✅ Booking created successfully!");
          try {
            const parsed = JSON.parse(data);
            console.log(`   📅 Booking ID: ${parsed.data?.booking?.id}`);
            console.log(`   📧 Email: ${parsed.data?.booking?.email}`);
          } catch (e) {
            console.log("   📋 Response received (parsing failed)");
          }
        } else if (res.statusCode === 401) {
          console.log("   ❌ Authentication failed (401 Unauthorized)");
          try {
            const parsed = JSON.parse(data);
            console.log(
              `   💬 Error: ${parsed.error?.message || "Unknown error"}`
            );
          } catch (e) {
            console.log(`   💬 Raw response: ${data}`);
          }
        } else if (res.statusCode === 409) {
          console.log("   ⚠️  Booking conflict (slot already taken)");
          try {
            const parsed = JSON.parse(data);
            console.log(
              `   💬 Error: ${parsed.error?.message || "Unknown error"}`
            );
          } catch (e) {
            console.log(`   💬 Raw response: ${data}`);
          }
        } else {
          console.log(`   ❌ Request failed: ${res.statusCode}`);
          console.log(`   💬 Response: ${data}`);
        }
        resolve();
      });
    });

    req.on("error", (error) => {
      console.log(`   ❌ Request failed: ${error.message}`);
      resolve();
    });

    req.setTimeout(10000, () => {
      console.log("   ⏰ Request timed out");
      req.destroy();
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

async function testBookingRequestOldFormat(bookingData, apiKey) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(bookingData);

    const options = {
      hostname: "latest-chatbot-production.up.railway.app",
      port: 443,
      path: "/api/bookings",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log(`   📊 Status: ${res.statusCode}`);

        if (res.statusCode === 401) {
          console.log(
            "   ✅ Correctly rejected (401 Unauthorized) - as expected"
          );
          try {
            const parsed = JSON.parse(data);
            console.log(
              `   💬 Error: ${parsed.error?.message || "Unknown error"}`
            );
          } catch (e) {
            console.log(`   💬 Raw response: ${data}`);
          }
        } else {
          console.log(`   ⚠️  Unexpected status: ${res.statusCode}`);
          console.log(`   💬 Response: ${data}`);
        }
        resolve();
      });
    });

    req.on("error", (error) => {
      console.log(`   ❌ Request failed: ${error.message}`);
      resolve();
    });

    req.setTimeout(10000, () => {
      console.log("   ⏰ Request timed out");
      req.destroy();
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

async function runTest() {
  console.log(`🎯 Testing booking API: ${API_BASE_URL}/api/bookings`);
  console.log(
    `🔑 Using API key: ${API_KEY.substring(0, 8)}...${API_KEY.substring(
      API_KEY.length - 8
    )}\n`
  );

  await testBookingAuth();

  console.log("\n📋 Summary:");
  console.log("   ✅ Authorization: Bearer format should work");
  console.log("   ❌ X-API-Key format should be rejected");
  console.log("   🔧 Widget files have been updated to use correct format");

  console.log("\n🔗 Next Steps:");
  console.log(
    "   1. Test the booking widget: http://localhost:8080/test-widget.html"
  );
  console.log("   2. Try creating a booking through the widget");
  console.log("   3. Should now work without 401 errors");
}

runTest().catch(console.error);
