import { saveYoutubeDetails } from "@/lib/queries";
import { videoValidationSchema } from "@/lib/types";
import { getCurrentSession } from "@/lib/validate-request";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { user } = await getCurrentSession();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = videoValidationSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          error: "Invalid request data",
          details: result.error.issues,
        },
        { status: 400 },
      );
    }
    const { videoId, title, tags } = result.data;

    if (!videoId) {
      return Response.json({ error: "Invalid videoId" }, { status: 400 });
    }

    if (!title) {
      return Response.json({ error: "Invalid title" }, { status: 400 });
    }

    if (!tags || tags.length === 0) {
      return Response.json({ error: "Invalid tags" }, { status: 400 });
    }

    await saveYoutubeDetails(videoId, title, tags.join(","));

    return NextResponse.json(
      { message: "Video details saved successfully" },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error instanceof SyntaxError) {
        return Response.json({ error: "Invalid JSON" }, { status: 400 });
      }
      return Response.json(
        { error: error.message },
        {
          status: error.message === "Video already exists" ? 400 : 500,
        },
      );
    }
    return Response.json(
      { error: "An unknown error occurred" },
      { status: 500 },
    );
  }
}
