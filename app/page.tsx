import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { events } from "@/lib/constants";

export default function Home() {
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
            {events.map((event) => (
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