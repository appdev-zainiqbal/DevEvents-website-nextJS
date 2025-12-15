"use client";
import { CreateBooking } from "@/app/api/actions/booking.actions";
import posthog from "posthog-js";
import React, { useState } from "react";

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    posthog.capture("event_booked");
    const { success } = await CreateBooking({ eventId, email, slug });
    if (success) {
      setSubmitted(true);
      posthog.capture("event_booking_success");
    } else {
      posthog.captureException("event_booking_failed");
      console.error("Failed to book event");
    }
  };
  return (
    <div id="book-event">
      {submitted ? (
        <div>
          <p>Thank you for booking your spot!</p>
        </div>
      ) : (
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="button-submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
