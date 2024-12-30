"use server";

import { getCurrentSession } from "@/lib/validate-request";
import { revalidatePath } from "next/cache";
import { globalPOSTRateLimit } from "@/lib/request";
import { saveYoutubeDetails } from "@/lib/queries";
import { VideoSchema, type YoutubeValues } from "@/lib/types";

export async function adminFormAction(formData: YoutubeValues) {
  const rateLimit = await globalPOSTRateLimit();
  if (!rateLimit) {
    throw new Error("Too many requests. Please try again later.");
  }
  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }
  if (user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    const { link, title, tags } = VideoSchema.parse(formData);
    console.log("Saving video details", { link, title, tags });

    const videoId = link.split("v=")[1];
    const tagsString = tags.join(",");

    const result = await saveYoutubeDetails(videoId, title, tagsString);
    console.log("action result", result);
    if (result.error) {
      throw new Error(result.error);
    }
    revalidatePath("/courses");
    return {
      success: result.success,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
