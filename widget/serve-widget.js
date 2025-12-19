#!/usr/bin/env node

/**
 * Simple HTTP server to serve widget files locally
 * This avoids CORS issues with file:// protocol
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 8080;
const WIDGET_DIR = __dirname;

// MIME types for different file extensions
const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  // Parse the URL
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;

  // Default to index.html if no specific file requested
  if (pathname === "/") {
    pathname = "/test-widget.html";
  }

  // Build the full file path
  const filePath = path.join(WIDGET_DIR, pathname);

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File not found
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(`
        <html>
          <body>
            <h1>404 - File Not Found</h1>
            <p>Available files:</p>
            <ul>
              <li><a href="/test-widget.html">test-widget.html</a></li>
              <li><a href="/test-connection.html">test-connection.html</a></li>
              <li><a href="/simple-integration.html">simple-integration.html</a></li>
              <li><a href="/integration-example.html">integration-example.html</a></li>
              <li><a href="/booking-widget.html">booking-widget.html</a></li>
            </ul>
          </body>
        </html>
      `);
      return;
    }

    // Get file extension and corresponding MIME type
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";

    // Read and serve the file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }

      // Set CORS headers to allow requests from this server
      res.writeHead(200, {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Widget server running at http://localhost:${PORT}`);
  console.log(`📋 Available pages:`);
  console.log(
    `   • http://localhost:${PORT}/test-widget.html - Main widget test`
  );
  console.log(
    `   • http://localhost:${PORT}/test-connection.html - Connection test`
  );
  console.log(
    `   • http://localhost:${PORT}/simple-integration.html - Simple integration`
  );
  console.log(
    `   • http://localhost:${PORT}/integration-example.html - Integration example`
  );
  console.log(
    `   • http://localhost:${PORT}/booking-widget.html - Basic widget`
  );
  console.log(
    `\n💡 This server serves your widget files with proper CORS headers`
  );
  console.log(`   to avoid file:// protocol issues when testing locally.`);
});

// Handle server shutdown gracefully
process.on("SIGINT", () => {
  console.log("\n👋 Shutting down widget server...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});
