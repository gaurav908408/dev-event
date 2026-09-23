import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { events as defaultEvents } from "@/lib/constants";
import connectToDatabase from "@/lib/mongodb";
import { Event } from "@/database";

export default async function Home() {
  let displayEvents = defaultEvents;

  try {
    await connectToDatabase();
    const dbEvents = await Event.find({}).sort({ createdAt: -1 }).lean();
    const dbFormatted = (dbEvents || []).map((e: any) => ({
      id: e._id?.toString() || e.slug,
      slug: e.slug,
      title: e.title,
      image: e.image,
      date: e.date,
      location: e.location,
      description: e.description,
      category: e.tags?.[0] || e.mode || "Dev Event",
    }));

    const existingSlugs = new Set(dbFormatted.map((e) => e.slug));
    const filteredDefaults = defaultEvents.filter((d) => !existingSlugs.has(d.id));

    displayEvents = [...dbFormatted, ...filteredDefaults];
  } catch (err) {
    displayEvents = defaultEvents;
  }

  return (
    <main id="home" className="mx-auto container max-w-7xl px-6 sm:px-10 py-10">
      <section>
        <h1 className="text-center mt-5">
          THE HUB OF EVERY DEV
          <br />
          YOU CANNOT MISS IT
        </h1>

        <p className="subheading">
          Hackathons, Meetups and Conferences in one place
        </p>

        <ExploreBtn />

        <div className="mt-20 space-y-7" id="events">
          <h3>Featured Events</h3>

          <ul className="events">
            {displayEvents.map((event) => (
              <li key={event.title}>
                <EventCard {...event} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}