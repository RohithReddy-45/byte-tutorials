"use server";
import { globalPOSTRateLimit } from "@/lib/request";
import {
  deleteSessionTokenCookie,
  invalidateUserSessions,
} from "@/lib/sessions";
import { getCurrentSession } from "@/lib/validate-request";
import { redirect } from "next/navigation";

export async function logoutAction(): Promise<ActionResult> {
  const rateLimit = await globalPOSTRateLimit();
  if (!rateLimit) {
    return {
      message: "Too many requests",
    };
  }
  const { session } = await getCurrentSession();
  if (session === null) {
    return {
      message: "Not authenticated",
    };
  }
  invalidateUserSessions(session.id);
  deleteSessionTokenCookie();
  return redirect("/sign-in");
}

interface ActionResult {
  message: string;
}
