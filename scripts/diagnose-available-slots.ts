#!/usr/bin/env tsx

/**
 * Available Slots Diagnostic Script
 * Helps identify why no available slots are being generated
 */

import { PrismaClient } from "@prisma/client";
import { config } from "../src/config/index.js";

const prisma = new PrismaClient();

async function diagnoseAvailableSlots() {
  console.log("🔍 Diagnosing Available Slots Issue...");
  console.log("=====================================\n");

  try {
    // 1. Check business hours configuration
    console.log("1️⃣ Business Hours Configuration:");
    console.log(
      `   Days of Week: ${config.bookingRules.businessHours.daysOfWeek.join(
        ", "
      )} (1=Mon, 2=Tue, ..., 7=Sun)`
    );
    console.log(
      `   Start Hour: ${config.bookingRules.businessHours.startHour}:00`
    );
    console.log(`   End Hour: ${config.bookingRules.businessHours.endHour}:00`);
    console.log(`   Timezone: ${config.bookingRules.businessHours.timeZone}`);
    console.log(`   Buffer Minutes: ${config.bookingRules.bufferMinutes}`);
    console.log(`   Min Advance Hours: ${config.bookingRules.minAdvanceHours}`);
    console.log(`   Max Advance Hours: ${config.bookingRules.maxAdvanceHours}`);

    // 2. Test different dates
    console.log("\n2️⃣ Testing Different Dates:");

    const testDates = [];
    for (let i = 1; i <= 7; i++) {
      const testDate = new Date();
      testDate.setDate(testDate.getDate() + i);
      testDates.push(testDate);
    }

    for (const testDate of testDates) {
      const dayOfWeek = testDate.getDay() === 0 ? 7 : testDate.getDay(); // Convert Sunday from 0 to 7
      const isBusinessDay =
        config.bookingRules.businessHours.daysOfWeek.includes(dayOfWeek);

      console.log(
        `   ${testDate.toDateString()} (Day ${dayOfWeek}): ${
          isBusinessDay ? "✅ Business Day" : "❌ Non-Business Day"
        }`
      );

      if (isBusinessDay) {
        // Test this date
        const startDate = new Date(testDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(testDate);
        endDate.setHours(23, 59, 59, 999);

        const slots = await generateAvailableSlots(startDate, endDate, 30);
        console.log(`     Generated ${slots.length} slots`);

        if (slots.length > 0) {
          console.log(
            `     First slot: ${new Date(slots[0].startTime).toLocaleString()}`
          );
          console.log(
            `     Last slot: ${new Date(
              slots[slots.length - 1].startTime
            ).toLocaleString()}`
          );
          break; // Found working date, no need to test more
        }
      }
    }

    // 3. Check current time constraints
    console.log("\n3️⃣ Current Time Constraints:");
    const now = new Date();
    const minAdvanceTime = new Date(
      now.getTime() + config.bookingRules.minAdvanceHours * 60 * 60 * 1000
    );
    const maxAdvanceTime = new Date(
      now.getTime() + config.bookingRules.maxAdvanceHours * 60 * 60 * 1000
    );

    console.log(`   Current Time: ${now.toLocaleString()}`);
    console.log(`   Min Advance Time: ${minAdvanceTime.toLocaleString()}`);
    console.log(`   Max Advance Time: ${maxAdvanceTime.toLocaleString()}`);

    // 4. Check existing bookings
    console.log("\n4️⃣ Existing Bookings:");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 7); // Check next week

    const existingBookings = await prisma.booking.findMany({
      where: {
        startTime: {
          gte: tomorrow,
          lt: dayAfter,
        },
        status: {
          not: "CANCELLED",
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    console.log(
      `   Found ${existingBookings.length} existing bookings in the next week`
    );
    existingBookings.forEach((booking) => {
      console.log(
        `   - ${new Date(booking.startTime).toLocaleString()} (${
          booking.duration
        }min) - ${booking.name}`
      );
    });

    // 5. Manual slot generation test
    console.log("\n5️⃣ Manual Slot Generation Test:");
    const testDate = new Date();
    testDate.setDate(testDate.getDate() + 1); // Tomorrow

    // Check if tomorrow is a business day
    const tomorrowDayOfWeek = testDate.getDay() === 0 ? 7 : testDate.getDay();
    const isTomorrowBusinessDay =
      config.bookingRules.businessHours.daysOfWeek.includes(tomorrowDayOfWeek);

    console.log(
      `   Testing date: ${testDate.toDateString()} (Day ${tomorrowDayOfWeek})`
    );
    console.log(`   Is business day: ${isTomorrowBusinessDay}`);

    if (isTomorrowBusinessDay) {
      const startOfDay = new Date(testDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(testDate);
      endOfDay.setHours(23, 59, 59, 999);

      const manualSlots = await generateAvailableSlots(
        startOfDay,
        endOfDay,
        30
      );
      console.log(`   Generated ${manualSlots.length} slots manually`);

      if (manualSlots.length > 0) {
        console.log("   Sample slots:");
        manualSlots.slice(0, 5).forEach((slot) => {
          console.log(
            `   - ${new Date(slot.startTime).toLocaleTimeString()} - ${new Date(
              slot.endTime
            ).toLocaleTimeString()}`
          );
        });
      } else {
        console.log("   ❌ No slots generated - investigating why...");

        // Debug slot generation
        const businessStart = config.bookingRules.businessHours.startHour;
        const businessEnd = config.bookingRules.businessHours.endHour;
        const duration = 30;

        console.log(
          `   Business hours: ${businessStart}:00 - ${businessEnd}:00`
        );
        console.log(`   Duration: ${duration} minutes`);

        // Check if we're within advance booking window
        const now = new Date();
        const minBookingTime = new Date(
          now.getTime() + config.bookingRules.minAdvanceHours * 60 * 60 * 1000
        );
        const maxBookingTime = new Date(
          now.getTime() + config.bookingRules.maxAdvanceHours * 60 * 60 * 1000
        );

        console.log(`   Current time: ${now.toLocaleString()}`);
        console.log(`   Min booking time: ${minBookingTime.toLocaleString()}`);
        console.log(`   Max booking time: ${maxBookingTime.toLocaleString()}`);
        console.log(`   Test date start: ${startOfDay.toLocaleString()}`);
        console.log(`   Test date end: ${endOfDay.toLocaleString()}`);

        if (endOfDay < minBookingTime) {
          console.log("   ❌ Test date is before minimum advance booking time");
        } else if (startOfDay > maxBookingTime) {
          console.log("   ❌ Test date is after maximum advance booking time");
        } else {
          console.log("   ✅ Test date is within booking window");
        }
      }
    } else {
      console.log(
        "   ❌ Tomorrow is not a business day, trying next business day..."
      );

      // Find next business day
      for (let i = 2; i <= 7; i++) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + i);
        const dayOfWeek = nextDate.getDay() === 0 ? 7 : nextDate.getDay();

        if (config.bookingRules.businessHours.daysOfWeek.includes(dayOfWeek)) {
          console.log(`   Next business day: ${nextDate.toDateString()}`);

          const startOfDay = new Date(nextDate);
          startOfDay.setHours(0, 0, 0, 0);

          const endOfDay = new Date(nextDate);
          endOfDay.setHours(23, 59, 59, 999);

          const slots = await generateAvailableSlots(startOfDay, endOfDay, 30);
          console.log(
            `   Generated ${slots.length} slots for next business day`
          );
          break;
        }
      }
    }
  } catch (error) {
    console.error("❌ Error during diagnosis:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function generateAvailableSlots(
  startDate: Date,
  endDate: Date,
  duration: number
) {
  const slots = [];
  const businessHours = config.bookingRules.businessHours;
  const now = new Date();
  const minAdvanceMs = config.bookingRules.minAdvanceHours * 60 * 60 * 1000;
  const maxAdvanceMs = config.bookingRules.maxAdvanceHours * 60 * 60 * 1000;
  const minBookingTime = new Date(now.getTime() + minAdvanceMs);
  const maxBookingTime = new Date(now.getTime() + maxAdvanceMs);

  // Get existing bookings
  const existingBookings = await prisma.booking.findMany({
    where: {
      startTime: {
        gte: startDate,
        lt: endDate,
      },
      status: {
        not: "CANCELLED",
      },
    },
  });

  const current = new Date(startDate);

  while (current < endDate) {
    const dayOfWeek = current.getDay() === 0 ? 7 : current.getDay();

    if (businessHours.daysOfWeek.includes(dayOfWeek)) {
      // Generate slots for this business day
      for (
        let hour = businessHours.startHour;
        hour < businessHours.endHour;
        hour++
      ) {
        for (let minute = 0; minute < 60; minute += duration) {
          const slotStart = new Date(current);
          slotStart.setHours(hour, minute, 0, 0);

          const slotEnd = new Date(slotStart);
          slotEnd.setMinutes(slotEnd.getMinutes() + duration);

          // Check if slot end time exceeds business hours
          if (slotEnd.getHours() >= businessHours.endHour) {
            break;
          }

          // Check advance booking constraints
          if (slotStart < minBookingTime || slotStart > maxBookingTime) {
            continue;
          }

          // Check for conflicts with existing bookings
          const hasConflict = existingBookings.some((booking) => {
            const bookingStart = new Date(booking.startTime);
            const bookingEnd = new Date(bookingStart);
            bookingEnd.setMinutes(bookingEnd.getMinutes() + booking.duration);

            return slotStart < bookingEnd && slotEnd > bookingStart;
          });

          if (!hasConflict) {
            slots.push({
              startTime: slotStart.toISOString(),
              endTime: slotEnd.toISOString(),
              duration: duration,
            });
          }
        }
      }
    }

    current.setDate(current.getDate() + 1);
  }

  return slots;
}

async function main() {
  await diagnoseAvailableSlots();
}

main().catch(console.error);
