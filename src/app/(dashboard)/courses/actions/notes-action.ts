"use server";

import { db } from "@/db/database";
import { videoNotesTable } from "@/db/schema";
import { getCurrentSession } from "@/lib/validate-request";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { revalidatePath } from "next/cache";

const noteTextSchema = z.string().min(1).max(5000);
const timestampSchema = z.number().int().min(0);

export async function getVideoNotes(videoId: string) {
  const { session } = await getCurrentSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const notes = await db
      .select()
      .from(videoNotesTable)
      .where(
        and(
          eq(videoNotesTable.userId, session.userId),
          eq(videoNotesTable.videoId, videoId)
        )
      )
      .orderBy(videoNotesTable.timestamp);
    return { success: true, data: notes };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch notes",
    };
  }
}

export async function addVideoNote(
  videoId: string,
  noteText: string,
  timestamp: number
) {
  const { session } = await getCurrentSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const text = noteTextSchema.parse(noteText);
    const ts = timestampSchema.parse(timestamp);

    const newNote = {
      id: uuidv4(),
      userId: session.userId,
      videoId,
      noteText: text,
      timestamp: ts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.insert(videoNotesTable).values(newNote);
    revalidatePath("/courses/analytics");
    return { success: true, data: newNote };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add note",
    };
  }
}

export async function deleteVideoNote(noteId: string) {
  const { session } = await getCurrentSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    await db
      .delete(videoNotesTable)
      .where(
        and(
          eq(videoNotesTable.id, noteId),
          eq(videoNotesTable.userId, session.userId)
        )
      );
    revalidatePath("/courses/analytics");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete note",
    };
  }
}
