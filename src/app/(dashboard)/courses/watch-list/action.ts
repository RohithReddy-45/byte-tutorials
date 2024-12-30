"use server";

import { z } from "zod";
import { getCurrentSession } from "@/lib/validate-request";
import { revalidatePath } from "next/cache";
import { globalPOSTRateLimit } from "@/lib/request";
import { toggleWatchlistItem } from "@/lib/queries";

type ActionResponse = {
  success: boolean;
  isInWatchlist: boolean;
  error?: string;
};

const youtubeVideoIdSchema = z
  .string()
  .regex(/^[a-zA-Z0-9_-]+$/, {
    message:
      "Invalid YouTube video ID. It must be 11 characters long and contain only letters, numbers, underscores, or hyphens.",
  })
  .min(1, { message: "Video ID cannot be empty." })
  .max(11, { message: "Video ID must not exceed 11 characters." });

export async function toggleWatchlistAction(
  videoId: string,
): Promise<ActionResponse> {
  const rateLimit = await globalPOSTRateLimit();
  if (!rateLimit) {
    throw new Error("Too many requests. Please try again later.");
  }
  const { session } = await getCurrentSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  try {
    const parsedInput = youtubeVideoIdSchema.parse(videoId);
    const result = await toggleWatchlistItem(session.userId, parsedInput);
    if (result.success) {
      revalidatePath("/courses/watch-list");
    }

    return result;
  } catch (error) {
    console.error("Watchlist toggle failed:", error);
    return {
      success: false,
      isInWatchlist: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
