import { notFound } from "next/navigation";
import Image from "next/image";
import { Booking, IEvent } from "@/database";
import BookEvent from "@/components/BookEvent";
import { GetSimilarEventsBySlug } from "@/app/api/actions/event.actions";
import EventCard from "@/components/EventCard";

const EventDetailsPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;

  const bookings = 10;

  const similarEvents: IEvent[] = await GetSimilarEventsBySlug(slug);

  const Tags = ({ tags }: { tags: string[] }) => {
    return (
      <div className="flex flex-row gap-2 flex-wrap">
        {tags.map((tag) => (
          <div className="pill" key={tag}>
            {tag}
          </div>
        ))}
      </div>
    );
  };
  const EventDetailItem = ({
    icon,
    alt,
    label,
  }: {
    icon: string;
    alt: string;
    label: string;
  }) => {
    return (
      <div className="flex flex-row gap-2 items-center">
        <Image src={icon} alt={alt} width={16} height={16} />
        <p>{label}</p>
      </div>
    );
  };

  const EventAgenda = ({ agenda }: { agenda: string[] }) => {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-2xl font-semibold">Agenda</p>
        <ul className="list-disc list-inside">
          {agenda.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };
  // Use absolute URL for server-side fetch - construct from environment or use localhost
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const request = await fetch(`${baseUrl}/api/events/${slug}`);

  if (!request.ok) {
    return notFound();
  }

  const data = await request.json();
  const event = data?.event;

  if (!event || !event.description) return notFound();

  const {
    title,
    image,
    description,
    overview,
    venue,
    location,
    date,
    time,
    mode,
    audience,
    agenda,
    organizer,
    tags,
  } = event;

  return (
    <section id="event">
      <div className="header">
        <h1>{title}</h1>
      </div>
      <section className="details">
        {/* Left Side  - Event Content*/}
        <div className="content">
          <Image
            src={image}
            alt={title}
            width={800}
            height={800}
            className="banner"
          />
          <section className="flex flex-col gap-2">
            <p className="text-2xl font-semibold">Overview</p>
            <p className="text-sm ">{overview}</p>
          </section>
          <section className="flex flex-col gap-2">
            <p className="text-2xl font-semibold">Event Details</p>
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="date"
              label={date}
            />
            <EventDetailItem icon="/icons/clock.svg" alt="time" label={time} />
            <EventDetailItem
              icon="/icons/pin.svg"
              alt="location"
              label={location}
            />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience"
              label={audience}
            />
          </section>
          <EventAgenda agenda={agenda} />

          <section className="flex flex-col gap-2">
            <p className="text-2xl font-semibold">Organizer</p>
            <p className="text-sm ">{organizer}</p>
          </section>

          <Tags tags={tags} />
        </div>
        {/* Right Side - Booking Form*/}
        <aside className="booking">
          <div className="signup-card">
            <p className="text-2xl font-semibold">Book Your Spot</p>
            {bookings > 0 ? (
              <p className="text-sm ">
                Join {bookings} people who have already booked their spot!{" "}
              </p>
            ) : (
              <p className="text-sm ">Be the first to book your spot!</p>
            )}
            <BookEvent />
          </div>
        </aside>
      </section>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2 className="text-2xl font-semibold">Similar Events</h2>
        <div className="grid grid-cols-3 gap-4">
          {similarEvents.length > 0 &&
            similarEvents.map((event: IEvent) => (
              <EventCard
                key={String(event._id)}
                title={event.title}
                image={event.image}
                slug={event.slug}
                location={event.location}
                date={event.date}
                time={event.time}
              />
            ))}
        </div>
      </div>
    </section>
  );
};

export default EventDetailsPage;
