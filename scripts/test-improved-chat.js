#!/usr/bin/env node

/**
 * Test the improved chat service after fixes
 */

const https = require("https");
const { v4: uuidv4 } = require("uuid");

const API_BASE_URL = "https://latest-chatbot-production.up.railway.app";
const API_KEY =
  "c608cf9ace6a39a48451f2fc67a15e08c00a1f2c287d21ed38ea4c0652fa500d";

console.log("🔧 Testing Improved Chat Service\n");

async function sendChatMessage(message, sessionId) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      message: message,
      sessionId: sessionId,
    });

    const options = {
      hostname: "latest-chatbot-production.up.railway.app",
      port: 443,
      path: "/api/chat",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({
            statusCode: res.statusCode,
            data: JSON.parse(data),
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: { error: "Invalid JSON", raw: data },
          });
        }
      });
    });

    req.on("error", reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error("Timeout"));
    });

    req.write(postData);
    req.end();
  });
}

async function testImprovedBookingFlow() {
  console.log("🧪 Testing Improved Booking Flow");
  console.log("─".repeat(50));

  const sessionId = uuidv4();

  const messages = [
    "I want to book an appointment",
    "John Smith",
    "john.smith@example.com",
    "tomorrow at 2 PM",
  ];

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    console.log(`\n👤 User: ${message}`);

    try {
      const result = await sendChatMessage(message, sessionId);

      if (result.statusCode === 200 && result.data.success) {
        console.log(`🤖 Assistant: ${result.data.response}`);

        // Check if we're making progress
        if (i > 0 && result.data.response.includes("What's your name?")) {
          console.log(
            "⚠️  Still asking for name - extraction may not be working"
          );
        }
        if (i > 1 && result.data.response.includes("email address")) {
          console.log(
            "⚠️  Still asking for email - extraction may not be working"
          );
        }
      } else {
        console.log(`❌ Error: ${result.data.error || "Unknown error"}`);
        break;
      }

      // Small delay between messages
      if (i < messages.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    } catch (error) {
      console.log(`❌ Request failed: ${error.message}`);
      break;
    }
  }
}

async function testDateParsing() {
  console.log("\n🧪 Testing Date Parsing Improvements");
  console.log("─".repeat(50));

  const dateTests = [
    "What's available tomorrow?",
    "Show me slots for December 23rd",
    "Check availability for next Monday",
    "What times do you have on 2025-12-23?",
  ];

  for (const query of dateTests) {
    console.log(`\n👤 User: ${query}`);

    try {
      const result = await sendChatMessage(query, uuidv4());

      if (result.statusCode === 200 && result.data.success) {
        console.log(`🤖 Assistant: ${result.data.response}`);

        if (result.data.response.includes("Which date would you like")) {
          console.log("⚠️  Date not recognized");
        } else if (result.data.response.includes("available slots")) {
          console.log("✅ Date parsed successfully");
        }
      } else {
        console.log(`❌ Error: ${result.data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.log(`❌ Request failed: ${error.message}`);
    }
  }
}

async function testNameExtraction() {
  console.log("\n🧪 Testing Name Extraction");
  console.log("─".repeat(50));

  const sessionId = uuidv4();

  console.log("\n👤 User: I want to book an appointment");
  let result = await sendChatMessage(
    "I want to book an appointment",
    sessionId
  );
  console.log(`🤖 Assistant: ${result.data.response}`);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("\n👤 User: Sarah Johnson");
  result = await sendChatMessage("Sarah Johnson", sessionId);
  console.log(`🤖 Assistant: ${result.data.response}`);

  if (result.data.response.includes("email address")) {
    console.log("✅ Name extracted successfully - now asking for email");
  } else if (result.data.response.includes("What's your name")) {
    console.log("❌ Name extraction failed - still asking for name");
  }
}

async function runTests() {
  console.log("🎯 Testing chat improvements after code changes\n");

  // Note: These tests will show the current behavior
  // If changes haven't been deployed to Railway yet,
  // we'll see the old behavior

  await testImprovedBookingFlow();
  await testDateParsing();
  await testNameExtraction();

  console.log("\n📋 Summary:");
  console.log("   • If you see improvements, the changes are deployed");
  console.log("   • If behavior is the same, you need to deploy the changes");
  console.log(
    '   • Use: git add . && git commit -m "fix: improve chat parsing" && git push'
  );

  console.log("\n🔧 Changes Made:");
  console.log(
    '   ✅ Improved name extraction (no longer requires "my name is")'
  );
  console.log(
    '   ✅ Better date parsing (handles "December 23rd", "next Monday")'
  );
  console.log("   ✅ Enhanced time parsing");
  console.log("   ✅ Added company name extraction");
  console.log("   ✅ Added duration extraction");
}

runTests().catch(console.error);
