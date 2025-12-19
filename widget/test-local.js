#!/usr/bin/env node

/**
 * Test local widget server setup
 */

const http = require("http");

console.log("🧪 Testing local widget server...\n");

// Test if local server is running
function testLocalServer() {
  return new Promise((resolve) => {
    console.log("1️⃣ Testing local server at http://localhost:8080...");

    const options = {
      hostname: "localhost",
      port: 8080,
      path: "/test-connection.html",
      method: "GET",
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log("   ✅ Local server is running");
        console.log(
          "   🌐 You can now test at: http://localhost:8080/test-connection.html"
        );
      } else {
        console.log(`   ❌ Local server returned: ${res.statusCode}`);
      }
      resolve();
    });

    req.on("error", (error) => {
      console.log(`   ❌ Local server not accessible: ${error.message}`);
      console.log("   💡 Run: node widget/serve-widget.js");
      resolve();
    });

    req.setTimeout(5000, () => {
      console.log("   ⏰ Local server test timed out");
      req.destroy();
      resolve();
    });

    req.end();
  });
}

async function runTest() {
  await testLocalServer();

  console.log("\n📋 Next Steps:");
  console.log(
    "   1. Make sure local server is running: node widget/serve-widget.js"
  );
  console.log("   2. Open: http://localhost:8080/test-connection.html");
  console.log('   3. Click "Test API Connection" button');
  console.log("   4. If CORS errors persist, deploy updated .env to Railway");
  console.log(
    "\n💡 The .env file has been updated to include http://localhost:8080"
  );
  console.log(
    "   You need to deploy this change to Railway for it to take effect."
  );
}

runTest().catch(console.error);
