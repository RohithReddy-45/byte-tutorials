import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTA() {
  return (
    <div className="flex h-fit flex-col gap-2 px-3 py-10 mt-16 text-center leading-6 sm:px-20">
      <div className="relative flex justify-between gap-y-10 xl:flex-row items-center text-start rounded-lg max-h-fit w-full flex-col bg-background/70 px-8 py-16 sm:px-16 lg:py-32 h-full bg-gray-900 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-10 border dark:border-indigo-700/50 border-slate-400/40">
        <div className="flex gap-9 flex-col">
          <h1 className="text-3xl font-medium dark:text-gray-100 text-gray-700 sm:text-4xl md:text-6xl">
            Start Learning Today!
          </h1>
          <p className="dark:text-gray-400 text-gray-500 text-xl sm:text-2xl">
            Explore our collection of handpicked courses and begin your learning
            journey.
          </p>
        </div>
        <div>
          <Link href="/sign-in">
            <Button size="lg">Get started </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
