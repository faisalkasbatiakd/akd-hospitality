"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import {
  committeeMembers,
  committees,
  directors,
  officers,
} from "@/db/schema";
import { requireSession } from "@/lib/auth";
import { TAGS } from "@/lib/content";
import { removeUpload, storeImage } from "@/lib/upload";

import {
  type ActionResult,
  auditEntry,
  invalidate,
  nextSort,
  reorderRow,
} from "../_lib/crud";

const ADMIN_PATH = "/admin/board";
const bust = () => invalidate(TAGS.governance, ADMIN_PATH);

/* ------------------------------------------------------------- directors */

const directorSchema = z.object({
  name: z.string().trim().min(1, "A name is required").max(200),
  role: z.string().trim().min(1, "A role is required").max(200),
  category: z.string().trim().max(60).optional(),
  bio: z.string().trim().max(4000).optional(),
});

const parseDirector = (formData: FormData) =>
  directorSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    category: formData.get("category") ?? undefined,
    bio: formData.get("bio") ?? undefined,
  });

export async function createDirector(
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();
  const parsed = parseDirector(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  // A photograph is optional. The site renders initials when there is none,
  // rather than a stock portrait standing in for a named person.
  let imagePath: string | null = null;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    const stored = await storeImage(file);
    if (!stored.ok) return { ok: false, error: stored.error };
    imagePath = stored.key;
  }

  const [row] = await db
    .insert(directors)
    .values({
      name: parsed.data.name,
      role: parsed.data.role,
      category: parsed.data.category || null,
      bio: parsed.data.bio || null,
      imagePath,
      sort: await nextSort(directors),
    })
    .returning({ id: directors.id });

  await auditEntry(
    "directors",
    "create",
    String(row.id),
    `Added ${parsed.data.name} to the Board`,
  );
  bust();
  return { ok: true };
}

export async function updateDirector(
  id: number,
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();
  const parsed = parseDirector(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const [existing] = await db
    .select({ name: directors.name, imagePath: directors.imagePath })
    .from(directors)
    .where(eq(directors.id, id));
  if (!existing) return { ok: false, error: "That director no longer exists." };

  let imagePath = existing.imagePath;

  // An empty file input means "leave the photograph alone", not "remove it" -
  // removal is a separate, explicit action.
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    const stored = await storeImage(file);
    if (!stored.ok) return { ok: false, error: stored.error };
    await removeUpload(existing.imagePath);
    imagePath = stored.key;
  }

  await db
    .update(directors)
    .set({
      name: parsed.data.name,
      role: parsed.data.role,
      category: parsed.data.category || null,
      bio: parsed.data.bio || null,
      imagePath,
    })
    .where(eq(directors.id, id));

  await auditEntry(
    "directors",
    "update",
    String(id),
    `Edited ${existing.name}`,
  );
  bust();
  return { ok: true };
}

export async function removeDirectorImage(id: number): Promise<ActionResult> {
  await requireSession();
  const [existing] = await db
    .select({ name: directors.name, imagePath: directors.imagePath })
    .from(directors)
    .where(eq(directors.id, id));
  if (!existing) return { ok: false, error: "That director no longer exists." };
  if (!existing.imagePath) return { ok: true };

  await db.update(directors).set({ imagePath: null }).where(eq(directors.id, id));
  await removeUpload(existing.imagePath);

  await auditEntry(
    "directors",
    "update",
    String(id),
    `Removed the photograph of ${existing.name}`,
  );
  bust();
  return { ok: true };
}

export async function deleteDirector(id: number): Promise<ActionResult> {
  await requireSession();
  const [existing] = await db
    .select({ name: directors.name, imagePath: directors.imagePath })
    .from(directors)
    .where(eq(directors.id, id));
  if (!existing) return { ok: false, error: "That director no longer exists." };

  await db.delete(directors).where(eq(directors.id, id));
  await removeUpload(existing.imagePath);

  await auditEntry(
    "directors",
    "delete",
    String(id),
    `Removed ${existing.name} from the Board`,
  );
  bust();
  return { ok: true };
}

export async function moveDirector(
  id: number,
  direction: "up" | "down",
): Promise<ActionResult> {
  return reorderRow(directors, id, direction, {
    entity: "directors",
    tag: TAGS.governance,
    adminPath: ADMIN_PATH,
    label: "a director",
  });
}

/* -------------------------------------------------------------- officers */

const officerSchema = z.object({
  name: z.string().trim().min(1, "A name is required").max(200),
  role: z.string().trim().min(1, "A role is required").max(200),
});

