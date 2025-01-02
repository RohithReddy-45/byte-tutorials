"use client";

import { toggleWatchlistAction } from "@/app/(dashboard)/courses/watch-list/action";
import { useToast } from "@/hooks/use-toast";
import type { YoutubeDetails } from "@/lib/types";
import { Bookmark, Play, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { UrlObject } from "node:url";

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
  const tagsArray = tags.split(",");

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

  return (
    <>
      <Card className="overflow-hidden rounded-lg border-none transition-all duration-300 hover:shadow-lg dark:bg-accent">
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
            <div className="flex flex-wrap gap-1">
              {tagsArray.map((tag) => (
                <Link key={tag} href={`?tech=${tag}`}>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer bg-neutral-400/25 hover:bg-neutral-400/50"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
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
          <h2 className="line-clamp-2 flex-grow pb-1 text-lg font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h2>
        </CardContent>
        <CardFooter className="p-3 pt-0 text-sm text-neutral-400">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={creatorUrl as unknown as UrlObject}
          >
            <span className="line-clamp-1">{creator}</span>
          </Link>
        </CardFooter>
      </Card>

      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand();
            }}
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close video"
          >
            <X className="size-8" />
          </Button>
          <div className="relative w-[90vw] max-w-4xl overflow-hidden rounded-lg bg-white shadow-2xl dark:bg-gray-800 md:w-screen">
            <div className="relative h-0 pb-[56.25%]">
              <iframe
                id="player"
                key={videoId}
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&origin=localhost:3000`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute left-0 top-0 h-full w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
