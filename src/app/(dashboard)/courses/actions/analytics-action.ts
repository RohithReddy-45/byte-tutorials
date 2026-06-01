"use server";

import { db } from "@/db/database";
import { videoNotesTable, videoProgressTable } from "@/db/schema";
import { getCurrentSession } from "@/lib/validate-request";
import { eq, sql, and } from "drizzle-orm";

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number; // intensity score (number of actions)
}

export interface AnalyticsData {
  totalWatchTimeHours: number;
  totalNotesCount: number;
  totalCompletedCount: number;
  currentStreak: number;
  longestStreak: number;
  heatmapData: HeatmapDay[];
  dbQueryDurationMs: number;
}

export async function getUserAnalytics(): Promise<{ success: boolean; data?: AnalyticsData; error?: string }> {
  const { session } = await getCurrentSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const userId = session.userId;
    const start = performance.now();

    // Run all independent DB queries in parallel for speed
    const [
      [watchTimeResult],
      [completedResult],
      [notesCountResult],
      activityDates,
      actionCounts,
    ] = await Promise.all([
      // 1. Total watch time (sum of lastPosition in seconds)
      db
        .select({
          totalSeconds: sql<number>`SUM(${videoProgressTable.lastPosition})`,
        })
        .from(videoProgressTable)
        .where(eq(videoProgressTable.userId, userId)),

      // 2. Total completed videos
      db
        .select({
          count: sql<number>`COUNT(*)`.mapWith(Number),
        })
        .from(videoProgressTable)
        .where(
          and(
            eq(videoProgressTable.userId, userId),
            eq(videoProgressTable.status, "completed")
          )
        ),

      // 3. Total notes
      db
        .select({
          count: sql<number>`COUNT(*)`.mapWith(Number),
        })
        .from(videoNotesTable)
        .where(eq(videoNotesTable.userId, userId)),

      // 4a. Heatmap: unique activity dates
      db.all<{ dateStr: string }>(
        sql`
          SELECT DISTINCT substr(created_at, 1, 10) as dateStr
          FROM video_notes
          WHERE user_id = ${userId}
          UNION
          SELECT DISTINCT substr(updated_at, 1, 10) as dateStr
          FROM video_progress
          WHERE user_id = ${userId}
        `
      ),

      // 4b. Heatmap: action count per day
      db.all<{ dateStr: string; actionsCount: number }>(
        sql`
          SELECT dateStr, COUNT(*) as actionsCount FROM (
            SELECT substr(created_at, 1, 10) as dateStr
            FROM video_notes
            WHERE user_id = ${userId}
            UNION ALL
            SELECT substr(updated_at, 1, 10) as dateStr
            FROM video_progress
            WHERE user_id = ${userId}
          )
          GROUP BY dateStr
        `
      ),
    ]);

    const totalWatchTimeHours = watchTimeResult?.totalSeconds
      ? Math.round((watchTimeResult.totalSeconds / 3600) * 10) / 10
      : 0;

    const totalCompletedCount = completedResult?.count || 0;

    const totalNotesCount = notesCountResult?.count || 0;

    const end = performance.now();
    const dbQueryDurationMs = Math.round((end - start) * 100) / 100;

    const heatmapData: HeatmapDay[] = actionCounts.map((row) => ({
      date: row.dateStr,
      count: row.actionsCount,
    }));

    // 5. Streaks calculation
    const uniqueDates = activityDates
      .map((d) => d.dateStr)
      .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    let currentStreak = 0;
    let longestStreak = 0;

    if (uniqueDates.length > 0) {
      // Calculate current streak
      const todayStr = new Date().toISOString().substring(0, 10);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().substring(0, 10);

      const hasActivityToday = uniqueDates.includes(todayStr);
      const hasActivityYesterday = uniqueDates.includes(yesterdayStr);

      if (hasActivityToday || hasActivityYesterday) {
        let checkDate = hasActivityToday ? new Date() : yesterday;
        let streakCheck = true;

        while (streakCheck) {
          const checkStr = checkDate.toISOString().substring(0, 10);
          if (uniqueDates.includes(checkStr)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            streakCheck = false;
          }
        }
      }

      // Calculate longest streak
      let tempStreak = 0;
      let prevDateTime: number | null = null;

      for (const dateStr of uniqueDates) {
        const currentDateTime = new Date(dateStr).getTime();
        if (prevDateTime === null) {
          tempStreak = 1;
        } else {
          const diffDays = (currentDateTime - prevDateTime) / (1000 * 60 * 60 * 24);
          if (diffDays === 1) {
            tempStreak++;
          } else if (diffDays > 1) {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
        prevDateTime = currentDateTime;
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    return {
      success: true,
      data: {
        totalWatchTimeHours,
        totalCompletedCount,
        totalNotesCount,
        currentStreak,
        longestStreak: Math.max(longestStreak, currentStreak),
        heatmapData,
        dbQueryDurationMs,
      },
    };
  } catch (error) {
    console.error("Failed to calculate user analytics:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
}
