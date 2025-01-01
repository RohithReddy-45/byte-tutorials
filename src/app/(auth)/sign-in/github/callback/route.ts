import { cookies } from "next/headers";
import { ObjectParser } from "@pilcrowjs/object-parser";

import type { OAuth2Tokens } from "arctic";
import { globalGETRateLimit } from "@/lib/request";
import { github } from "@/lib/oauth";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/sessions";
import { createUser, getUserFromGithubId } from "@/lib/user";

export async function GET(request: Request): Promise<Response> {
  const cookieStore = await cookies();
  const rateLimit = await globalGETRateLimit();
  if (!rateLimit) {
    return new Response("Too many requests", {
      status: 429,
    });
  }
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookieStore.get("github_oauth_state")?.value ?? null;
  if (code === null || state === null || storedState === null) {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }
  if (state !== storedState) {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await github.validateAuthorizationCode(code);
  } catch {
    // Invalid code or client credentials
    return new Response("Please restart the process.", {
      status: 400,
    });
  }
  const githubAccessToken = tokens.accessToken();

  const userRequest = new Request("https://api.github.com/user");
  userRequest.headers.set("Authorization", `Bearer ${githubAccessToken}`);
  const userResponse = await fetch(userRequest);
  const userResult: unknown = await userResponse.json();
  const userParser = new ObjectParser(userResult);

  const githubUserId = userParser.getNumber("id");
  const displayName = userParser.getString("login");
  const avatarUrl = userParser.getString("avatar_url");

  const existingUser = await getUserFromGithubId(String(githubUserId));
  if (existingUser !== null) {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    setSessionTokenCookie(sessionToken, session.expiresAt);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  }

  const emailListRequest = new Request("https://api.github.com/user/emails");
  emailListRequest.headers.set("Authorization", `Bearer ${githubAccessToken}`);
  const emailListResponse = await fetch(emailListRequest);
  const emailListResult: unknown = await emailListResponse.json();
  if (!Array.isArray(emailListResult) || emailListResult.length < 1) {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }
  let email: string | null = null;
  for (const emailRecord of emailListResult) {
    const emailParser = new ObjectParser(emailRecord);
    const primaryEmail = emailParser.getBoolean("primary");
    const verifiedEmail = emailParser.getBoolean("verified");
    if (primaryEmail && verifiedEmail) {
      email = emailParser.getString("email");
    }
  }
  if (email === null) {
    return new Response("Please verify your GitHub email address.", {
      status: 400,
    });
  }

  const { success, userId, error } = await createUser({
    provider: "github",
    providerId: String(githubUserId),
    email,
    displayName,
    avatarUrl,
  });

  if (error || !success || !userId) {
    const errorMessage = error || "Unknown error occurred";
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/sign-in?error=${encodeURIComponent(errorMessage)}`,
      },
    });
  }

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, userId);
  setSessionTokenCookie(sessionToken, session.expiresAt);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
}
