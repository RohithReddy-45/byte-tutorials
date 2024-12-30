import { relations, sql } from "drizzle-orm";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: t.text("id").primaryKey(),
  email: t.text("email").notNull().unique(),
  displayName: t.text("name", { length: 255 }).notNull(),
  role: t.text().$type<"user" | "admin">().notNull().default("user"),
  avatarUrl: t.text("avatar_url"),
  createdAt: t.text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: t.text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const authAccounts = sqliteTable(
  "auth_accounts",
  {
    id: t.text("id").primaryKey(),
    userId: t
      .text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: t.text().$type<"google" | "github">().notNull(),
    providerAccountId: t.text("provider_account_id").notNull(),
  },
  (table) => {
    return {
      providerAccountIdIndex: t
        .uniqueIndex("provider_account_id_idx")
        .on(table.provider, table.providerAccountId),
    };
  },
);

export const usersRelations = relations(users, ({ many }) => ({
  authAccounts: many(authAccounts),
  sessions: many(sessions, {
    relationName: "users",
  }),
}));

export const authAccountsRelations = relations(authAccounts, ({ one }) => ({
  user: one(users, {
    fields: [authAccounts.userId],
    references: [users.id],
  }),
}));

export const sessions = sqliteTable("sessions", {
  id: t.text("id").primaryKey(),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: t.text("expires_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const youtubeDetailsTable = sqliteTable(
  "youtube_details",
  {
    id: t.text("id").primaryKey(),
    videoId: t.text("video_id").notNull().unique(),
    title: t.text("title").notNull(),
    tags: t.text("tags").notNull().default("[]"),
    createdAt: t.text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => {
    return {
      videoIdIndex: t.uniqueIndex("video_id_idx").on(table.videoId),
    };
  },
);

export const watchListTable = sqliteTable(
  "watch_list",
  {
    id: t.text("id").primaryKey(),
    userId: t
      .text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    videoId: t
      .text("video_id")
      .notNull()
      .references(() => youtubeDetailsTable.videoId, { onDelete: "cascade" }),
    createdAt: t.text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => {
    return {
      uniqueUserVideo: t
        .uniqueIndex("unique_user_video")
        .on(table.userId, table.videoId),
    };
  },
);

export const watchListRelations = relations(watchListTable, ({ one }) => ({
  user: one(users, {
    fields: [watchListTable.userId],
    references: [users.id],
  }),
  video: one(youtubeDetailsTable, {
    fields: [watchListTable.videoId],
    references: [youtubeDetailsTable.videoId],
  }),
}));

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type YoutubeDetailsSchema = typeof youtubeDetailsTable.$inferSelect;
