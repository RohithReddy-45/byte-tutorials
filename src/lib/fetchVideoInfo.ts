import { env } from "@/env";

export interface VideoInfo {
  title: string;
  author_url: string;
  author_name: string;
}

export async function fetchVideoInfo(videoId: string): Promise<VideoInfo> {
  const response = await fetch(`${env.VIDEO_INFO_URL}?v=${videoId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch video info");
  }
  const data = await response.json();
  return data;
}
