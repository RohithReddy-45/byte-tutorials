"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { categories } from "@/constants/constants";

export function CategoryCard() {
  return (
    <InfiniteMovingCards
      items={categories}
      direction="right"
      speed="slow"
      className="mt-5"
    />
  );
}
