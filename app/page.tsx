import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { events } from "@/lib/constants";

const HomePage = () => {
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
          {events.map((event) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HomePage;
