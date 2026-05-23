import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/validate-request";
import { getUserAnalytics } from "@/app/(dashboard)/courses/actions/analytics-action";
import StudyHeatmap from "@/components/StudyHeatmap";
import { Clock, BookOpen, CheckCircle, Award, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Analytics",
  description: "Track your study habits, consecutive days streak, watch progress, and custom study notes stats.",
};

export default async function AnalyticsPage() {
  const session = await getCurrentSession();
  if (!session.user) {
    redirect("/sign-in");
  }

  const res = await getUserAnalytics();
  if (!res.success || !res.data) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl">
        <p className="font-semibold">Failed to load analytics data.</p>
        <p className="text-xs text-rose-500/80 mt-1">{res.error || "Please try again later."}</p>
      </div>
    );
  }

  const stats = res.data;

  const cards = [
    {
      title: "Total Study Time",
      value: `${stats.totalWatchTimeHours} hrs`,
      icon: Clock,
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/30",
      description: "Hours spent watching tutorials",
    },
    {
      title: "Courses Completed",
      value: stats.totalCompletedCount,
      icon: CheckCircle,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/30",
      description: "Videos watched over 90%",
    },
    {
      title: "Saved Study Notes",
      value: stats.totalNotesCount,
      icon: BookOpen,
      color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/30",
      description: "Key concepts bookmarked",
    },
    {
      title: "Current Streak",
      value: `${stats.currentStreak} days`,
      icon: Zap,
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/30",
      description: "Consecutive active days",
    },
    {
      title: "Longest Streak",
      value: `${stats.longestStreak} days`,
      icon: Award,
      color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/30",
      description: "Your personal record",
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Learning Analytics</h1>
          <p className="text-sm text-muted-foreground">Track your daily study habits, progress, and streaks.</p>
        </div>
        <Link href="/courses">
          <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-800 text-foreground bg-background hover:bg-accent">
            Back to Browse
          </Button>
        </Link>
      </div>

      {/* Grid for Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-card flex flex-col justify-between space-y-3 transition duration-200 hover:border-slate-350 dark:hover:border-slate-700"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs text-muted-foreground font-medium">{card.title}</span>
              <span className={`p-1.5 rounded-lg border ${card.color}`}>
                <card.icon className="size-4" />
              </span>
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground">{card.value}</span>
              <p className="text-[10px] text-muted-foreground mt-1">{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Heatmap Section */}
      <StudyHeatmap data={stats.heatmapData} />

    </div>
  );
}
