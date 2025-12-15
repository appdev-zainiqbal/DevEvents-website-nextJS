import { notFound } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import EventCard from "@/components/EventCard";
import BookEvent from "@/components/BookEvent";
import { IEvent } from "@/database";
import { GetSimilarEventsBySlug } from "@/app/api/actions/event.actions";
import { cacheLife } from "next/cache";
import { getBaseUrl } from "@/lib/getBaseUrl";

/* -------------------------------------------------
   Cached fetch using Next.js 16 Cache Components
--------------------------------------------------*/
async function getEventBySlug(slug: string) {
  "use cache";
  cacheLife("hours"); // ⏱ cache for ~1 hour

  const baseUrl = getBaseUrl();

  const res = await fetch(`${baseUrl}/api/events/${slug}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data?.event ?? null;
}

/* -------------------------------------------------
   Loading Skeleton
--------------------------------------------------*/
function EventDetailsSkeleton() {
  return (
    <section id="event">
      <div className="header">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
      </div>
      <section className="details">
        <div className="content">
          <div className="w-full h-96 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
          </div>
        </div>
        <aside className="booking">
          <div className="signup-card">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
          </div>
        </aside>
      </section>
    </section>
  );
}

/* -------------------------------------------------
   Event Content Component
--------------------------------------------------*/
async function EventContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const event = await getEventBySlug(slug);
  if (!event) return notFound();

  const similarEvents: IEvent[] = await GetSimilarEventsBySlug(slug);
  const bookings = 10;

  const {
    title,
    image,
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
        {/* Left */}
        <div className="content">
          <Image
            src={image}
            alt={title}
            width={800}
            height={800}
            className="banner"
          />

          <section>
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section>
            <h2>Event Details</h2>
            <p>{date}</p>
            <p>{time}</p>
            <p>{location}</p>
            <p>{mode}</p>
            <p>{audience}</p>
          </section>

          <section>
            <h2>Agenda</h2>
            <ul>
              {agenda.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Organizer</h2>
            <p>{organizer}</p>
          </section>

          <div className="flex gap-2 flex-wrap">
            {tags.map((tag: string) => (
              <span key={tag} className="pill">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            <p>
              {bookings > 0
                ? `Join ${bookings} people who already booked`
                : "Be the first to book"}
            </p>
            <BookEvent eventId={String(event._id)} slug={slug} />
          </div>
        </aside>
      </section>

      {/* Similar Events */}
      <section className="pt-20">
        <h2>Similar Events</h2>
        <div className="grid grid-cols-3 gap-4">
          {similarEvents.map((event: IEvent) => (
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
      </section>
    </section>
  );
}

/* -------------------------------------------------
   Page
--------------------------------------------------*/
const EventDetailsPage = ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  return (
    <Suspense fallback={<EventDetailsSkeleton />}>
      <EventContent params={params} />
    </Suspense>
  );
};

export default EventDetailsPage;
