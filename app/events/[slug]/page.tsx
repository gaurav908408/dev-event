import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookingForm from "@/components/BookingForm";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EventDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch event details from database or constants fallback
  let event = null;
  try {
    const connectToDatabase = (await import("@/lib/mongodb")).default;
    const { Event } = await import("@/database");
    await connectToDatabase();
    const dbEvent = await Event.findOne({ slug }).lean();

    if (dbEvent) {
      event = {
        _id: dbEvent._id?.toString() || dbEvent.slug,
        slug: dbEvent.slug,
        title: dbEvent.title,
        image: dbEvent.image,
        description: dbEvent.description,
        overview: dbEvent.overview,
        venue: dbEvent.venue,
        location: dbEvent.location,
        date: dbEvent.date,
        time: dbEvent.time,
        mode: dbEvent.mode,
        audience: dbEvent.audience,
        agenda: dbEvent.agenda || [],
        organizer: dbEvent.organizer,
        tags: dbEvent.tags || [],
      };
    }
  } catch (err) {
    // Database connection fallback
  }

  if (!event) {
    try {
      const { events: defaultEvents } = await import("@/lib/constants");
      const foundConstant = defaultEvents.find(
        (e) =>
          e.id === slug ||
          e.title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-") === slug
      );

      if (foundConstant) {
        event = {
          _id: foundConstant.id || slug,
          slug: foundConstant.id || slug,
          title: foundConstant.title,
          image: foundConstant.image,
          description: foundConstant.description || "Join this premier developer event to connect, learn, and build with fellow tech creators.",
          overview: "This event brings together top software engineers, technical leads, and industry pioneers for deep-dive technical sessions, hands-on workshops, and networking opportunities.",
          venue: foundConstant.location || "Main Convention Center",
          location: foundConstant.location || "Global / Online",
          date: foundConstant.date || "October 2026",
          time: "10:00 AM - 5:00 PM EST",
          mode: "Hybrid",
          audience: "Developers, Tech Leads, Engineers & Students",
          agenda: [
            "09:00 AM - Registration & Welcome Coffee",
            "10:00 AM - Keynote Address & Product Announcements",
            "12:30 PM - Networking Lunch & Interactive Demos",
            "02:00 PM - Deep-Dive Technical Workshops & Live Coding",
            "04:30 PM - Q&A Panel & Community Networking"
          ],
          organizer: "Dev Event Community",
          tags: [foundConstant.category || "Tech", "Developer", "Conference"]
        };
      }
    } catch (err) {
      // Static fallback error
    }
  }

  if (!event) {
    notFound();
  }

  return (
    <main id="event" className="mx-auto container max-w-7xl px-6 sm:px-10 py-10">
      {/* Back button */}
      <Link href="/#events" className="inline-flex items-center gap-2 text-sm text-light-200 hover:text-primary mb-8 transition-colors">
        ← Back to all events
      </Link>

      {/* Header Info */}
      <div className="header">
        <div className="flex flex-wrap gap-2 mb-2">
          {event.tags.map((tag: string) => (
            <span key={tag} className="pill">
              #{tag}
            </span>
          ))}
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">{event.title}</h1>
        <p className="text-light-200 text-lg">{event.description}</p>
      </div>

      {/* Details Grid */}
      <div className="details">
        {/* Left Column: Content */}
        <div className="content">
          <div className="relative w-full h-[320px] sm:h-[420px] overflow-hidden rounded-2xl border border-border-dark">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="banner object-cover"
              priority
            />
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-dark-100/70 p-6 rounded-2xl border border-border-dark">
            <div>
              <p className="text-xs text-light-200 uppercase font-semibold">Date & Time</p>
              <p className="text-sm text-white font-medium mt-1">📅 {event.date}</p>
              <p className="text-xs text-light-200">⏰ {event.time}</p>
            </div>
            <div>
              <p className="text-xs text-light-200 uppercase font-semibold">Location & Mode</p>
              <p className="text-sm text-white font-medium mt-1">📍 {event.location}</p>
              <p className="text-xs text-light-200">🏛️ {event.venue} ({event.mode})</p>
            </div>
            <div>
              <p className="text-xs text-light-200 uppercase font-semibold">Organizer & Audience</p>
              <p className="text-sm text-white font-medium mt-1">👥 {event.organizer}</p>
              <p className="text-xs text-light-200">🎯 {event.audience}</p>
            </div>
          </div>

          {/* Overview */}
          <div className="flex flex-col gap-3">
            <h2>Overview</h2>
            <p className="text-light-100 leading-relaxed">{event.overview}</p>
          </div>

          {/* Agenda */}
          <div className="agenda">
            <h2>Event Agenda</h2>
            <ul className="flex flex-col gap-3 mt-2">
              {event.agenda.map((item: string, idx: number) => (
                <li key={idx} className="bg-dark-100/50 p-3 rounded-lg border border-border-dark flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Booking Form */}
        <div className="booking lg:sticky lg:top-24">
          <BookingForm
            eventId={event._id}
            slug={event.slug}
            eventTitle={event.title}
          />
        </div>
      </div>
    </main>
  );
}
