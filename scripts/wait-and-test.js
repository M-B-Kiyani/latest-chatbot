#!/usr/bin/env node

/**
 * Wait for deployment and test improvements
 */

console.log("⏳ Waiting for Railway deployment...\n");

async function waitAndTest() {
  // Wait 2 minutes for deployment
  console.log("🚀 Railway is deploying the changes...");
  console.log("   This usually takes 1-2 minutes");

  for (let i = 60; i >= 0; i -= 10) {
    process.stdout.write(`\r⏰ Waiting ${i} seconds...`);
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }

  console.log("\n\n🧪 Testing improved chat service...\n");

  // Import and run the test
  const { spawn } = require("child_process");

  const test = spawn("node", ["scripts/test-improved-chat.js"], {
    stdio: "inherit",
  });

  test.on("close", (code) => {
    console.log("\n📋 Deployment Test Complete!");

    if (code === 0) {
      console.log("\n🎉 Next Steps:");
      console.log(
        "   1. Start local widget server: node widget/serve-widget.js"
      );
      console.log(
        "   2. Test chat widget: http://localhost:8080/chat-widget-test.html"
      );
      console.log(
        "   3. Test connection: http://localhost:8080/test-connection.html"
      );
      console.log("   4. Try the improved booking flow with natural language");
    }
  });
}

waitAndTest().catch(console.error);
