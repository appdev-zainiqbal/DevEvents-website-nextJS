import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import PostHogButton from "@/components/PostHogButton";
import { unstable_cache } from "next/cache";

// Cache the events fetch for 1 hour (3600 seconds)
const getCachedEvents = unstable_cache(
  async () => {
    try {
      // Use NEXT_PUBLIC_BASE_URL if available, otherwise construct from request
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) {
        console.warn("NEXT_PUBLIC_BASE_URL not set, returning empty events");
        return [];
      }

      const request = await fetch(`${baseUrl}/api/events`, {
        cache: "no-store",
      });

      if (!request.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await request.json();
      return data?.events || [];
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  },
  ["events-list"],
  {
    revalidate: 3600, // Revalidate every hour
    tags: ["events"],
  }
);

// Use dynamic rendering with caching (pages render at request time, but API responses are cached)
export const dynamic = "force-dynamic";

const HomePage = async () => {
  try {
    const serializedEvents = await getCachedEvents();

    return (
      <section>
        <h1 className="text-center text-4xl font-bold">
          The Hub for the Dev <br /> Events that You Can't Miss
        </h1>
        <p className="text-center text-lg mt-5 text-black-200">
          Hackathons , Meetup and Conferences all in one place
        </p>

        <ExploreBtn />

        <div className="mt-10 space-y-7">
          <h3>Featured Events</h3>
          <ul className="events">
            {serializedEvents &&
              serializedEvents.length > 0 &&
              serializedEvents.map((event: any) => (
                <li key={String(event._id) || event.title}>
                  <EventCard
                    title={event.title}
                    image={event.image}
                    slug={event.slug}
                    location={event.location}
                    date={event.date}
                    time={event.time}
                  />
                </li>
              ))}
          </ul>
        </div>
        {/* PostHog Button */}
        <PostHogButton />
      </section>
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return (
      <section>
        <h1 className="text-center text-4xl font-bold">
          The Hub for the Dev <br /> Events that You Can't Miss
        </h1>
        <p className="text-center text-lg mt-5 text-black-200">
          Hackathons , Meetup and Conferences all in one place
        </p>
        <p className="text-center text-red-500 mt-5">
          Error loading events. Please try again later.
        </p>
      </section>
    );
  }
};

export default HomePage;
