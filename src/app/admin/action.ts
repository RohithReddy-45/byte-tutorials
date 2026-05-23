"use server";
 
import { getCurrentSession } from "@/lib/validate-request";
import { revalidatePath, revalidateTag } from "next/cache";
import { globalPOSTRateLimit } from "@/lib/request";
import { saveYoutubeDetails } from "@/lib/queries";
import { VideoSchema, type YoutubeValues } from "@/lib/types";
import { db } from "@/db/database";
import { playlistsTable, playlistVideosTable, youtubeDetailsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function adminFormAction(formData: YoutubeValues) {
  const rateLimit = await globalPOSTRateLimit();
  if (!rateLimit) {
    throw new Error("Too many requests. Please try again later.");
  }
  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }
  if (user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    const { link, tags } = VideoSchema.parse(formData);
    const videoId = link.split("v=")[1].split("&")[0];
    const result = await saveYoutubeDetails(videoId, tags);
    if (result.error) {
      throw new Error(result.error);
    }
    revalidatePath("/courses");
    revalidateTag("youtube-details");
    return {
      success: result.success,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function getAvailableVideosAction() {
  const { user } = await getCurrentSession();
  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const videos = await db
      .select({
        videoId: youtubeDetailsTable.videoId,
        title: youtubeDetailsTable.title,
        creator: youtubeDetailsTable.creator,
      })
      .from(youtubeDetailsTable);

    return {
      success: true,
      videos,
    };
  } catch (error) {
    console.error("Failed to load database videos:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load database videos",
    };
  }
}

export async function createLearningPathAction(
  title: string,
  description: string,
  slug: string,
  videos: { videoId: string; orderIndex: number }[]
) {
  const { user } = await getCurrentSession();
  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  if (!title.trim() || !slug.trim()) {
    return { success: false, error: "Title and Slug are required fields." };
  }

  const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "-");

  try {
    // Check if slug is unique
    const existing = await db
      .select()
      .from(playlistsTable)
      .where(eq(playlistsTable.slug, cleanSlug))
      .limit(1);

    if (existing.length > 0) {
      return { success: false, error: `A Learning Path with slug '${cleanSlug}' already exists.` };
    }

    const playlistId = uuidv4();

    // Perform database transaction
    await db.transaction(async (tx) => {
      // 1. Create playlist
      await tx.insert(playlistsTable).values({
        id: playlistId,
        title: title.trim(),
        description: description.trim() || null,
        slug: cleanSlug,
        createdAt: new Date().toISOString(),
      });

      // 2. Map and insert videos
      for (const v of videos) {
        await tx.insert(playlistVideosTable).values({
          id: uuidv4(),
          playlistId: playlistId,
          videoId: v.videoId,
          orderIndex: v.orderIndex,
        });
      }
    });

    revalidatePath("/courses/paths");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    console.error("Failed to create learning path:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create learning path",
    };
  }
}
