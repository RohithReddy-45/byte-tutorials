import "server-only";

export interface VideoInfo {
  title: string;
  author_url: string;
  author_name: string;
}

export async function fetchVideoInfo(videoId: string): Promise<VideoInfo> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch video info: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error("No video data found");
    }

    const snippet = data.items[0].snippet;

    return {
      title: snippet.title,
      author_name: snippet.channelTitle,
      author_url: `https://www.youtube.com/channel/${snippet.channelId}`,
    };
  } catch (error) {
    console.error("Error fetching video info:", error);
    return {
      title: "",
      author_name: "",
      author_url: "",
    };
  }
}
