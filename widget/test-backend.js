#!/usr/bin/env node

/**
 * Backend Connection Test Script
 * Tests if your Railway backend is responding correctly
 */

const https = require("https");
const http = require("http");

const API_BASE_URL = "https://latest-chatbot-production.up.railway.app";
const API_KEY =
  "c608cf9ace6a39a48451f2fc67a15e08c00a1f2c287d21ed38ea4c0652fa500d";

console.log("🔍 Testing backend connection...\n");

// Test 1: Basic health check
async function testHealthCheck() {
  return new Promise((resolve) => {
    console.log("1️⃣ Testing health endpoint...");

    const options = {
      hostname: "latest-chatbot-production.up.railway.app",
      port: 443,
      path: "/api/health",
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "Widget-Test/1.0",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          console.log("   ✅ Health check passed");
          console.log(`   📊 Status: ${res.statusCode}`);
          try {
            const parsed = JSON.parse(data);
            console.log(`   📋 Response: ${JSON.stringify(parsed, null, 2)}`);
          } catch (e) {
            console.log(`   📋 Response: ${data}`);
          }
        } else {
          console.log(`   ❌ Health check failed: ${res.statusCode}`);
          console.log(`   📋 Response: ${data}`);
        }
        resolve();
      });
    });

    req.on("error", (error) => {
      console.log(`   ❌ Health check failed: ${error.message}`);
      resolve();
    });

    req.setTimeout(10000, () => {
      console.log("   ⏰ Health check timed out");
      req.destroy();
      resolve();
    });

    req.end();
  });
}

// Test 2: Available slots endpoint
async function testAvailableSlots() {
  return new Promise((resolve) => {
    console.log("\n2️⃣ Testing available slots endpoint...");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const queryParams = new URLSearchParams({
      startDate: tomorrow.toISOString(),
      endDate: dayAfter.toISOString(),
      duration: "30",
    });

    const options = {
      hostname: "latest-chatbot-production.up.railway.app",
      port: 443,
      path: `/api/bookings/available-slots?${queryParams}`,
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "Widget-Test/1.0",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log(`   📊 Status: ${res.statusCode}`);

        if (res.statusCode === 200) {
          console.log("   ✅ Available slots endpoint working");
          try {
            const parsed = JSON.parse(data);
            const slotsCount = parsed.data?.slots?.length || 0;
            console.log(`   📅 Found ${slotsCount} available slots`);
            if (slotsCount > 0) {
              console.log(
                `   🕐 First slot: ${parsed.data.slots[0]?.startTime}`
              );
            }
          } catch (e) {
            console.log(`   📋 Response: ${data}`);
          }
        } else if (res.statusCode === 401 || res.statusCode === 403) {
          console.log("   ❌ Authentication failed - check your API key");
          console.log(`   📋 Response: ${data}`);
        } else if (res.statusCode === 503) {
          console.log(
            "   ❌ Service unavailable - likely database connection issue"
          );
          console.log(`   📋 Response: ${data}`);
        } else {
          console.log(`   ❌ Request failed: ${res.statusCode}`);
          console.log(`   📋 Response: ${data}`);
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

    req.end();
  });
}

// Test 3: CORS preflight
async function testCORS() {
  return new Promise((resolve) => {
    console.log("\n3️⃣ Testing CORS preflight...");

    const options = {
      hostname: "latest-chatbot-production.up.railway.app",
      port: 443,
      path: "/api/bookings/available-slots",
      method: "OPTIONS",
      headers: {
        Origin: "http://localhost:8080",
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "Authorization,Content-Type",
      },
    };

    const req = https.request(options, (res) => {
      console.log(`   📊 Status: ${res.statusCode}`);

      if (res.statusCode === 200 || res.statusCode === 204) {
        console.log("   ✅ CORS preflight successful");
        console.log(
          `   🔒 Access-Control-Allow-Origin: ${res.headers["access-control-allow-origin"]}`
        );
        console.log(
          `   🔒 Access-Control-Allow-Methods: ${res.headers["access-control-allow-methods"]}`
        );
        console.log(
          `   🔒 Access-Control-Allow-Headers: ${res.headers["access-control-allow-headers"]}`
        );
      } else {
        console.log(`   ❌ CORS preflight failed: ${res.statusCode}`);
      }
      resolve();
    });

    req.on("error", (error) => {
      console.log(`   ❌ CORS test failed: ${error.message}`);
      resolve();
    });

    req.setTimeout(10000, () => {
      console.log("   ⏰ CORS test timed out");
      req.destroy();
      resolve();
    });

    req.end();
  });
}

// Run all tests
async function runTests() {
  console.log(`🎯 Testing backend: ${API_BASE_URL}`);
  console.log(
    `🔑 Using API key: ${API_KEY.substring(0, 8)}...${API_KEY.substring(
      API_KEY.length - 8
    )}\n`
  );

  await testHealthCheck();
  await testAvailableSlots();
  await testCORS();

  console.log("\n📋 Test Summary:");
  console.log("   If all tests pass, your backend is working correctly.");
  console.log("   If tests fail, check your Railway deployment logs.");
  console.log("\n💡 Next steps:");
  console.log("   1. Run: node widget/serve-widget.js");
  console.log("   2. Open: http://localhost:8080/test-connection.html");
  console.log("   3. Test the widget in your browser");
}

runTests().catch(console.error);
