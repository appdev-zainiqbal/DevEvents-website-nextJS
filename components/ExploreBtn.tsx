"use client";
import Image from "next/image";

const ExploreBtn = () => {
  return (
    <button
      onClick={() => {
        console.log("ExploreBtn clicked");
      }}
      type="button"
      className="mt-7 mx-auto "
      id="explore-btn"
    >
      <a href="#events">
        Explore Events
        <Image
          src="/icons/arrow-down.svg"
          alt="arrow-down"
          width={20}
          height={20}
        />
      </a>
    </button>
  );
};

export default ExploreBtn;
