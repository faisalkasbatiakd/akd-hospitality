/**
 * Server-only helpers. Deliberately NOT a "use server" module: these are
 * building blocks called by the action files, not actions themselves, and that
 * directive would require every export to be an async function - which
 * invalidate() is not.
 */
import { asc, eq, sql } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import type { PgTable } from "drizzle-orm/pg-core";

import { db } from "@/db";
import { auditLog } from "@/db/schema";
import { requireSession } from "@/lib/auth";

/**
 * Shared plumbing for the simple ordered lists in the dashboard -
 * announcements, milestones, officers, ESG entries and so on.
 *
 * They differ only in their columns, so the create / update / delete / reorder
 * behaviour, the audit entry and the cache invalidation live here once rather
 * than being copied per page. Anything with real rules of its own (documents,
 * with a file on disk) keeps its own actions.
 */

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Minimum shape a table must have to be managed here. */
type OrderedTable = PgTable & {
  id: { name: string };
  sort: { name: string };
};

export async function auditEntry(
  entity: string,
  action: string,
  entityId: string | null,
  summary: string,
) {
  const session = await requireSession();
  await db
    .insert(auditLog)
    .values({ actorEmail: session.email, action, entity, entityId, summary });
}

export function invalidate(tag: string, adminPath: string) {
  updateTag(tag);
  revalidatePath(adminPath);
}

/**
 * Moves a row one place within its list.
 *
 * The whole list is renumbered rather than two values swapped: seeded sort
 * values are not contiguous, so a swap alone cannot guarantee a stable order.
 */
export async function reorderRow(
  table: OrderedTable,
  id: number,
  direction: "up" | "down",
  opts: { entity: string; tag: string; adminPath: string; label?: string },
): Promise<ActionResult> {
  await requireSession();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = table as any;
  const rows: { id: number }[] = await db
    .select({ id: t.id })
    .from(table)
    .orderBy(asc(t.sort), asc(t.id));

  const index = rows.findIndex((row) => row.id === id);
  if (index === -1) return { ok: false, error: "That item no longer exists." };
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= rows.length) return { ok: true };

  const reordered = [...rows];
  [reordered[index], reordered[swapWith]] = [
    reordered[swapWith],
    reordered[index],
  ];
  await Promise.all(
    reordered.map((row, position) =>
      db.update(table).set({ sort: position }).where(eq(t.id, row.id)),
    ),
  );

  await auditEntry(
    opts.entity,
    "reorder",
    String(id),
    `Moved ${opts.label ?? "an item"} ${direction}`,
  );
  invalidate(opts.tag, opts.adminPath);
  return { ok: true };
}

/** Sort value that places a new row at the end of its list. */
export async function nextSort(table: OrderedTable) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = table as any;
  const [row] = await db
    .select({ max: sql<number>`coalesce(max(${t.sort}), -1)` })
    .from(table);
  return (row?.max ?? -1) + 1;
}
