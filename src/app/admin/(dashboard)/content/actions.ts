"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { requireSession } from "@/lib/auth";

import {
  type ActionResult,
  auditEntry,
  invalidate,
  nextSort,
  reorderRow,
} from "../_lib/crud";
import { LISTS, type ListKey } from "./lists";

const ADMIN_PATH = "/admin/content";

/**
 * One set of actions for every ordered content list, bound to a list key by the
 * page. Eight tables that differ only in their columns do not need eight copies
 * of the same create/update/delete/reorder.
 */

function parse(key: ListKey, formData: FormData) {
  const config = LISTS[key];
  const raw: Record<string, unknown> = {};
  for (const field of config.fields) {
    raw[field.name] = String(formData.get(field.name) ?? "");
  }
  return config.schema.safeParse(raw);
}

/** A short, readable name for the row, for the audit trail. */
function describe(key: ListKey, row: Record<string, unknown>) {
  const value = row[LISTS[key].primaryField];
  const text = Array.isArray(value) ? value.join(", ") : String(value ?? "");
  return text.length > 60 ? `${text.slice(0, 57)}…` : text;
}

export async function createItem(
  key: ListKey,
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();
  const config = LISTS[key];
  const parsed = parse(key, formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const [row] = await db
    .insert(config.table)
    .values({ ...parsed.data, sort: await nextSort(config.table) })
    .returning({ id: config.table.id });

  await auditEntry(
    key,
    "create",
    String(row.id),
    `Added the ${config.noun} “${describe(key, parsed.data)}”`,
  );
  invalidate(config.tag, ADMIN_PATH);
  return { ok: true };
}

export async function updateItem(
  key: ListKey,
  id: number,
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();
  const config = LISTS[key];
  const parsed = parse(key, formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const [existing] = await db
    .select()
    .from(config.table)
    .where(eq(config.table.id, id));
  if (!existing) return { ok: false, error: `That ${config.noun} no longer exists.` };

  await db.update(config.table).set(parsed.data).where(eq(config.table.id, id));
  await auditEntry(
    key,
    "update",
    String(id),
    `Edited the ${config.noun} “${describe(key, parsed.data)}”`,
  );
  invalidate(config.tag, ADMIN_PATH);
  return { ok: true };
}

export async function deleteItem(key: ListKey, id: number): Promise<ActionResult> {
  await requireSession();
  const config = LISTS[key];

  const [existing] = await db
    .select()
    .from(config.table)
    .where(eq(config.table.id, id));
  if (!existing) return { ok: false, error: `That ${config.noun} no longer exists.` };

  await db.delete(config.table).where(eq(config.table.id, id));
  await auditEntry(
    key,
    "delete",
    String(id),
    `Removed the ${config.noun} “${describe(key, existing as Record<string, unknown>)}”`,
  );
  invalidate(config.tag, ADMIN_PATH);
  return { ok: true };
}

export async function moveItem(
  key: ListKey,
  id: number,
  direction: "up" | "down",
): Promise<ActionResult> {
  await requireSession();
  const config = LISTS[key];
  // reorderRow writes its own audit entry and clears the cache.
  return reorderRow(config.table, id, direction, {
    entity: key,
    tag: config.tag,
    adminPath: ADMIN_PATH,
    label: `a ${config.noun}`,
  });
}
