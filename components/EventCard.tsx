import Image from "next/image";
import Link from "next/link";

interface Props {
  id?: string;
  slug?: string;
  title: string;
  image: string;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
  category?: string;
}

const EventCard = ({ id, slug, title, image, location, date, time }: Props) => {
  const eventSlug = slug || id || title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");

  return (
    <Link href={`/events/${eventSlug}`}>
      <div id="event-card" className="group cursor-pointer">
        <div className="overflow-hidden rounded-xl">
          <Image
            src={image}
            alt={title}
            width={410}
            height={300}
            className="poster transition-transform duration-300 ease-out group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col gap-2 pt-1">
          {location && (
            <div className="flex flex-row items-center gap-2">
              <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
              <p>{location}</p>
            </div>
          )}
          {date && (
            <div className="datetime">
              <div className="flex flex-row items-center gap-2">
                <Image src="/icons/calendar.svg" alt="date" width={14} height={14} />
                <p>{date}</p>
              </div>
            </div>
          )}

          <p className="title transition-colors duration-200 group-hover:text-primary">{title}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;