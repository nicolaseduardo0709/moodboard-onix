"use client";

import { useState } from "react";

interface StarRatingProps {
  ratings: number[];
  onRate: (rating: number) => void;
  size?: "sm" | "md";
}

export default function StarRating({ ratings, onRate, size = "sm" }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const avg =
    ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

  const starSize = size === "md" ? "text-xl" : "text-base";

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = (hover || avg) >= star;
          return (
            <button
              key={star}
              onClick={() => onRate(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className={`${starSize} cursor-pointer transition-colors leading-none`}
            >
              <span className={filled ? "text-amber-400" : "text-[#555]"}>
                {filled ? "★" : "☆"}
              </span>
            </button>
          );
        })}
      </div>
      <span className="text-xs text-[#888]">({ratings.length})</span>
    </div>
  );
}
