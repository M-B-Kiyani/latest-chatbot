#!/usr/bin/env node

/**
 * Update Railway environment variables for CORS fix
 * This script helps you update the ALLOWED_ORIGINS on Railway
 */

const fs = require("fs");
const path = require("path");

console.log("🚀 Railway CORS Configuration Update\n");

// Read current .env file
const envPath = path.join(__dirname, "../.env");
let envContent = "";

try {
  envContent = fs.readFileSync(envPath, "utf8");
} catch (error) {
  console.log("❌ Could not read .env file:", error.message);
  process.exit(1);
}

// Extract ALLOWED_ORIGINS
const allowedOriginsMatch = envContent.match(/ALLOWED_ORIGINS=(.+)/);
if (!allowedOriginsMatch) {
  console.log("❌ ALLOWED_ORIGINS not found in .env file");
  process.exit(1);
}

const allowedOrigins = allowedOriginsMatch[1];

console.log("📋 Current ALLOWED_ORIGINS configuration:");
console.log(`   ${allowedOrigins}\n`);

console.log("🔧 To update Railway with this configuration:");
console.log("\n1️⃣ Using Railway CLI:");
console.log(
  '   railway variables set ALLOWED_ORIGINS="' + allowedOrigins + '"'
);

console.log("\n2️⃣ Using Railway Dashboard:");
console.log("   • Go to: https://railway.app/dashboard");
console.log("   • Select your project: latest-chatbot-production");
console.log("   • Go to Variables tab");
console.log("   • Update ALLOWED_ORIGINS with:");
console.log(`     ${allowedOrigins}`);

console.log("\n3️⃣ Using Git Deploy (Recommended):");
console.log("   git add .");
console.log('   git commit -m "fix: update CORS origins for local testing"');
console.log("   git push origin main");

console.log("\n📝 What this fixes:");
console.log("   ✅ Allows requests from http://localhost:8080");
console.log("   ✅ Maintains existing allowed origins");
console.log("   ✅ Fixes CORS errors when testing locally");

console.log("\n⏱️  After deployment:");
console.log("   • Wait 1-2 minutes for Railway to redeploy");
console.log("   • Test at: http://localhost:8080/test-connection.html");
console.log("   • CORS errors should be resolved");

console.log("\n🔍 Verify deployment:");
console.log("   node widget/test-backend.js");
