#!/usr/bin/env tsx

/**
 * Database Connection Test Script
 * Tests database connectivity and runs migrations if needed
 */

import { PrismaClient } from "@prisma/client";
import { config } from "../src/config/index.js";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.database.url,
    },
  },
});

async function testDatabaseConnection() {
  console.log("🔍 Testing Database Connection...");
  console.log(
    `Database URL: ${config.database.url.replace(/:[^:@]*@/, ":****@")}`
  );

  try {
    // Test basic connection
    console.log("\n1️⃣ Testing basic connection...");
    await prisma.$connect();
    console.log("✅ Database connection successful!");

    // Test if tables exist
    console.log("\n2️⃣ Checking if tables exist...");
    try {
      const bookingCount = await prisma.booking.count();
      console.log(`✅ Booking table exists with ${bookingCount} records`);
    } catch (error) {
      console.log("❌ Booking table does not exist or is not accessible");
      console.log("Error:", error.message);

      console.log("\n🔧 You need to run database migrations:");
      console.log("Run: npx prisma migrate deploy");
      console.log("Or: npx prisma db push");
      return false;
    }

    // Test a simple query
    console.log("\n3️⃣ Testing query functionality...");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const bookings = await prisma.booking.findMany({
      where: {
        startTime: {
          gte: tomorrow,
          lt: dayAfter,
        },
      },
      take: 5,
    });

    console.log(
      `✅ Query successful! Found ${bookings.length} bookings for tomorrow`
    );

    // Test available slots logic (simplified)
    console.log("\n4️⃣ Testing available slots generation...");
    const businessStart = 9; // 9 AM
    const businessEnd = 17; // 5 PM
    const duration = 30; // 30 minutes

    const slots = [];
    const startHour = businessStart;
    const endHour = businessEnd;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += duration) {
        if (hour === endHour - 1 && minute + duration > 60) break;

        const slotStart = new Date(tomorrow);
        slotStart.setHours(hour, minute, 0, 0);

        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + duration);

        // Check if slot conflicts with existing booking
        const conflict = bookings.some((booking) => {
          const bookingStart = new Date(booking.startTime);
          const bookingEnd = new Date(bookingStart);
          bookingEnd.setMinutes(bookingEnd.getMinutes() + booking.duration);

          return slotStart < bookingEnd && slotEnd > bookingStart;
        });

        if (!conflict) {
          slots.push({
            startTime: slotStart.toISOString(),
            endTime: slotEnd.toISOString(),
            duration: duration,
          });
        }
      }
    }

    console.log(`✅ Generated ${slots.length} available slots for tomorrow`);

    if (slots.length > 0) {
      console.log("Sample slots:");
      slots.slice(0, 3).forEach((slot) => {
        const start = new Date(slot.startTime);
        const end = new Date(slot.endTime);
        console.log(
          `  - ${start.toLocaleTimeString()} - ${end.toLocaleTimeString()}`
        );
      });
    }

    console.log("\n🎉 Database is fully functional!");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error("Error:", error.message);

    if (
      error.message.includes("ENOTFOUND") ||
      error.message.includes("ECONNREFUSED")
    ) {
      console.log("\n💡 Possible solutions:");
      console.log("1. Check if the DATABASE_URL is correct");
      console.log("2. Ensure the database server is running");
      console.log("3. Check network connectivity");
      console.log("4. Verify Railway database is active");
    } else if (error.message.includes("authentication")) {
      console.log("\n💡 Authentication issue:");
      console.log("1. Check database username and password");
      console.log("2. Verify database user has proper permissions");
    } else if (error.message.includes("does not exist")) {
      console.log("\n💡 Database/table does not exist:");
      console.log("1. Run: npx prisma migrate deploy");
      console.log("2. Or: npx prisma db push");
    }

    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  console.log("🚀 Database Connection Test");
  console.log("==========================\n");

  const success = await testDatabaseConnection();

  if (success) {
    console.log("\n✅ All tests passed! Your database is ready.");
    process.exit(0);
  } else {
    console.log("\n❌ Database tests failed. Please fix the issues above.");
    process.exit(1);
  }
}

// Handle errors
process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

main().catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});
