"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { heroSlides, images } from "@/db/schema";
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

const ADMIN_PATH = "/admin/images";

/**
 * Images feed the heroes, the section media and the home carousel, so a change
 * has to drop both the image cache and the page cache - a hero is rendered
 * inside a page that was cached under the page tag.
 */
function bust() {
  invalidate(TAGS.images, ADMIN_PATH);
  invalidate(TAGS.page, ADMIN_PATH);
}

const altSchema = z
  .string()
  .trim()
  .min(1, "Alt text is required — it is what a screen reader announces")
  .max(400);

/** Replaces the file behind a keyed image, keeping the key stable. */
export async function replaceImage(
  key: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();

  const [existing] = await db.select().from(images).where(eq(images.key, key));
  if (!existing) return { ok: false, error: "That image slot no longer exists." };

  const stored = await storeImage(formData.get("image"));
  if (!stored.ok) return { ok: false, error: stored.error };

  const previous = existing.path;
  await db
    .update(images)
    .set({ path: stored.key, updatedAt: new Date() })
    .where(eq(images.key, key));

  // Seeded values are remote Unsplash URLs with nothing on disk to remove;
  // removeUpload already ignores those.
  await removeUpload(previous);

  await auditEntry("images", "upload", key, `Replaced the image “${key}”`);
  bust();
  return { ok: true };
}

export async function updateImageAlt(
  key: string,
  alt: string,
): Promise<ActionResult> {
  await requireSession();
  const parsed = altSchema.safeParse(alt);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const [existing] = await db.select().from(images).where(eq(images.key, key));
  if (!existing) return { ok: false, error: "That image slot no longer exists." };

  await db
    .update(images)
    .set({ alt: parsed.data, updatedAt: new Date() })
    .where(eq(images.key, key));

  await auditEntry("images", "update", key, `Edited the alt text for “${key}”`);
  bust();
  return { ok: true };
}

/* ----------------------------------------------------------- hero slides */

export async function addHeroSlide(formData: FormData): Promise<ActionResult> {
  await requireSession();

  const parsedAlt = altSchema.safeParse(formData.get("alt"));
  if (!parsedAlt.success) {
    return { ok: false, error: parsedAlt.error.issues[0].message };
  }

  const stored = await storeImage(formData.get("image"));
  if (!stored.ok) return { ok: false, error: stored.error };

  const credit = String(formData.get("credit") ?? "").trim();
  const [row] = await db
    .insert(heroSlides)
    .values({
      path: stored.key,
      alt: parsedAlt.data,
      credit: credit || null,
      sort: await nextSort(heroSlides),
    })
    .returning({ id: heroSlides.id });

  await auditEntry(
    "hero_slides",
    "create",
    String(row.id),
    "Added a home page hero slide",
  );
  bust();
  return { ok: true };
}

export async function updateHeroSlide(
  id: number,
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();

  const parsedAlt = altSchema.safeParse(formData.get("alt"));
  if (!parsedAlt.success) {
    return { ok: false, error: parsedAlt.error.issues[0].message };
  }

  const [existing] = await db
    .select()
    .from(heroSlides)
    .where(eq(heroSlides.id, id));
  if (!existing) return { ok: false, error: "That slide no longer exists." };

  let path = existing.path;
  const file = formData.get("image");
  // An empty file input keeps the current photograph; replacing is explicit.
  if (file instanceof File && file.size > 0) {
    const stored = await storeImage(file);
    if (!stored.ok) return { ok: false, error: stored.error };
    await removeUpload(existing.path);
    path = stored.key;
  }

  const credit = String(formData.get("credit") ?? "").trim();
  await db
    .update(heroSlides)
    .set({ path, alt: parsedAlt.data, credit: credit || null })
    .where(eq(heroSlides.id, id));

  await auditEntry("hero_slides", "update", String(id), "Edited a hero slide");
  bust();
  return { ok: true };
}

export async function deleteHeroSlide(id: number): Promise<ActionResult> {
  await requireSession();

  const rows = await db.select({ id: heroSlides.id }).from(heroSlides);
  if (rows.length <= 1) {
    return {
      ok: false,
      error: "Keep at least one slide — the home page hero cannot be empty.",
    };
  }

  const [existing] = await db
    .select({ path: heroSlides.path })
    .from(heroSlides)
    .where(eq(heroSlides.id, id));
  if (!existing) return { ok: false, error: "That slide no longer exists." };

  await db.delete(heroSlides).where(eq(heroSlides.id, id));
  await removeUpload(existing.path);

  await auditEntry("hero_slides", "delete", String(id), "Removed a hero slide");
  bust();
  return { ok: true };
}

export async function moveHeroSlide(
  id: number,
  direction: "up" | "down",
): Promise<ActionResult> {
  const result = await reorderRow(heroSlides, id, direction, {
    entity: "hero_slides",
    tag: TAGS.images,
    adminPath: ADMIN_PATH,
    label: "a hero slide",
  });
  if (result.ok) invalidate(TAGS.page, ADMIN_PATH);
  return result;
}
