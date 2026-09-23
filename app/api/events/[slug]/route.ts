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
        { success: false, error: "Slug parameter is required." },
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
              description:
                foundConstant.description ||
                "Join this premier developer event to connect, learn, and build with fellow tech creators.",
              overview:
                "This event brings together industry leaders, senior developers, and passionate creators for hands-on sessions, keynotes, and networking opportunities.",
              venue: foundConstant.location || "Convention Center",
              location: foundConstant.location || "Global / Online",
              date: foundConstant.date || "2026-10-24",
              time: "10:00 AM - 5:00 PM EST",
              mode: "Hybrid",
              audience: "Developers, Tech Enthusiasts, Students & Engineers",
              agenda: [
                "09:00 AM - Registration & Welcome Coffee",
                "10:00 AM - Keynote Address & Tech Announcements",
                "12:30 PM - Networking Lunch & Demo Showcase",
                "02:00 PM - Deep-Dive Technical Workshops",
                "04:30 PM - Q&A Session & Closing Ceremony",
              ],
              organizer: "Dev Event Community",
              tags: [foundConstant.category || "Tech", "Developer", "Conference"],
            },
          },
          { status: 200 }
        );
      }
    }

    if (!event) {
      return NextResponse.json(
        { success: false, error: `Event with slug "${slug}" was not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: event }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected server error occurred.";

    return NextResponse.json(
      { success: false, error: "Failed to fetch event details.", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const resolvedParams = await params;
    const rawSlug = resolvedParams?.slug;

    if (!rawSlug) {
      return NextResponse.json({ success: false, error: "Slug parameter is required." }, { status: 400 });
    }

    const slug = rawSlug.trim().toLowerCase();
    const body = await request.json();

    const {
      title,
      description,
      overview,
      image,
      venue,
      location,
      date,
      time,
      mode,
      audience,
      agenda,
      organizer,
      tags,
    } = body;

    await connectToDatabase();

    const existingEvent = await Event.findOne({ slug });
    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: "Event not found or cannot be edited." },
        { status: 404 }
      );
    }

    const parsedAgenda = Array.isArray(agenda)
      ? agenda
      : typeof agenda === "string"
      ? agenda.split("\n").filter((item) => item.trim().length > 0)
      : existingEvent.agenda;

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
      : existingEvent.tags;

    existingEvent.title = title || existingEvent.title;
    existingEvent.description = description || existingEvent.description;
    existingEvent.overview = overview || existingEvent.overview;
    existingEvent.image = image || existingEvent.image;
    existingEvent.venue = venue || existingEvent.venue;
    existingEvent.location = location || existingEvent.location;
    existingEvent.date = date || existingEvent.date;
    existingEvent.time = time || existingEvent.time;
    existingEvent.mode = mode || existingEvent.mode;
    existingEvent.audience = audience || existingEvent.audience;
    existingEvent.agenda = parsedAgenda;
    existingEvent.organizer = organizer || existingEvent.organizer;
    existingEvent.tags = parsedTags;

    await existingEvent.save();

    return NextResponse.json(
      { success: true, data: existingEvent, message: "Event updated successfully!" },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update event.";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const resolvedParams = await params;
    const rawSlug = resolvedParams?.slug;

    if (!rawSlug) {
      return NextResponse.json({ success: false, error: "Slug parameter is required." }, { status: 400 });
    }

    const slug = rawSlug.trim().toLowerCase();
    await connectToDatabase();

    const deletedEvent = await Event.findOneAndDelete({ slug });

    if (!deletedEvent) {
      return NextResponse.json(
        { success: false, error: "Event not found or already deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Event deleted successfully." },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete event.";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
