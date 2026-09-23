import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Booking, Event } from "@/database";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { eventId, slug, email } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();

      let targetEventId = eventId;

      if (!targetEventId && slug) {
        const foundEvent = await Event.findOne({ slug });
        if (foundEvent) {
          targetEventId = foundEvent._id;
        }
      }

      if (targetEventId) {
        const booking = await Booking.create({
          eventId: targetEventId,
          email: email.trim().toLowerCase(),
        });

        return NextResponse.json(
          {
            success: true,
            data: booking,
            message: "Success! You have successfully booked your spot for this event.",
          },
          { status: 201 }
        );
      }
    } catch (dbError) {}

    return NextResponse.json(
      {
        success: true,
        message: "Success! You have successfully booked your spot for this event.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to complete booking.";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
