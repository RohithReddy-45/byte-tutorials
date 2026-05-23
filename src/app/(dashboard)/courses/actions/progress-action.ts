"use server";

import { db } from "@/db/database";
import { videoProgressTable } from "@/db/schema";
import { getCurrentSession } from "@/lib/validate-request";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { revalidatePath } from "next/cache";

const progressSchema = z.object({
  videoId: z.string(),
  lastPosition: z.number().int().min(0),
  duration: z.number().int().min(0),
  status: z.enum(["not_started", "in_progress", "completed"]).optional(),
});

export async function updateVideoProgress(
  videoId: string,
  lastPosition: number,
  duration: number,
  manualStatus?: "not_started" | "in_progress" | "completed"
) {
  const { session } = await getCurrentSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const input = progressSchema.parse({ videoId, lastPosition, duration, status: manualStatus });
    
    // Check if progress already exists
    const existing = await db
      .select()
      .from(videoProgressTable)
      .where(
        and(
          eq(videoProgressTable.userId, session.userId),
          eq(videoProgressTable.videoId, videoId)
        )
      )
      .limit(1);

    // Calculate status automatically if not provided manually
    let status: "not_started" | "in_progress" | "completed" = manualStatus || "in_progress";
    if (!manualStatus && duration > 0) {
      if (lastPosition / duration >= 0.9) {
        status = "completed";
      } else if (lastPosition > 5) {
        status = "in_progress";
      } else {
        status = "not_started";
      }
    }

    // Keep completed status if it was already completed (unless manually changed)
    if (existing.length > 0 && existing[0].status === "completed" && !manualStatus) {
      status = "completed";
    }

    if (existing.length > 0) {
      await db
        .update(videoProgressTable)
        .set({
          lastPosition,
          duration,
          status,
          updatedAt: new Date().toISOString(),
        })
        .where(
          and(
            eq(videoProgressTable.userId, session.userId),
            eq(videoProgressTable.videoId, videoId)
          )
        );
      
      revalidatePath("/courses");
      revalidatePath("/courses/watch-list");
      revalidatePath("/courses/paths");
      revalidatePath("/courses/analytics");
      
      return { success: true, status };
    } else {
      await db.insert(videoProgressTable).values({
        id: uuidv4(),
        userId: session.userId,
        videoId,
        lastPosition,
        duration,
        status,
        updatedAt: new Date().toISOString(),
      });
      
      revalidatePath("/courses");
      revalidatePath("/courses/watch-list");
      revalidatePath("/courses/paths");
      revalidatePath("/courses/analytics");
      
      return { success: true, status };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update progress",
    };
  }
}

export async function getVideoProgress(videoId: string) {
  const { session } = await getCurrentSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const progress = await db
      .select()
      .from(videoProgressTable)
      .where(
        and(
          eq(videoProgressTable.userId, session.userId),
          eq(videoProgressTable.videoId, videoId)
        )
      )
      .limit(1);

    if (progress.length > 0) {
      return { success: true, data: progress[0] };
    }
    return { success: true, data: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch progress",
    };
  }
}

export async function getAllVideoProgress() {
  const { session } = await getCurrentSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const progressList = await db
      .select()
      .from(videoProgressTable)
      .where(eq(videoProgressTable.userId, session.userId));
    return { success: true, data: progressList };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch progress list",
    };
  }
}
