"use client";

import type { UrlObject } from "node:url";
import { toggleWatchlistAction } from "@/app/(dashboard)/courses/watch-list/action";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { YoutubeDetails } from "@/lib/types";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Bookmark, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";

import StudyWorkspace from "./StudyWorkspace";

export default function CourseCard({
  courses,
  initialIsBookmarked,
  initialProgress,
}: {
  courses: YoutubeDetails;
  initialIsBookmarked: boolean;
  initialProgress?: {
    lastPosition: number;
    duration: number;
    status: "not_started" | "in_progress" | "completed";
  } | null;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [progress, setProgress] = useState(initialProgress);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { videoId, title, tags, creatorUrl, creator } = courses;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    startTransition(async () => {
      try {
        const result = await toggleWatchlistAction(videoId);

        if (!result.success) {
          setIsBookmarked(!isBookmarked);
          throw new Error(result.error || "Failed to toggle bookmark");
        }
        setIsBookmarked(result.isInWatchlist);
        toast({
          description: result.isInWatchlist
            ? "Added to watchlist"
            : "Removed from watchlist",
        });
      } catch {
        console.error("Error toggling bookmark");
        setIsBookmarked(!isBookmarked);
        toast({
          variant: "destructive",
          description: "Failed to update watchlist",
        });
      }
    });
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "visible";
    };
  }, [isExpanded]);

  const percent = progress && progress.duration > 0
    ? Math.min(100, Math.floor((progress.lastPosition / progress.duration) * 100))
    : 0;

  return (
    <>
      <Card className="overflow-hidden rounded-lg border-none transition-all duration-300 drop-shadow-md hover:shadow-lg dark:bg-accent/50">
        <div
          className="group relative cursor-pointer overflow-hidden"
          onClick={toggleExpand}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              toggleExpand();
            }
          }}
          role="button"
          tabIndex={0}
        >
          <Image
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={title}
            width={1280}
            height={720}
            placeholder="blur"
            blurDataURL={`https://img.youtube.com/vi/${videoId}/sddefault.jpg`}
            className="aspect-video h-auto w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-30">
            <Play className="size-16 border-0 fill-white stroke-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          
          {/* Status Badge */}
          {progress?.status === "completed" && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-emerald-950 uppercase tracking-wider shadow z-10">
              Completed
            </span>
          )}
          {progress?.status === "in_progress" && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-amber-950 uppercase tracking-wider shadow z-10">
              In Progress
            </span>
          )}

          {/* Progress Bar overlay */}
          {percent > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800/80">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          )}
        </div>
        <CardContent className="space-y-2 px-3 py-1">
          <div className="flex items-center justify-between">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={creatorUrl as unknown as UrlObject}
            >
              <span className="line-clamp-1 text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-200 hover:text-neutral-800 duration-300 transition-colors">
                {creator}
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleBookmark();
              }}
              disabled={isPending}
              className="flex-shrink-0"
              aria-label={
                isBookmarked ? "Remove from watchlist" : "Add to watchlist"
              }
            >
              <Bookmark
                className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
              />
            </Button>
          </div>
          <h2 className="line-clamp-2 flex-grow mb-1 text-lg font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h2>
        </CardContent>
        <CardFooter className="p-3 pt-0 text-sm">
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Link key={tag.slug} href={`?tech=${encodeURIComponent(tag.slug)}`}>
                <Badge
                  variant="secondary"
                  className="cursor-pointer bg-neutral-400/25 hover:bg-neutral-400/50"
                >
                  {tag.label}
                </Badge>
              </Link>
            ))}
          </div>
        </CardFooter>
      </Card>
      
      {isMobile ? (
        isExpanded && (
          <div className="fixed inset-0 z-50 bg-background text-foreground flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0">
              <StudyWorkspace
                videoId={videoId}
                title={title}
                creator={creator}
                onClose={() => setIsExpanded(false)}
                onProgressUpdate={(pct, stat) => {
                  setProgress({
                    lastPosition: Math.floor((pct / 100) * (progress?.duration || 100)),
                    duration: progress?.duration || 100,
                    status: stat as "not_started" | "in_progress" | "completed",
                  });
                }}
              />
            </div>
          </div>
        )
      ) : (
        <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
          <DialogTitle className="sr-only">Course Study Workspace</DialogTitle>
          <DialogDescription className="sr-only">
            Interactive side-by-side study workspace with notes and progress tracking
          </DialogDescription>
          <DialogContent className="max-w-[95vw] lg:max-w-[1200px] h-[90vh] bg-transparent border-0 p-0 overflow-hidden shadow-none">
            <div className="relative w-full h-full">
              <StudyWorkspace
                videoId={videoId}
                title={title}
                creator={creator}
                onClose={() => setIsExpanded(false)}
                onProgressUpdate={(pct, stat) => {
                  setProgress({
                    lastPosition: Math.floor((pct / 100) * (progress?.duration || 100)),
                    duration: progress?.duration || 100,
                    status: stat as "not_started" | "in_progress" | "completed",
                  });
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
