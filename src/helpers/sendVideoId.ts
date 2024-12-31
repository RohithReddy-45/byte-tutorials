import "server-only";

export async function sendVideoId(link: string, title: string, tags: string[]) {
  const videoId = link.split("v=")[1];
  if (!videoId) {
    throw new Error("Invalid video link");
  }
  try {
    const response = await fetch("/api/yt-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.JWT_SECRET}`,
      },
      body: JSON.stringify({ videoId, title, tags }),
    });

    if (!response.ok) {
      throw new Error("Failed to send video ID");
    }
  } catch (error) {
    console.error("Error sending video ID:", error);
    throw new Error("Something went wrong");
  }
}
