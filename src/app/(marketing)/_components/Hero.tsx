import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="container mx-auto flex leading-6 h-full flex-col items-center justify-center gap-5 px-10 py-10 text-center sm:px-24">
      <h1 className="text-3xl font-bold sm:text-4xl md:text-6xl">
        Master Tech Skills with Handpicked YouTube Courses
      </h1>
      <p className="text-xl font-medium text-foreground/70 md:text-2xl">
        Learn important tech skills with selected YouTube courses. Discover and
        organize top tech content all in one place.
      </p>
      <Link href="/sign-in">
        <Button className="w-fit font-medium self-center">
          Start learning now
        </Button>
      </Link>
    </section>
  );
}
