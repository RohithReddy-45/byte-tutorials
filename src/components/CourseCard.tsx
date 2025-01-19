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
import { Bookmark, Play, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";

export default function CourseCard({
  courses,
  initialIsBookmarked,
}: {
  courses: YoutubeDetails;
  initialIsBookmarked: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
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

  const VideoPlayer = () => (
    <div className="relative w-full h-full">
      <iframe
        id="player"
        key={videoId}
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&origin=${window.location.origin}&playsinline=1&controls=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleExpand}
        className="absolute right-4 -top-6 z-20 bg-black/70 hover:bg-black-70"
        aria-label="Close video"
      >
        <X className="size-6 text-white" />
      </Button>
    </div>
  );

  return (
    <>
      <Card className="overflow-hidden rounded-lg border-none transition-all duration-300 drop-shadow-md hover:shadow-lg dark:bg-accent/50">
        <div
          className="group relative cursor-pointer"
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
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={title}
            width={1280}
            height={720}
            placeholder="blur"
            blurDataURL={`https://img.youtube.com/vi/${videoId}/sddefault.jpg`}
            className="aspect-video h-auto w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-30">
            <Play className="size-16 border-0 fill-white stroke-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
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
              <Link key={tag.slug} href={`?tech=${tag.slug}`}>
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
          <div className="fixed inset-0 pt-10 z-50 bg-black">
            <VideoPlayer />
          </div>
        )
      ) : (
        <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
          <DialogTitle className="sr-only">Youtube video player </DialogTitle>
          <DialogDescription className="sr-only">
            Youtube video player
          </DialogDescription>
          <DialogContent className="sm:max-w-[90vw] bg-black h-[90vh] border-0 p-0">
            <VideoPlayer />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
