import { CategoryCard } from "./CategoryCard";

export default function Explore() {
  return (
    <div className="flex flex-col gap-2 px-10 py-10 text-center leading-6 sm:px-24 overflow-x-hidden">
      <h1 className="text-2xl font-bold sm:text-4xl md:text-6xl">
        Explore by category
      </h1>
      <p className="text-xl font-medium text-foreground/70 md:text-2xl">
        Find the perfect course for your interests and goals.
      </p>
      <CategoryCard />
    </div>
  );
}
