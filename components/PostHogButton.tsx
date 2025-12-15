"use client";

import posthog from "posthog-js";

export default function PostHogButton() {
  return (
    <div>
      <button onClick={() => posthog.capture("explore_btn_clicked")}></button>
    </div>
  );
}
