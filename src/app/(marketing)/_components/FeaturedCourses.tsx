import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FeaturedCourses() {
  return (
    <div className="flex h-fit flex-col gap-5 px-10 py-10 text-center leading-6 sm:px-24 mt-16">
      <h1 className="text-2xl font-bold sm:text-4xl md:text-6xl">
        Featured Courses
      </h1>
      <Link href="/sign-in">
        <Button
          variant="link"
          className="inline-block w-fit self-center text-foreground"
        >
          Load more
        </Button>
      </Link>
    </div>
  );
}
