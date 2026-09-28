"use server";

import { unlink } from "node:fs/promises";
import { join } from "node:path";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { auditLog, documents } from "@/db/schema";
import { requireSession } from "@/lib/auth";
import { TAGS } from "@/lib/content";
import { isLegacyKey } from "@/lib/storage";

/**
 * Every action re-checks the session. Middleware guards navigation, not server
 * actions, which are reachable by anyone who can POST to their endpoint.
 */


export type ActionResult = { ok: true } | { ok: false; error: string };

async function record(
  actorEmail: string,
  action: string,
  entityId: string | null,
  summary: string,
) {
  await db.insert(auditLog).values({
    actorEmail,
    action,
    entity: "documents",
    entityId,
    summary,
  });
}

/**
 * Refreshes the dashboard list and drops the cached document reads the public
 * pages use. The tag is what actually matters: the reader in lib/content.ts is
 * cached under it, so busting the tag is what makes an edit visible on the site.
 */
function refresh() {
  // updateTag rather than revalidateTag: this runs inside a server action,
  // and the editor should see their own change on the next read.
  updateTag(TAGS.documents);
  revalidatePath("/admin/documents");
}

const titleSchema = z.string().trim().min(1, "A title is required").max(300);

/*
 * Uploading a filing is not here. It is a route handler, at
 * src/app/api/admin/documents/route.ts, because Next's server-action parser
 * truncates a multipart body a little under 10 MB and the annual report is
 * 12 MB. That file explains the measurement.
 */

export async function renameDocument(
  id: number,
  title: string,
): Promise<ActionResult> {
  const session = await requireSession();
  const parsed = titleSchema.safeParse(title);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const [existing] = await db
    .select({ title: documents.title })
    .from(documents)
    .where(eq(documents.id, id));
  if (!existing) return { ok: false, error: "That document no longer exists." };

  await db
    .update(documents)
    .set({ title: parsed.data })
    .where(eq(documents.id, id));

  await record(
    session.email,
    "update",
    String(id),
    `Renamed “${existing.title}” to “${parsed.data}”`,
  );
  refresh();
  return { ok: true };
}

export async function deleteDocument(id: number): Promise<ActionResult> {
  const session = await requireSession();

  const [existing] = await db
    .select({ title: documents.title, path: documents.path })
    .from(documents)
    .where(eq(documents.id, id));
  if (!existing) return { ok: false, error: "That document no longer exists." };

  await db.delete(documents).where(eq(documents.id, id));

  /**
   * Only uploads are removed from disk. The 110 legacy filings live in
   * public/documents and are committed to the repository: unpublishing one
   * should not delete a file that git is tracking.
   */
  if (!isLegacyKey(existing.path)) {
    try {
      await unlink(join(process.cwd(), "storage", existing.path));
    } catch (error) {
      // The row is already gone; a missing file is not worth failing over.
      console.warn("Could not remove the stored file:", error);
    }
  }

  await record(
    session.email,
    "delete",
    String(id),
    `Removed “${existing.title}”`,
  );
  refresh();
  return { ok: true };
}

/** Moves a document one place up or down within its group. */
export async function moveDocument(
  id: number,
  direction: "up" | "down",
): Promise<ActionResult> {
  const session = await requireSession();

  const [current] = await db
    .select({
      title: documents.title,
      sort: documents.sort,
      groupKey: documents.groupKey,
    })
    .from(documents)
    .where(eq(documents.id, id));
  if (!current) return { ok: false, error: "That document no longer exists." };

  const ordered = await db
    .select({ id: documents.id, sort: documents.sort })
    .from(documents)
    .where(eq(documents.groupKey, current.groupKey))
    .orderBy(documents.sort, documents.id);

  const index = ordered.findIndex((row) => row.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= ordered.length) return { ok: true };

  // Rewrite the whole group's sort values: the seeded ones are not contiguous,
  // so swapping two numbers is not enough to guarantee a stable order.
  const reordered = [...ordered];
  [reordered[index], reordered[swapWith]] = [
    reordered[swapWith],
    reordered[index],
  ];
  await Promise.all(
    reordered.map((row, position) =>
      db.update(documents).set({ sort: position }).where(eq(documents.id, row.id)),
    ),
  );

  await record(
    session.email,
    "reorder",
    String(id),
    `Moved “${current.title}” ${direction}`,
  );
  refresh();
  return { ok: true };
}

/** Used by the group tabs to show counts without loading every row. */
export async function countInGroup(groupKey: string) {
  await requireSession();
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(documents)
    .where(and(eq(documents.groupKey, groupKey)));
  return row?.n ?? 0;
}
