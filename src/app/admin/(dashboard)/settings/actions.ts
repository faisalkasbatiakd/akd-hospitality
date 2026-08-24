"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { settings } from "@/db/schema";
import { requireSession } from "@/lib/auth";
import { TAGS } from "@/lib/content";

import { type ActionResult, auditEntry, invalidate } from "../_lib/crud";

const ADMIN_PATH = "/admin/settings";

/**
 * Singleton content blocks.
 *
 * Each block has its own zod schema rather than one loose object: these values
 * end up in page metadata, the footer and structured data, so a blank company
 * name or a malformed email would break more than the page it was typed on.
 */

const text = (max: number, label: string) =>
  z.string().trim().min(1, `${label} is required`).max(max);

const lines = z
  .string()
  .transform((value) =>
    value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  )
  .refine((list) => list.length > 0, "At least one line is required");

const SCHEMAS = {
  company: z.object({
    name: text(200, "The company name"),
    formerName: z.string().trim().max(200).optional(),
    symbol: text(20, "The PSX symbol"),
    exchange: text(120, "The exchange"),
    incorporated: text(10, "The year of incorporation"),
    tagline: text(400, "The tagline"),
    intro: text(3000, "The introduction"),
    vision: text(2000, "The vision"),
    mission: text(2000, "The mission"),
  }),
  contact: z.object({
    person: text(200, "The contact person"),
    role: text(200, "Their role"),
    address: lines,
    phone: text(60, "The telephone number"),
    fax: z.string().trim().max(60).optional(),
    email: z.string().trim().email("Enter a valid email address").max(200),
    investorEmail: z
      .string()
      .trim()
      .email("Enter a valid investor relations email")
      .max(200),
  }),
  group: z.object({
    title: text(200, "The heading"),
    body: lines,
  }),
} as const;

export type SettingKey = keyof typeof SCHEMAS;

const LABELS: Record<SettingKey, string> = {
  company: "company details",
  contact: "contact details",
  group: "the AKD Group section",
};

export async function saveSetting(
  key: SettingKey,
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();

  const schema = SCHEMAS[key];
  if (!schema) return { ok: false, error: "Unknown section." };

  const raw: Record<string, unknown> = {};
  for (const [field, value] of formData.entries()) {
    if (typeof value === "string") raw[field] = value;
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const existing = await db
    .select({ key: settings.key })
    .from(settings)
    .where(eq(settings.key, key));

  if (existing.length) {
    await db
      .update(settings)
      .set({ value: parsed.data, updatedAt: new Date() })
      .where(eq(settings.key, key));
  } else {
    await db.insert(settings).values({ key, value: parsed.data });
  }

  await auditEntry("settings", "update", key, `Edited ${LABELS[key]}`);
  invalidate(TAGS.settings, ADMIN_PATH);
  // The company name and contact details appear in the footer and in page
  // metadata, so the page cache has to go as well.
  invalidate(TAGS.page, ADMIN_PATH);
  return { ok: true };
}
