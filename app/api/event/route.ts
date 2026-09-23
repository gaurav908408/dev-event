import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: true,
      message: "Please use /api/events or /api/events/[slug] for event endpoints.",
    },
    { status: 200 }
  );
}
