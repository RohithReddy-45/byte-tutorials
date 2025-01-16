import { z } from "zod";
import { YT_REGEX } from "./utils";

export interface Tag {
  label: string;
  slug: string;
}
export type YoutubeDetails = {
  id: string;
  videoId: string;
  title: string;
  tags: Tag[];
  creator: string;
  creatorUrl: string;
};

export const VideoSchema = z.object({
  link: z.string().regex(YT_REGEX, { message: "Invalid YouTube URL" }),
  title: z.string().optional(),
  tags: z
    .array(z.object({ label: z.string(), slug: z.string() }))
    .min(1, { message: "At least one tag is required" }),
});

export type YoutubeValues = z.infer<typeof VideoSchema>;

export interface BookmarkState {
  bookmarks: Set<string>;
  toggleBookmark: (videoId: string, userId: string) => void;
  setInitialBookmarks: (bookmarks: string[]) => void;
}

type Role = "user" | "admin";

export interface User {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  role: Role;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
}

export interface SessionContextProps {
  user: User;
  session: Session;
}

export const videoValidationSchema = z.object({
  videoId: z.string().min(1, "Video ID is required"),
  title: z.string().min(1, "Title is required"),
  tags: z.array(z.string()).default([]),
});
