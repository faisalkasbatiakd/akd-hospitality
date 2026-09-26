"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { adminUsers, settings } from "@/db/schema";
import { hashPassword, requireSession, verifyPassword } from "@/lib/auth";
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

/* ------------------------------------------------------------- password */

/**
 * Minimum length, matching scripts/create-admin.ts so the two ways of setting a
 * password cannot disagree about what is acceptable.
 */
const MIN_PASSWORD = 10;

const passwordChange = z
  .object({
    current: z.string().min(1, "Enter your current password"),
    next: z
      .string()
      .min(MIN_PASSWORD, `The new password must be at least ${MIN_PASSWORD} characters`)
      .max(200, "That password is too long"),
    confirm: z.string().min(1, "Confirm the new password"),
  })
  .refine((v) => v.next === v.confirm, {
    message: "The new password and its confirmation do not match",
  })
  .refine((v) => v.next !== v.current, {
    message: "The new password is the same as the current one",
  });

/**
 * Change the signed-in administrator's password.
 *
 * The current password is required even though the caller already holds a
 * session. Without it, anyone who found an unlocked machine - or a session left
 * open on a shared one - could lock the real administrator out of their own
 * dashboard.
 *
 * There is no "forgot password" link anywhere, by design: an email reset is
 * another way in, and this is a single account. The consequence is that a
 * forgotten password needs someone with database access to reset it, which is
 * why this form exists at all.
 */
export async function changePassword(formData: FormData): Promise<ActionResult> {
  const session = await requireSession();

  const parsed = passwordChange.safeParse({
    current: String(formData.get("current") ?? ""),
    next: String(formData.get("next") ?? ""),
    confirm: String(formData.get("confirm") ?? ""),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const [user] = await db
    .select({ id: adminUsers.id, passwordHash: adminUsers.passwordHash })
    .from(adminUsers)
    .where(eq(adminUsers.email, session.email));

  if (!user) {
    return { ok: false, error: "That account no longer exists. Sign in again." };
  }

  if (!(await verifyPassword(parsed.data.current, user.passwordHash))) {
    // Deliberately the same wording whether the password was wrong or merely
    // mistyped; there is nothing useful to distinguish for someone already
    // holding a session.
    return { ok: false, error: "That is not your current password" };
  }

  await db
    .update(adminUsers)
    .set({ passwordHash: await hashPassword(parsed.data.next) })
    .where(eq(adminUsers.id, user.id));

  // The password itself is never written here, only the fact of the change.
  await auditEntry("admin_users", "password_change", String(user.id), "Changed the dashboard password");

  return { ok: true };
}