const parseOfficer = (formData: FormData) =>
  officerSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
  });

export async function createOfficer(formData: FormData): Promise<ActionResult> {
  await requireSession();
  const parsed = parseOfficer(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  const [row] = await db
    .insert(officers)
    .values({ ...parsed.data, sort: await nextSort(officers) })
    .returning({ id: officers.id });
  await auditEntry(
    "officers",
    "create",
    String(row.id),
    `Added the officer ${parsed.data.name}`,
  );
  bust();
  return { ok: true };
}

export async function updateOfficer(
  id: number,
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();
  const parsed = parseOfficer(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  const [existing] = await db
    .select({ name: officers.name })
    .from(officers)
    .where(eq(officers.id, id));
  if (!existing) return { ok: false, error: "That officer no longer exists." };

  await db.update(officers).set(parsed.data).where(eq(officers.id, id));
  await auditEntry("officers", "update", String(id), `Edited ${existing.name}`);
  bust();
  return { ok: true };
}

export async function deleteOfficer(id: number): Promise<ActionResult> {
  await requireSession();
  const [existing] = await db
    .select({ name: officers.name })
    .from(officers)
    .where(eq(officers.id, id));
  if (!existing) return { ok: false, error: "That officer no longer exists." };

  await db.delete(officers).where(eq(officers.id, id));
  await auditEntry(
    "officers",
    "delete",
    String(id),
    `Removed the officer ${existing.name}`,
  );
  bust();
  return { ok: true };
}

export async function moveOfficer(
  id: number,
  direction: "up" | "down",
): Promise<ActionResult> {
  return reorderRow(officers, id, direction, {
    entity: "officers",
    tag: TAGS.governance,
    adminPath: ADMIN_PATH,
    label: "an officer",
  });
}

/* ------------------------------------------------------------ committees */

const memberSchema = z.object({
  committeeId: z.coerce.number().int().positive(),
  name: z.string().trim().min(1, "A name is required").max(200),
  role: z.string().trim().min(1, "A role is required").max(80),
  designation: z.string().trim().max(40).optional(),
  note: z.string().trim().max(200).optional(),
});

export async function createCommitteeMember(
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();
  const parsed = memberSchema.safeParse({
    committeeId: formData.get("committeeId"),
    name: formData.get("name"),
    role: formData.get("role"),
    designation: formData.get("designation") ?? undefined,
    note: formData.get("note") ?? undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const [committee] = await db
    .select({ title: committees.title })
    .from(committees)
    .where(eq(committees.id, parsed.data.committeeId));
  if (!committee) return { ok: false, error: "That committee no longer exists." };

  const existing = await db
    .select({ sort: committeeMembers.sort })
    .from(committeeMembers)
    .where(eq(committeeMembers.committeeId, parsed.data.committeeId));

  await db.insert(committeeMembers).values({
    committeeId: parsed.data.committeeId,
    name: parsed.data.name,
    role: parsed.data.role,
    designation: parsed.data.designation || null,
    note: parsed.data.note || null,
    sort: existing.length,
  });

  await auditEntry(
    "committee_members",
    "create",
    String(parsed.data.committeeId),
    `Added ${parsed.data.name} to the ${committee.title}`,
  );
  bust();
  return { ok: true };
}

export async function deleteCommitteeMember(
  id: number,
): Promise<ActionResult> {
  await requireSession();
  const [existing] = await db
    .select({ name: committeeMembers.name })
    .from(committeeMembers)
    .where(eq(committeeMembers.id, id));
  if (!existing) return { ok: false, error: "That member no longer exists." };

  await db.delete(committeeMembers).where(eq(committeeMembers.id, id));
  await auditEntry(
    "committee_members",
    "delete",
    String(id),
    `Removed ${existing.name} from a committee`,
  );
  bust();
  return { ok: true };
}

export async function renameCommittee(
  id: number,
  title: string,
): Promise<ActionResult> {
  await requireSession();
  const parsed = z
    .string()
    .trim()
    .min(1, "A title is required")
    .max(200)
    .safeParse(title);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const [existing] = await db
    .select({ title: committees.title })
    .from(committees)
    .where(eq(committees.id, id));
  if (!existing) return { ok: false, error: "That committee no longer exists." };

  await db
    .update(committees)
    .set({ title: parsed.data })
    .where(eq(committees.id, id));
  await auditEntry(
    "committees",
    "update",
    String(id),
    `Renamed “${existing.title}” to “${parsed.data}”`,
  );
  bust();
  return { ok: true };
}
