import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 pb-24">
      <div className="relative rounded-3xl overflow-hidden border border-border/60 bg-gradient-to-br from-primary/5 via-background to-indigo-500/5 px-8 py-16 sm:px-16 text-center">
        {/* Subtle glow accents */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Ready to level up?
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Join developers who are building skills the smart way — structured
            paths, focused study, real progress.
          </p>
          <Link href="/sign-in">
            <Button
              size="lg"
              className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/20"
            >
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
