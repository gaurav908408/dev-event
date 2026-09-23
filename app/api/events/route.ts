import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Event } from "@/database";
import { events as defaultEvents } from "@/lib/constants";

export async function GET(): Promise<NextResponse> {
  try {
    await connectToDatabase();
    let eventsList = await Event.find({}).sort({ createdAt: -1 }).lean();

    if (!eventsList || eventsList.length === 0) {
      return NextResponse.json({ success: true, data: defaultEvents });
    }

    return NextResponse.json({ success: true, data: eventsList });
  } catch (error: unknown) {
    return NextResponse.json({ success: true, data: defaultEvents });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
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

    if (!title || !description || !overview || !image || !venue || !location || !date || !time || !mode || !audience || !organizer) {
      return NextResponse.json(
        { success: false, error: "Please fill out all required fields." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const parsedAgenda = Array.isArray(agenda)
      ? agenda
      : typeof agenda === "string"
      ? agenda.split("\n").filter((item) => item.trim().length > 0)
      : ["Main Keynote & Sessions"];

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
      : ["Developer", "Tech"];

    const slugify = (text: string) =>
      text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

    let slug = slugify(title) || `event-${Date.now()}`;
    const existingEvent = await Event.findOne({ slug });
    if (existingEvent) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const newEvent = await Event.create({
      title,
      slug,
      description,
      overview,
      image,
      venue,
      location,
      date,
      time,
      mode,
      audience,
      agenda: parsedAgenda,
      organizer,
      tags: parsedTags,
    });

    return NextResponse.json(
      { success: true, data: newEvent, message: "Event created successfully!" },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create event.";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
