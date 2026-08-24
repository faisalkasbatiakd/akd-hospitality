"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { announcements } from "@/db/schema";
import { requireSession } from "@/lib/auth";
import { TAGS } from "@/lib/content";

import {
  type ActionResult,
  auditEntry,
  invalidate,
  nextSort,
  reorderRow,
} from "../_lib/crud";

const ADMIN_PATH = "/admin/announcements";

const schema = z.object({
  title: z.string().trim().min(1, "A title is required").max(300),
  /**
   * Internal paths only. The ticker sits on every page, so an editable
   * off-site link there would be an open redirect in the site's furniture.
   */
  href: z
    .string()
    .trim()
    .min(1, "A link is required")
    .max(300)
    .refine((value) => value.startsWith("/"), {
      message: "The link must be a path on this site, starting with /",
    }),
});

function parse(formData: FormData) {
  return schema.safeParse({
    title: formData.get("title"),
    href: formData.get("href"),
  });
}

export async function createAnnouncement(
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();
  const parsed = parse(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const [row] = await db
    .insert(announcements)
    .values({ ...parsed.data, sort: await nextSort(announcements) })
    .returning({ id: announcements.id });

  await auditEntry(
    "announcements",
    "create",
    String(row.id),
    `Added the notice “${parsed.data.title}”`,
  );
  invalidate(TAGS.announcements, ADMIN_PATH);
  return { ok: true };
}

export async function updateAnnouncement(
  id: number,
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();
  const parsed = parse(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const [existing] = await db
    .select({ title: announcements.title })
    .from(announcements)
    .where(eq(announcements.id, id));
  if (!existing) return { ok: false, error: "That notice no longer exists." };

  await db.update(announcements).set(parsed.data).where(eq(announcements.id, id));
  await auditEntry(
    "announcements",
    "update",
    String(id),
    `Edited the notice “${existing.title}”`,
  );
  invalidate(TAGS.announcements, ADMIN_PATH);
  return { ok: true };
}

export async function deleteAnnouncement(id: number): Promise<ActionResult> {
  await requireSession();
  const [existing] = await db
    .select({ title: announcements.title })
    .from(announcements)
    .where(eq(announcements.id, id));
  if (!existing) return { ok: false, error: "That notice no longer exists." };

  await db.delete(announcements).where(eq(announcements.id, id));
  await auditEntry(
    "announcements",
    "delete",
    String(id),
    `Removed the notice “${existing.title}”`,
  );
  invalidate(TAGS.announcements, ADMIN_PATH);
  return { ok: true };
}

export async function moveAnnouncement(
  id: number,
  direction: "up" | "down",
): Promise<ActionResult> {
  return reorderRow(announcements, id, direction, {
    entity: "announcements",
    tag: TAGS.announcements,
    adminPath: ADMIN_PATH,
    label: "a notice",
  });
}
