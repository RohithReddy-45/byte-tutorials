import { drizzle } from "drizzle-orm/libsql";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@libsql/client";
import fs from "node:fs/promises";
import path from "node:path";
import { env } from "@/env";
import { youtubeDetailsTable } from "./schema";
import { fetchVideoInfo } from "@/lib/fetchVideoInfo";

async function main() {
  const client = createClient({
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });

  const db = drizzle(client);

  const filePath = path.resolve(__dirname, "data2.json");
  const fileContent = await fs.readFile(filePath, "utf-8");
  const youtubeDetailsData = JSON.parse(fileContent);

  try {
    for (const data of youtubeDetailsData) {
      const videoId = data.link.split("v=")[1].split("&")[0];

      const { title, author_name, author_url } = await fetchVideoInfo(videoId);
      if (!title || !author_url || !author_name) {
        throw new Error("Failed to fetch video info");
      }
      if (videoId) {
        await db.insert(youtubeDetailsTable).values({
          id: uuidv4(),
          videoId,
          title,
          tags: data.tags,
          creator: author_name,
          creatorUrl: author_url,
          createdAt: new Date().toISOString(),
        });

        console.log("Database seeding completed.");
      } else {
        console.warn("Skipping entry due to missing videoId:", data);
      }
    }
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
}

main();
