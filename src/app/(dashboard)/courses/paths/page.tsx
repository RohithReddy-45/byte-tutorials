import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/validate-request";
import { getPlaylists } from "@/app/(dashboard)/courses/actions/playlist-action";
import { ArrowRight, BookOpen, Compass, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Curated Learning Paths",
  description: "Follow curated paths to build your developer skills systematically, with progress tracking.",
};

export default async function PathsPage() {
  const session = await getCurrentSession();
  if (!session.user) {
    redirect("/sign-in");
  }

  const res = await getPlaylists();
  if (!res.success || !res.data) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl">
        <p className="font-semibold">Failed to load learning paths.</p>
        <p className="text-xs text-rose-500/80 mt-1">{res.error || "Please try again later."}</p>
      </div>
    );
  }

  const playlists = res.data;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Learning Paths</h1>
          <p className="text-sm text-muted-foreground">Structured curricula designed to take you from beginner to expert.</p>
        </div>
        <Link href="/courses">
          <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-800 text-foreground bg-background hover:bg-accent">
            Back to Browse
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((path) => {
          const completionRate = path.totalVideos > 0 
            ? Math.round((path.completedVideos / path.totalVideos) * 100)
            : 0;

          return (
            <div
              key={path.id}
              className="flex flex-col justify-between p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-card hover:border-slate-300 dark:hover:border-slate-700/60 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition duration-200"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-lg bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                    <Compass className="size-5" />
                  </span>
                  {completionRate === 100 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-950/50 border border-emerald-500/20 dark:border-emerald-900/50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <CheckCircle className="size-3" /> Complete
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground leading-snug">{path.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-3">{path.description}</p>
                </div>
              </div>

              {/* Progress and Link */}
              <div className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <BookOpen className="size-3.5" />
                      {path.completedVideos} / {path.totalVideos} videos
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400">{completionRate}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-350"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>

                <Link href={`/courses/paths/${path.slug}`} className="block">
                  <Button className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 h-9 text-xs font-bold transition">
                    Start Path
                    <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
