"use client";

import { useState } from "react";

interface StarRatingProps {
  ratings: number[];
  onRate: (rating: number) => void;
}

export default function StarRating({ ratings, onRate }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const avg =
    ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="text-lg cursor-pointer transition-colors"
          >
            <span
              className={
                (hover || avg) >= star ? "text-yellow-400" : "text-zinc-600"
              }
            >
              ★
            </span>
          </button>
        ))}
      </div>
      {ratings.length > 0 && (
        <span className="text-xs text-zinc-500">({ratings.length})</span>
      )}
    </div>
  );
}
