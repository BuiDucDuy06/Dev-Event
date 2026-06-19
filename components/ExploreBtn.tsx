'use client';

import Image from "next/image";
import posthog from "posthog-js";

const ExploreBtn = () => {
  const handleClick = () => {
    posthog.capture('explore_clicked');
    const el = document.getElementById("events");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mt-7 mx-auto flex items-center gap-2 border border-primary/40 text-primary hover:bg-primary/10 transition-colors px-6 py-3 rounded-full font-medium cursor-pointer"
    >
      Explore Events
      <Image src="/icons/arrow-down.svg" alt="arrow-down" height={20} width={20} />
    </button>
  );
};

export default ExploreBtn;