import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import PostHogButton from "@/components/PostHogButton";
import { getEvents } from "@/lib/events";


// Caching is handled by next.config.ts cacheComponents and unstable_cache

const HomePage = async () => {ExploreBtn
  try {
      const serializedEvents = await getEvents();

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
