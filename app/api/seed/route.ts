import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Event } from "@/database";
import { events as defaultEvents } from "@/lib/constants";

export async function GET() {
  try {
    await connectToDatabase();

    const count = await Event.countDocuments();
    if (count > 0) {
      return NextResponse.json({
        success: true,
        message: `Database already contains ${count} events. Skipping seed.`,
      });
    }

    const seededEvents = [];
    for (const item of defaultEvents) {
      const created = await Event.create({
        title: item.title,
        description: item.description || "Join this premier developer event to connect, learn, and build with fellow tech creators.",
        overview: "This event brings together top software engineers, technical leads, and industry pioneers for deep-dive technical sessions, hands-on workshops, and networking opportunities.",
        image: item.image,
        venue: item.location || "Main Convention Center",
        location: item.location || "Global / Online",
        date: item.date || "October 2026",
        time: "10:00 AM - 5:00 PM EST",
        mode: "hybrid",
        audience: "Developers, Tech Leads, Engineers & Students",
        agenda: [
          "09:00 AM - Registration & Welcome Coffee",
          "10:00 AM - Keynote Address & Product Announcements",
          "12:30 PM - Networking Lunch & Interactive Demos",
          "02:00 PM - Deep-Dive Technical Workshops & Live Coding",
          "04:30 PM - Q&A Panel & Community Networking"
        ],
        organizer: "Dev Event Community",
        tags: [item.category || "Tech", "Developer", "Conference"],
      });
      seededEvents.push(created);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${seededEvents.length} events into MongoDB!`,
      data: seededEvents,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to seed database.";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
