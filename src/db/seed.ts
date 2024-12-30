import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import fs from "node:fs/promises";
import path from "node:path";
import { env } from "@/env";
import { youtubeDetailsTable } from "./schema";

async function main() {
  const client = createClient({
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });

  const db = drizzle(client);

  const filePath = path.resolve(__dirname, "data.json");
  const fileContent = await fs.readFile(filePath, "utf-8");
  const youtubeDetailsData = JSON.parse(fileContent);

  try {
    for (const data of youtubeDetailsData) {
      if (data.video_id) {
        await db.insert(youtubeDetailsTable).values({
          id: data.id,
          videoId: data.video_id,
          title: data.title,
          tags: data.tags,
          createdAt: data.created_at,
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
