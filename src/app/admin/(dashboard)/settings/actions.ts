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


/**
 * A repeatable group of rows, submitted by the form as one JSON string.
 *
 * Kept as JSON rather than indexed field names so the action receives one value
 * per field instead of having to reassemble `facts.0.label` and friends.
 */
const rowsOf = <T extends z.ZodRawShape>(shape: T, label: string) =>
  z
    .string()
    .transform((value, ctx) => {
      try {
        return JSON.parse(value) as unknown;
      } catch {
        ctx.addIssue({ code: "custom", message: `${label} could not be read` });
        return z.NEVER;
      }
    })
    .pipe(
      z
        .array(z.object(shape))
        // A row left entirely blank is someone who added one and changed their
        // mind, not an error worth stopping the save for.
        .transform((rows) =>
          rows.filter((row) =>
            Object.values(row).some((v) => String(v ?? "").trim() !== ""),
          ),
        )
        .refine((rows) => rows.length > 0, `${label} needs at least one row`),
    );

const row = z.string().trim().max(600);

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

  /* --- blocks that previously could only be changed in the database --- */

  stats: z.object({
    stats: rowsOf({ value: row, label: row }, "The figures"),
  }),
  currentStage: z.object({
    eyebrow: text(100, "The eyebrow"),
    heading: text(300, "The heading"),
    body: lines,
    facts: rowsOf({ value: row, label: row }, "The facts"),
  }),
  chairpersonReview: z.object({
    eyebrow: text(100, "The eyebrow"),
    heading: text(300, "The heading"),
    quotes: lines,
    pullQuote: text(1000, "The pull quote"),
    signatory: text(200, "The signatory"),
    signatoryRole: text(200, "Their role"),
    place: text(120, "The place"),
    date: text(60, "The date"),
    boardFacts: rowsOf({ value: row, label: row }, "The board facts"),
  }),
  esgHeader: z.object({
    eyebrow: text(100, "The eyebrow"),
    heading: text(300, "The heading"),
    intro: text(2000, "The introduction"),
  }),
  investorPanel: z.object({
    eyebrow: text(100, "The eyebrow"),
    heading: text(300, "The heading"),
    body: text(1000, "The body"),
    ctaLabel: text(120, "The button label"),
    ctaHref: text(200, "The button link"),
  }),
  electionOfDirectors: z.object({
    passwordNote: text(600, "The password note"),
    profiles: lines,
  }),
  genderDiversity: z.object({
    title: text(200, "The heading"),
    body: text(2000, "The body"),
  }),
  latestAgm: z.object({
    heading: text(300, "The heading"),
    label: text(200, "The label"),
    date: text(120, "The date"),
    time: text(60, "The time"),
    venue: lines,
    agenda: lines,
    keyDates: rowsOf({ label: row, value: row, note: row }, "The key dates"),
    noticeDate: text(120, "The notice date"),
    signedBy: text(200, "Signed by"),
    attendanceNote: text(400, "The attendance note"),
    source: text(300, "The source"),
  }),
  latestBriefing: z.object({
    heading: text(300, "The heading"),
    label: text(200, "The label"),
    sessionDate: text(120, "The session date"),
    sessionTime: text(60, "The session time"),
    intimationDate: text(120, "The intimation date"),
    audience: text(300, "The audience"),
    venue: lines,
    strategy: lines,
    strategySource: text(300, "The strategy source"),
    disclosed: rowsOf({ label: row, value: row, prior: row }, "The disclosed figures"),
    disclosedSource: text(300, "The disclosures source"),
    challenges: lines,
    challengesSource: text(300, "The challenges source"),
    presentationFiled: text(400, "The presentation note"),
    source: text(300, "The source"),
  }),
  corporateActions: z.object({
    heading: text(300, "The heading"),
    intro: text(1000, "The introduction"),
    items: rowsOf(
      { title: row, date: row, meeting: row, body: row, source: row },
      "The corporate actions",
    ),
  }),
  meetingRecord: z.object({
    heading: text(300, "The heading"),
    intro: text(1000, "The introduction"),
    rows: rowsOf({ financialYear: row, type: row, date: row }, "The meeting record"),
    source: text(300, "The source"),
  }),
  shareholderServices: z.object({
    heading: text(300, "The heading"),
    intro: text(1000, "The introduction"),
    items: rowsOf({ title: row, body: row }, "The services"),
    "registrar.name": text(200, "The registrar's name"),
    "registrar.label": text(200, "The registrar label"),
    "registrar.address": lines,
    source: text(300, "The source"),
  }),
} as const;

export type SettingKey = keyof typeof SCHEMAS;

const LABELS: Record<SettingKey, string> = {
  company: "company details",
  contact: "contact details",
  group: "the AKD Group section",
  stats: "the home page figures",
  currentStage: "the overview section",
  chairpersonReview: "the Chairperson's review",
  esgHeader: "the ESG heading",
  investorPanel: "the investor panel",
  electionOfDirectors: "the election of directors",
  genderDiversity: "the gender diversity section",
  latestAgm: "the latest AGM",
  latestBriefing: "the latest corporate briefing",
  corporateActions: "the corporate actions",
  meetingRecord: "the meeting record",
  shareholderServices: "the shareholder services",
};


/**
 * Put a parsed block back into the shape the database and the site expect.
 *
 * Two blocks do not map cleanly onto a flat form. `stats` is stored as a bare
 * array rather than an object, and `shareholderServices` holds a nested
 * `registrar`. The form works in flat fields either way; this puts the shape
 * back before it is written, so a save through the dashboard cannot quietly
 * change the structure the pages read.
 */
function toStoredShape(key: SettingKey, data: Record<string, unknown>): unknown {
  if (key === "stats") return data.stats;

  if (key === "shareholderServices") {
    const { ["registrar.name"]: name, ["registrar.label"]: label, ["registrar.address"]: address, ...rest } = data;
    return { ...rest, registrar: { name, label, address } };
  }

  return data;
}

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

  const value = toStoredShape(key, parsed.data as Record<string, unknown>);

  if (existing.length) {
    await db
      .update(settings)
      .set({ value, updatedAt: new Date() })
      .where(eq(settings.key, key));
  } else {
    await db.insert(settings).values({ key, value });
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
