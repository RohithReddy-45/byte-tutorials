import "server-only";
import { db } from "@/db/database";
import { authAccounts, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { User } from "./types";

type CreateUserResponse = {
  success: boolean;
  userId?: string;
  error?: string;
};

export async function createUser({
  provider,
  providerId,
  email,
  displayName,
  avatarUrl,
}: {
  provider: "google" | "github";
  providerId: string;
  email: string;
  displayName: string;
  avatarUrl: string;
}): Promise<CreateUserResponse> {
  try {
    const result = await db.transaction(async (tx) => {
      const existingUser = await tx
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        throw new Error("User already exists with same email.");
      }

      const [newUser] = await tx
        .insert(users)
        .values({
          id: crypto.randomUUID(),
          email,
          displayName,
          avatarUrl,
          role: "user",
        })
        .returning({ id: users.id });

      await tx.insert(authAccounts).values({
        id: crypto.randomUUID(),
        userId: newUser.id,
        provider,
        providerAccountId: providerId,
      });
      return newUser.id;
    });

    return { success: true, userId: result };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    console.error(error);
    throw new Error("Failed to create user");
  }
}

export async function getUserFromGoogleId(
  googleId: string,
): Promise<User | null> {
  const user = await db
    .select({
      id: users.id,
      displayName: users.displayName,
      email: users.email,
      avatarUrl: users.avatarUrl,
      role: users.role,
      authAccounts: {
        provider: authAccounts.provider,
        providerAccountId: authAccounts.providerAccountId,
      },
    })
    .from(users)
    .leftJoin(authAccounts, eq(users.id, authAccounts.userId))
    .where(
      eq(authAccounts.provider, "google") &&
        eq(authAccounts.providerAccountId, googleId),
    )
    .limit(1);

  return user[0] || null;
}

export async function getUserFromGithubId(
  githubId: string,
): Promise<User | null> {
  const user = await db
    .select({
      id: users.id,
      displayName: users.displayName,
      email: users.email,
      avatarUrl: users.avatarUrl,
      role: users.role,
      authAccounts: {
        provider: authAccounts.provider,
        providerAccountId: authAccounts.providerAccountId,
      },
    })
    .from(users)
    .leftJoin(authAccounts, eq(users.id, authAccounts.userId))
    .where(
      eq(authAccounts.provider, "github") &&
        eq(authAccounts.providerAccountId, githubId),
    )
    .limit(1);

  return user[0] || null;
}
