import { env } from "@/env";
import { GitHub, Google } from "arctic";

const googleCallbackURL =
  process.env.NODE_ENV === "production"
    ? `${env.PRODUCTION_URL}/sign-in/google/callback`
    : `${env.LOCAL_URL}/sign-in/google/callback`;

const githubCallbackURL =
  process.env.NODE_ENV === "production"
    ? `${env.PRODUCTION_URL}/sign-in/github/callback`
    : `${env.LOCAL_URL}/sign-in/github/callback`;

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID ?? "",
  process.env.GOOGLE_CLIENT_SECRET ?? "",
  googleCallbackURL,
);

export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID ?? "",
  process.env.GITHUB_CLIENT_SECRET ?? "",
  githubCallbackURL,
);
