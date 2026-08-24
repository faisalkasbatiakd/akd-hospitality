"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { milestones } from "@/db/schema";
import { requireSession } from "@/lib/auth";
import { TAGS } from "@/lib/content";

import {
  type ActionResult,
  auditEntry,
  invalidate,
  nextSort,
  reorderRow,
} from "../_lib/crud";

const ADMIN_PATH = "/admin/milestones";

const schema = z.object({
  year: z.string().trim().min(1, "A year is required").max(20),
  title: z.string().trim().min(1, "A title is required").max(200),
  description: z.string().trim().min(1, "A description is required").max(1000),
});

const parse = (formData: FormData) =>
  schema.safeParse({
    year: formData.get("year"),
    title: formData.get("title"),
    description: formData.get("description"),
  });

export async function createMilestone(formData: FormData): Promise<ActionResult> {
  await requireSession();
  const parsed = parse(formData);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const [row] = await db
    .insert(milestones)
    .values({ ...parsed.data, sort: await nextSort(milestones) })
    .returning({ id: milestones.id });

  await auditEntry(
    "milestones",
    "create",
    String(row.id),
    `Added the milestone “${parsed.data.year} — ${parsed.data.title}”`,
  );
  invalidate(TAGS.milestones, ADMIN_PATH);
  return { ok: true };
}

export async function updateMilestone(
  id: number,
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();
  const parsed = parse(formData);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const [existing] = await db
    .select({ title: milestones.title })
    .from(milestones)
    .where(eq(milestones.id, id));
  if (!existing) return { ok: false, error: "That milestone no longer exists." };

  await db.update(milestones).set(parsed.data).where(eq(milestones.id, id));
  await auditEntry(
    "milestones",
    "update",
    String(id),
    `Edited the milestone “${existing.title}”`,
  );
  invalidate(TAGS.milestones, ADMIN_PATH);
  return { ok: true };
}

export async function deleteMilestone(id: number): Promise<ActionResult> {
  await requireSession();
  const [existing] = await db
    .select({ title: milestones.title })
    .from(milestones)
    .where(eq(milestones.id, id));
  if (!existing) return { ok: false, error: "That milestone no longer exists." };

  await db.delete(milestones).where(eq(milestones.id, id));
  await auditEntry(
    "milestones",
    "delete",
    String(id),
    `Removed the milestone “${existing.title}”`,
  );
  invalidate(TAGS.milestones, ADMIN_PATH);
  return { ok: true };
}

export async function moveMilestone(
  id: number,
  direction: "up" | "down",
): Promise<ActionResult> {
  return reorderRow(milestones, id, direction, {
    entity: "milestones",
    tag: TAGS.milestones,
    adminPath: ADMIN_PATH,
    label: "a milestone",
  });
}
