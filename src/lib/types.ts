import { z } from "zod";
import { YT_REGEX } from "./utils";

export type YoutubeDetails = {
  id: string;
  videoId: string;
  title: string;
  tags: string;
};

export const VideoSchema = z.object({
  link: z.string().regex(YT_REGEX, { message: "Invalid YouTube URL" }),
  title: z
    .string()
    .min(5, { message: "Must be a minimum of 5 characters" })
    .max(1000, { message: "Must be a maximum of 1000 characters" }),
  tags: z.array(z.string()).min(1, { message: "Select at least one tag" }),
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
