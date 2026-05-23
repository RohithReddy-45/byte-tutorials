import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-32 max-w-5xl mx-auto">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8 animate-fade-in">
        <Sparkles className="h-3.5 w-3.5" />
        <span>Curated tech learning, reimagined</span>
      </div>

      {/* Headline */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
        Learn smarter.{" "}
        <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-500 bg-clip-text text-transparent">
          Build faster.
        </span>
      </h1>

      {/* Subline */}
      <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
        Byte Tutorials organizes the best YouTube programming courses into
        structured learning paths — with notes, progress tracking, and
        consistency tools built in.
      </p>

      {/* CTAs */}
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <Link href="/sign-in">
          <Button size="lg" className="gap-2 text-base px-6 h-12 shadow-md shadow-primary/20">
            Start learning for free
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
