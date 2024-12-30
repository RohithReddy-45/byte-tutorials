import { github } from "@/lib/oauth";
import { globalGETRateLimit } from "@/lib/request";
import { generateState } from "arctic";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
  const cookieStore = await cookies();
  const rateLimit = await globalGETRateLimit();
  if (!rateLimit) {
    return new Response("Too many requests", {
      status: 429,
    });
  }
  const state = generateState();
  const url = github.createAuthorizationURL(state, ["user:email"]);

  cookieStore.set("github_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
}
