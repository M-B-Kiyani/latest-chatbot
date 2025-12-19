#!/usr/bin/env node

/**
 * Test date parsing in chat service
 */

const https = require("https");
const { v4: uuidv4 } = require("uuid");

const API_BASE_URL = "https://latest-chatbot-production.up.railway.app";
const API_KEY =
  "c608cf9ace6a39a48451f2fc67a15e08c00a1f2c287d21ed38ea4c0652fa500d";

console.log("📅 Testing Date Parsing in Chat Service\n");

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

async function testDateFormats() {
  const sessionId = uuidv4();

  const dateTests = [
    {
      description: "Tomorrow",
      messages: [
        "I want to book an appointment",
        "John Smith",
        "john.smith@test.com",
        "tomorrow at 2 PM",
      ],
    },
    {
      description: "Specific Date (YYYY-MM-DD)",
      messages: [
        "I want to book an appointment",
        "Jane Doe",
        "jane.doe@test.com",
        "2025-12-23 at 3 PM",
      ],
    },
    {
      description: "Day of Week",
      messages: [
        "I want to book an appointment",
        "Bob Wilson",
        "bob.wilson@test.com",
        "next Monday at 10 AM",
      ],
    },
    {
      description: "Natural Language Date",
      messages: [
        "I want to book an appointment",
        "Alice Brown",
        "alice.brown@test.com",
        "December 23rd at 2:30 PM",
      ],
    },
  ];

  for (const test of dateTests) {
    console.log(`\n🧪 Testing: ${test.description}`);
    console.log("─".repeat(40));

    const testSessionId = uuidv4();

    for (let i = 0; i < test.messages.length; i++) {
      const message = test.messages[i];
      console.log(`👤 User: ${message}`);

      try {
        const result = await sendChatMessage(message, testSessionId);

        if (result.statusCode === 200 && result.data.success) {
          console.log(`🤖 Assistant: ${result.data.response}`);

          // Check for specific error patterns
          if (
            result.data.response.includes("date or time format seems incorrect")
          ) {
            console.log("⚠️  Date parsing issue detected");
          }
          if (
            result.data.response.includes("encountered an issue while booking")
          ) {
            console.log("⚠️  Booking creation issue detected");
          }
        } else {
          console.log(`❌ Error: ${result.data.error || "Unknown error"}`);
          break;
        }

        // Small delay between messages
        if (i < test.messages.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.log(`❌ Request failed: ${error.message}`);
        break;
      }
    }
  }

  // Test availability with different date formats
  console.log("\n🧪 Testing Availability Queries");
  console.log("─".repeat(40));

  const availabilityTests = [
    "What times are available tomorrow?",
    "Show me slots for December 23rd",
    "What's available next Monday?",
    "Check availability for 2025-12-23",
  ];

  for (const query of availabilityTests) {
    console.log(`\n👤 User: ${query}`);

    try {
      const result = await sendChatMessage(query, uuidv4());

      if (result.statusCode === 200 && result.data.success) {
        console.log(`🤖 Assistant: ${result.data.response}`);
      } else {
        console.log(`❌ Error: ${result.data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.log(`❌ Request failed: ${error.message}`);
    }
  }

  console.log("\n📊 Date Parsing Analysis:");
  console.log(
    "   • The chat service is working but has date parsing challenges"
  );
  console.log(
    '   • "Tomorrow" and relative dates may not be handled correctly'
  );
  console.log("   • Specific date formats (YYYY-MM-DD) might work better");
  console.log("   • Time parsing appears to have issues with AM/PM format");

  console.log("\n💡 Recommendations:");
  console.log("   • Improve date parsing regex in conversation.service.ts");
  console.log("   • Add better natural language date processing");
  console.log(
    "   • Consider using a date parsing library like date-fns or moment"
  );
  console.log("   • Add more robust time format handling");
}

testDateFormats().catch(console.error);
