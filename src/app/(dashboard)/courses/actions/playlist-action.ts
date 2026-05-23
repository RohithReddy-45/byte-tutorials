"use server";

import { db } from "@/db/database";
import { playlistsTable, playlistVideosTable, youtubeDetailsTable, videoProgressTable } from "@/db/schema";
import { getCurrentSession } from "@/lib/validate-request";
import { and, asc, eq } from "drizzle-orm";

export interface PlaylistWithProgress {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  totalVideos: number;
  completedVideos: number;
}

export interface PlaylistDetail {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  videos: Array<{
    id: string;
    videoId: string;
    title: string;
    creator: string;
    creatorUrl: string;
    tags: Array<{ label: string; slug: string }>;
    orderIndex: number;
    progress: {
      lastPosition: number;
      duration: number;
      status: "not_started" | "in_progress" | "completed";
    } | null;
  }>;
}

export async function getPlaylists(): Promise<{ success: boolean; data?: PlaylistWithProgress[]; error?: string }> {
  const { session } = await getCurrentSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const playlists = await db.select().from(playlistsTable);
    const data: PlaylistWithProgress[] = [];

    for (const playlist of playlists) {
      // Get all videos in this playlist
      const pVideos = await db
        .select({ videoId: playlistVideosTable.videoId })
        .from(playlistVideosTable)
        .where(eq(playlistVideosTable.playlistId, playlist.id));

      const videoIds = pVideos.map((pv) => pv.videoId);
      
      let completedVideos = 0;
      if (videoIds.length > 0) {
        // Count how many are completed by the user
        const completedProgress = await db
          .select()
          .from(videoProgressTable)
          .where(
            and(
              eq(videoProgressTable.userId, session.userId),
              eq(videoProgressTable.status, "completed"),
              // Drizzle "inArray" replacement or simple count
            )
          );
        
        // Filter progress matching videoIds in playlist
        completedVideos = completedProgress.filter((p) => videoIds.includes(p.videoId)).length;
      }

      data.push({
        id: playlist.id,
        title: playlist.title,
        description: playlist.description,
        slug: playlist.slug,
        totalVideos: videoIds.length,
        completedVideos,
      });
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch playlists:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}

export async function getPlaylistDetails(slug: string): Promise<{ success: boolean; data?: PlaylistDetail; error?: string }> {
  const { session } = await getCurrentSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [playlist] = await db
      .select()
      .from(playlistsTable)
      .where(eq(playlistsTable.slug, slug))
      .limit(1);

    if (!playlist) {
      return { success: false, error: "Playlist not found" };
    }

    // Fetch videos joined with metadata
    const playlistVideos = await db
      .select({
        id: playlistVideosTable.id,
        videoId: playlistVideosTable.videoId,
        orderIndex: playlistVideosTable.orderIndex,
        title: youtubeDetailsTable.title,
        creator: youtubeDetailsTable.creator,
        creatorUrl: youtubeDetailsTable.creatorUrl,
        tags: youtubeDetailsTable.tags,
      })
      .from(playlistVideosTable)
      .leftJoin(youtubeDetailsTable, eq(playlistVideosTable.videoId, youtubeDetailsTable.videoId))
      .where(eq(playlistVideosTable.playlistId, playlist.id))
      .orderBy(asc(playlistVideosTable.orderIndex));

    // Fetch user progress for each video
    const videosWithProgress = [];
    for (const pv of playlistVideos) {
      if (!pv.videoId) continue;
      
      const [progress] = await db
        .select()
        .from(videoProgressTable)
        .where(
          and(
            eq(videoProgressTable.userId, session.userId),
            eq(videoProgressTable.videoId, pv.videoId)
          )
        )
        .limit(1);

      videosWithProgress.push({
        id: pv.id,
        videoId: pv.videoId,
        title: pv.title || "Untitled Video",
        creator: pv.creator || "Unknown Creator",
        creatorUrl: pv.creatorUrl || "#",
        tags: pv.tags || [],
        orderIndex: pv.orderIndex,
        progress: progress
          ? {
              lastPosition: progress.lastPosition,
              duration: progress.duration,
              status: progress.status,
            }
          : null,
      });
    }

    return {
      success: true,
      data: {
        id: playlist.id,
        title: playlist.title,
        description: playlist.description,
        slug: playlist.slug,
        videos: videosWithProgress,
      },
    };
  } catch (error) {
    console.error("Failed to fetch playlist details:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}
