import { redirect, notFound } from "next/navigation";
import { getCurrentSession } from "@/lib/validate-request";
import { getPlaylistDetails } from "@/app/(dashboard)/courses/actions/playlist-action";
import { getUserWatchlist } from "@/lib/queries";
import CourseCard from "@/components/CourseCard";
import { Compass, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

interface PathDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: { params: PathDetailsPageProps["params"] }): Promise<Metadata> {
  const params = await props.params;
  const res = await getPlaylistDetails(params.slug);
  if (!res.success || !res.data) {
    return { title: "Learning Path" };
  }
  return {
    title: `${res.data.title} | Learning Path`,
    description: res.data.description,
  };
}

export default async function PathDetailsPage(props: PathDetailsPageProps) {
  const session = await getCurrentSession();
  if (!session.user) {
    redirect("/sign-in");
  }

  const params = await props.params;
  const res = await getPlaylistDetails(params.slug);
  if (!res.success || !res.data) {
    notFound();
  }

  const playlist = res.data;
  const watchlistVideoIds = await getUserWatchlist(session.user.id);

  // Calculate completion
  const totalVideos = playlist.videos.length;
  const completedVideos = playlist.videos.filter((v) => v.progress?.status === "completed").length;
  const completionRate = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumbs & Header */}
      <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/courses/paths" className="hover:text-foreground transition">
            Learning Paths
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground truncate max-w-[200px]">{playlist.title}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Compass className="size-6 text-emerald-500 dark:text-emerald-400" />
              {playlist.title}
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">{playlist.description}</p>
          </div>

          <Link href="/courses/paths">
            <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-800 text-foreground bg-background hover:bg-accent flex-shrink-0">
              All Paths
            </Button>
          </Link>
        </div>

        {/* Pathway Progress Overview */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-card flex flex-col md:flex-row justify-between items-center gap-4 mt-2">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="size-5" />
            </span>
            <div>
              <span className="text-xs text-muted-foreground font-medium">Your Progress</span>
              <div className="text-sm font-bold text-foreground">
                {completedVideos} of {totalVideos} steps completed ({completionRate}%)
              </div>
            </div>
          </div>
          <div className="w-full md:w-64 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-350"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Curriculum Timeline */}
      <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 md:ml-6 pl-6 md:pl-10 space-y-8 mt-6">
        {playlist.videos.map((video, idx) => {
          const isCompleted = video.progress?.status === "completed";
          const isInProgress = video.progress?.status === "in_progress";

          return (
            <div key={video.id} className="relative group">
              {/* Step indicator node on timeline */}
              <span
                className={`absolute -left-[31px] md:-left-[47px] top-4 size-5 md:size-6 rounded-full border-2 flex items-center justify-center text-[10px] md:text-xs font-bold transition select-none ${
                  isCompleted
                    ? "bg-emerald-500 border-emerald-500 text-white dark:text-emerald-950"
                    : isInProgress
                    ? "bg-card border-amber-500 text-amber-600 dark:text-amber-400"
                    : "bg-background border-slate-200 dark:border-slate-800 text-muted-foreground group-hover:border-slate-300 dark:group-hover:border-slate-700"
                }`}
              >
                {idx + 1}
              </span>

              {/* Step wrapper */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
                {/* Step info label (left) */}
                <div className="lg:col-span-1 py-1 space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Step {idx + 1}
                  </span>
                  <h3 className="text-sm font-bold text-foreground line-clamp-1">{video.creator}</h3>
                  {isCompleted ? (
                    <span className="inline-flex text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Done
                    </span>
                  ) : isInProgress ? (
                    <span className="inline-flex text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/20 dark:border-amber-900/40 text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      Studying
                    </span>
                  ) : (
                    <span className="inline-flex text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-muted-foreground uppercase tracking-wider">
                      Locked
                    </span>
                  )}
                </div>

                {/* Course Card wrapper (right) */}
                <div className="lg:col-span-3 max-w-lg">
                  <CourseCard
                    courses={{
                      id: video.id,
                      videoId: video.videoId,
                      title: video.title,
                      creator: video.creator,
                      creatorUrl: video.creatorUrl,
                      tags: video.tags,
                    }}
                    initialIsBookmarked={watchlistVideoIds.includes(video.videoId)}
                    initialProgress={video.progress}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
