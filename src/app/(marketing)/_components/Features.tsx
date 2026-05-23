import {
  BookOpen,
  Route,
  StickyNote,
  BarChart3,
  CalendarHeart,
  Search,
} from "lucide-react";

const features = [
  {
    icon: Route,
    title: "Structured Learning Paths",
    description:
      "Follow curated roadmaps that guide you step-by-step through topics — from React basics to fullstack mastery.",
    color: "text-violet-500",
    bg: "bg-violet-500/10 dark:bg-violet-500/10",
  },
  {
    icon: StickyNote,
    title: "In-Video Notes",
    description:
      "Take timestamped notes while watching. Your notes are linked to the exact moment in the video for quick review.",
    color: "text-blue-500",
    bg: "bg-blue-500/10 dark:bg-blue-500/10",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description:
      "See which courses you've completed, track your watch time, and stay on top of your learning goals.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/10",
  },
  {
    icon: CalendarHeart,
    title: "Consistency Calendar",
    description:
      "Build a daily learning habit. Your study heatmap shows streaks and keeps you accountable every week.",
    color: "text-rose-500",
    bg: "bg-rose-500/10 dark:bg-rose-500/10",
  },
  {
    icon: BookOpen,
    title: "Curated Courses",
    description:
      "Every video is hand-picked from top YouTube educators — no noise, no low-quality content.",
    color: "text-amber-500",
    bg: "bg-amber-500/10 dark:bg-amber-500/10",
  },
  {
    icon: Search,
    title: "Smart Filtering",
    description:
      "Search and filter by language, framework, or topic to quickly find exactly what you want to learn next.",
    color: "text-sky-500",
    bg: "bg-sky-500/10 dark:bg-sky-500/10",
  },
];

export default function FeaturesSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      {/* Section header */}
      <div className="text-center mb-16">
        <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
          Everything you need
        </p>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Built for developers who learn
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Not just a video library — a complete toolkit to help you learn
          consistently and retain what you study.
        </p>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="group relative flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 hover:border-border hover:bg-card transition-all duration-200 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${feature.bg}`}
              >
                <Icon className={`h-5 w-5 ${feature.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
