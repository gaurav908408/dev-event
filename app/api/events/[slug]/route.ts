import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Event } from "@/database";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const resolvedParams = await params;
    const rawSlug = resolvedParams?.slug;

    if (!rawSlug || typeof rawSlug !== "string" || rawSlug.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug parameter is required and cannot be empty.",
        },
        { status: 400 }
      );
    }

    const slug = rawSlug.trim().toLowerCase();

    let event = null;
    try {
      await connectToDatabase();
      event = await Event.findOne({ slug }).lean();
    } catch (dbError) {}

    if (!event) {
      const { events: defaultEvents } = await import("@/lib/constants");
      const foundConstant = defaultEvents.find(
        (e) =>
          e.id === slug ||
          e.title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-") === slug
      );

      if (foundConstant) {
        return NextResponse.json(
          {
            success: true,
            data: {
              ...foundConstant,
              slug: foundConstant.id || slug,
              description: foundConstant.description || "Join this exciting developer event to connect, learn, and build with fellow tech enthusiasts.",
              overview: "This event brings together industry leaders, senior developers, and passionate creators for hands-on sessions, keynotes, and networking opportunities.",
              venue: foundConstant.location || "Convention Center",
              location: foundConstant.location || "Global / Online",
              date: foundConstant.date || "October 2026",
              time: "10:00 AM - 5:00 PM EST",
              mode: "Hybrid",
              audience: "Developers, Tech Enthusiasts, Students & Engineers",
              agenda: [
                "09:00 AM - Registration & Welcome Coffee",
                "10:00 AM - Keynote Address & Tech Announcements",
                "12:30 PM - Networking Lunch & Demo Showcase",
                "02:00 PM - Deep-Dive Technical Workshops",
                "04:30 PM - Q&A Session & Closing Ceremony"
              ],
              organizer: "Dev Event Community",
              tags: [foundConstant.category || "Tech", "Developer", "Conference"]
            },
          },
          { status: 200 }
        );
      }
    }

    if (!event) {
      return NextResponse.json(
        {
          success: false,
          error: `Event with slug "${slug}" was not found.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: event,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected server error occurred.";

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch event details.",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
