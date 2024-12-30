import { cookies } from "next/headers";
import { cache } from "react";
import { validateSessionToken } from "./sessions";
import type { Session, User } from "./types";

export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("session")?.value ?? null;
    if (token === null) {
      return { session: null, user: null };
    }
    const result = await validateSessionToken(token);
    return result;
  },
);

type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
