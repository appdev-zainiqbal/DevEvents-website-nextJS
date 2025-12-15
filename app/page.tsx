import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import PostHogButton from "@/components/PostHogButton";

const HomePage = async () => {
  try {
    // Fetch events from API endpoint instead of directly querying the database
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const request = await fetch(`${baseUrl}/api/events`, {
      cache: "no-store", // or 'force-cache' for caching
    });

    if (!request.ok) {
      throw new Error("Failed to fetch events");
    }

    const data = await request.json();
    const serializedEvents = data?.events || [];

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
