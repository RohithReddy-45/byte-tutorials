import "server-only";
import { db } from "@/db/database";

import { watchListTable, youtubeDetailsTable } from "@/db/schema";
import { PER_PAGE } from "@/constants/constants";
import { and, desc, eq, or, sql } from "drizzle-orm";
import { cache } from "react";
import { v4 as uuidv4 } from "uuid";
import { getCurrentSession } from "./validate-request";
//import { fetchVideoInfo } from "./fetchVideoInfo";

/* COURSE QUERIES  */
export async function fetchWatchlistData(
  userId: string,
  query: string | undefined,
  tech: string | undefined,
  page: number,
) {
  if (!query && !tech) {
    return getWatchlistPaginated(userId, page, PER_PAGE);
  }

  const results = await Promise.all([
    query ? filterWatchlistByQuery(userId, query, page, PER_PAGE) : null,
    tech ? filterWatchlistByTags(userId, tech, page, PER_PAGE) : null,
  ]);

  const combinedResults = [
    ...(results[0]?.data || []),
    ...(results[1]?.data || []),
  ];

  const uniqueResults = Array.from(
    new Map(combinedResults.map((item) => [item.id, item])).values(),
  );

  const startIndex = (page - 1) * PER_PAGE;
  const endIndex = startIndex + PER_PAGE;

  const total = uniqueResults.length || 0;
  return {
    data: uniqueResults.slice(startIndex, endIndex),
    total,
    perPage: PER_PAGE,
  };
}

export interface VideoInfo {
  title: string;
  author_url: string;
  author_name: string;
}

export const saveYoutubeDetails = async (
  videoId: string,
  title: string,
  tags: string,
) => {
  if (!videoId?.trim()) {
    throw new Error("Video ID is required");
  }
  if (!title?.trim()) {
    throw new Error("Title is required");
  }
  const { user } = await getCurrentSession();
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  //https://www.youtube.com/watch?v=HD13eq_Pmp8
  //const { title, author_url, author_name } = await fetchVideoInfo(videoId);
  //if (!title || !author_url || !author_name) {
  //  throw new Error("Failed to fetch video info");
  //}

  try {
    const existing = await db
      .select()
      .from(youtubeDetailsTable)
      .where(eq(youtubeDetailsTable.videoId, videoId))
      .limit(1);

    if (existing.length > 0) {
      throw new Error("Video already exists");
    }

    await db.insert(youtubeDetailsTable).values({
      id: uuidv4(),
      videoId,
      title,
      tags,
    });
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }

  //return {
  //  success: false,
  //  error: "Unknown error occurred",
  //};
};

export const getYoutubeDetailsPaginated = cache(
  async (page: number, perPage: number) => {
    const { user } = await getCurrentSession();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const offset = (page - 1) * perPage;

    const videos = await db
      .select()
      .from(youtubeDetailsTable)
      .orderBy(desc(youtubeDetailsTable.createdAt))
      .limit(perPage)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql`count(*)`.mapWith(Number).as("count") })
      .from(youtubeDetailsTable);

    return {
      data: videos,
      total: countResult.count,
      perPage,
      currentPage: page,
    };
  },
);

// BUG: fix tag query
export const filterYoutubeDetailsByTags = cache(
  async (tech: string, page: number, perPage: number) => {
    const { user } = await getCurrentSession();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const tags = tech
      .split(",")
      .map((tag) => tag.toLowerCase().replace(/\s+/g, ""));
    const offset = (page - 1) * perPage;

    const tagConditions = tags.map(
      (tag) =>
        sql`REPLACE(LOWER(${youtubeDetailsTable.tags}), ' ', '') LIKE ${`%${tag}%`}`,
    );

    const videos = await db
      .select()
      .from(youtubeDetailsTable)
      .orderBy(desc(youtubeDetailsTable.createdAt))
      .where(or(...tagConditions))
      .limit(perPage)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql`count(*)`.mapWith(Number).as("count") })
      .from(youtubeDetailsTable);

    return {
      data: videos,
      total: countResult.count,
      perPage,
      currentPage: page,
    };
  },
);

export const filterYoutubeDetailsByQuery = cache(
  async (query: string, page: number, perPage: number) => {
    const { user } = await getCurrentSession();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const searchTerms = query.toLowerCase().split(" ");
    const offset = (page - 1) * perPage;

    const queryConditions = searchTerms.map((term) =>
      or(
        sql`LOWER(${youtubeDetailsTable.title}) LIKE ${`%${term}%`}`,
        sql`LOWER(${youtubeDetailsTable.tags}) LIKE ${`${term}`}`,
      ),
    );
    const videos = await db
      .select()
      .from(youtubeDetailsTable)
      .orderBy(desc(youtubeDetailsTable.createdAt))
      .where(or(...queryConditions))
      .limit(perPage)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql`count(*)`.mapWith(Number).as("count") })
      .from(youtubeDetailsTable);

    return {
      data: videos,
      total: countResult.count,
      perPage,
      currentPage: page,
    };
  },
);

/* WATCHLIST QUERIES  */

type WatchlistResponse = {
  success: boolean;
  isInWatchlist: boolean;
  error?: string;
};

export async function toggleWatchlistItem(
  userId: string,
  videoId: string,
): Promise<WatchlistResponse> {
  try {
    const existingEntry = await db
      .select()
      .from(watchListTable)
      .where(
        and(
          eq(watchListTable.userId, userId),
          eq(watchListTable.videoId, videoId),
        ),
      )
      .limit(1);

    if (existingEntry.length > 0) {
      await db
        .delete(watchListTable)
        .where(
          and(
            eq(watchListTable.userId, userId),
            eq(watchListTable.videoId, videoId),
          ),
        );

      return { success: true, isInWatchlist: false };
    }

    await db.insert(watchListTable).values({
      id: uuidv4(),
      userId,
      videoId,
      createdAt: new Date().toISOString(),
    });

    return { success: true, isInWatchlist: true };
  } catch (error) {
    console.error("Toggle watchlist item failed:", error);
    return {
      success: false,
      isInWatchlist: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export const getWatchlistPaginated = cache(
  async (userId: string, page: number, perPage: number) => {
    const { user } = await getCurrentSession();

    if (!user) {
      throw new Error("Unauthorized");
    }

    if (!userId) {
      throw new Error("Invalid user ID");
    }

    const offset = (page - 1) * perPage;

    const watchlist = await db
      .select({
        id: watchListTable.id,
        videoId: watchListTable.videoId,
        title: youtubeDetailsTable.title,
        tags: youtubeDetailsTable.tags,
        createdAt: watchListTable.createdAt,
      })
      .from(watchListTable)
      .where(eq(watchListTable.userId, userId))
      .leftJoin(
        youtubeDetailsTable,
        eq(watchListTable.videoId, youtubeDetailsTable.videoId),
      )
      .limit(perPage)
      .offset(offset)
      .orderBy(desc(watchListTable.createdAt));

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(watchListTable)
      .where(eq(watchListTable.userId, userId));

    if (watchlist.length === 0) {
      return {
        data: [],
        total: 0,
        perPage,
        currentPage: page,
      };
    }

    return {
      data: watchlist,
      total: countResult.count,
      perPage,
      currentPage: page,
    };
  },
);

export const filterWatchlistByQuery = cache(
  async (userId: string, query: string, page: number, perPage: number) => {
    const { user } = await getCurrentSession();

    if (!user) {
      throw new Error("Unauthorized");
    }

    if (!userId) {
      throw new Error("Invalid user ID");
    }

    if (!query?.trim()) {
      return {
        data: [],
        total: 0,
        perPage,
        currentPage: page,
      };
    }

    const offset = (page - 1) * perPage;
    const searchTerms = query.toLowerCase().split(" ");

    const queryConditions = searchTerms.map((term) =>
      or(
        sql`LOWER(${youtubeDetailsTable.title}) LIKE ${`%${term}%`}`,
        sql`LOWER(${youtubeDetailsTable.tags}) LIKE ${`${term}`}`,
      ),
    );

    const userWatchlistByQuery = await db
      .select({
        id: watchListTable.id,
        videoId: watchListTable.videoId,
        title: youtubeDetailsTable.title,
        tags: youtubeDetailsTable.tags,
        createdAt: watchListTable.createdAt,
      })
      .from(watchListTable)
      .leftJoin(
        youtubeDetailsTable,
        eq(watchListTable.videoId, youtubeDetailsTable.videoId),
      )
      .where(and(eq(watchListTable.userId, userId), or(...queryConditions)))
      .limit(perPage)
      .offset(offset)
      .orderBy(desc(watchListTable.createdAt));

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(watchListTable)
      .where(eq(watchListTable.userId, userId));

    return {
      data: userWatchlistByQuery,
      total: countResult.count,
      perPage,
      currentPage: page,
    };
  },
);

//BUG: fix tag query
export const filterWatchlistByTags = cache(
  async (userId: string, tech: string, page: number, perPage: number) => {
    const { user } = await getCurrentSession();

    if (!user) {
      throw new Error("Unauthorized");
    }

    if (!userId) {
      throw new Error("Invalid user ID");
    }

    const offset = (page - 1) * perPage;
    const tags = tech.split(",").map((tag) => tag.trim());

    const tagConditions = tags.map(
      (tag) =>
        sql`LOWER(${youtubeDetailsTable.tags}) LIKE ${`${tag.toLowerCase()}`}`,
    );

    const userWatchlistByTags = await db
      .select({
        id: watchListTable.id,
        videoId: watchListTable.videoId,
        title: youtubeDetailsTable.title,
        tags: youtubeDetailsTable.tags,
        createdAt: watchListTable.createdAt,
      })
      .from(watchListTable)
      .leftJoin(
        youtubeDetailsTable,
        eq(watchListTable.videoId, youtubeDetailsTable.videoId),
      )
      .where(and(eq(watchListTable.userId, userId), or(...tagConditions)))
      .limit(perPage)
      .offset(offset)
      .orderBy(desc(watchListTable.createdAt));

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(watchListTable)
      .where(eq(watchListTable.userId, userId));

    return {
      data: userWatchlistByTags,
      total: countResult.count,
      perPage,
      currentPage: page,
    };
  },
);

// NOTE: check
export const getUserWatchlist = cache(
  async (userId: string): Promise<string[]> => {
    const { user } = await getCurrentSession();

    if (!user) {
      throw new Error("Unauthorized");
    }

    if (!userId) {
      throw new Error("Invalid user ID");
    }

    const results = await db
      .select({ videoId: watchListTable.videoId })
      .from(watchListTable)
      .where(eq(watchListTable.userId, userId));

    return results.map((item) => item.videoId);
  },
);
