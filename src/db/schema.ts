import {
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Content model for the admin dashboard.
 *
 * Two shapes, chosen per collection rather than uniformly:
 *
 *   Ordered lists that an editor adds to, removes from and reorders get their
 *   own table with a `sort` column - directors, documents, milestones.
 *
 *   Singletons that are really one long form get a row in `settings` as JSONB,
 *   validated by a zod schema at the edge. Giving the company record forty
 *   columns, most of them prose, would buy nothing: nothing joins on them and
 *   nothing queries by them.
 *
 * Deliberately NOT modelled here: everything in src/data/financials.ts - the
 * FY2025 snapshot, the six-year record, the shareholding pattern, the capital
 * figures and the going-concern notice. Those are audited numbers tied to a
 * page of the annual report. They stay in code, where changing them takes a
 * commit and a review, because a mistyped figure on a PSX-listed company's
 * investor page is a different class of problem from a mistyped hero caption.
 */

/** Where an uploaded file physically lives, resolved by the storage module. */
const storagePath = (name: string) => text(name);

/* ------------------------------------------------------------------ admin */

export const adminUsers = pgTable(
  "admin_users",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("admin_users_email_key").on(t.email)],
);

/**
 * Who changed what. A single shared login means the site's content history is
 * otherwise unattributable, and "the director's name is wrong" is much easier
 * to unpick with a trail than without one.
 */
export const auditLog = pgTable("audit_log", {
  id: serial("id").primaryKey(),
  actorEmail: text("actor_email").notNull(),
  action: text("action").notNull(), // create | update | delete | reorder | upload
  entity: text("entity").notNull(), // table name
  entityId: text("entity_id"),
  summary: text("summary").notNull(),
  at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
});

/* --------------------------------------------------------------- settings */

/**
 * Singleton content, one row per logical form. Keys in use:
 *   company            name, formerName, symbol, exchange, incorporated,
 *                      tagline, intro, vision, mission
 *   contact            person, role, address[], phone, fax, email, investorEmail
 *   group              title, body[]
 *   chairpersonReview  quotes[], pullQuote, signatory, place, date, boardFacts[]
 *   esgHeader          eyebrow, heading, intro
 *   investorPanel      eyebrow, heading, body, ctaLabel, ctaHref
 *   latestAgm          heading, time, date, venue[], keyDates[], ...
 *   latestBriefing     heading, sessionDate, figures[], ...
 *   corporateActions   heading, intro, items[]
 *   meetingRecord      heading, intro, rows[]
 *   shareholderServices heading, intro, registrar, items[]
 *   genderDiversity    title, body
 *   electionOfDirectors passwordNote, profiles[]
 */
export const settings = pgTable(
  "settings",
  {
    key: text("key").primaryKey(),
    value: jsonb("value").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  () => [],
);

/* ------------------------------------------------------------------ images */

/**
 * Keyed single images: page heroes, section media, business media, the
 * investor panel. One registry rather than a column on every table, so the
 * dashboard can offer "replace this image" the same way everywhere.
 *
 * Keys mirror the old data files, e.g. `pageHero:/about`,
 * `businessMedia:Hospitality`, `aboutMedia:vision`, `investorPanel`.
 */
export const images = pgTable(
  "images",
  {
    key: text("key").primaryKey(),
    path: storagePath("path").notNull(),
    alt: text("alt").notNull(),
    credit: text("credit"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  () => [],
);

/** The rotating hero on the home page - ordered, so not part of `images`. */
export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  path: storagePath("path").notNull(),
  alt: text("alt").notNull(),
  credit: text("credit"),
  sort: integer("sort").notNull().default(0),
});

export const heroHighlights = pgTable("hero_highlights", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  href: text("href").notNull(),
  linkLabel: text("link_label").notNull(),
  sort: integer("sort").notNull().default(0),
});

/* -------------------------------------------------------------- governance */

export const directors = pgTable("directors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  /** Independent / Non-Executive / Executive, as reported. */
  category: text("category"),
  bio: text("bio"),
  /**
   * Null until the Company supplies a photograph. The site renders initials
   * rather than a stock portrait: putting a stranger's face beside a real
   * director's name misrepresents them.
   */
  imagePath: storagePath("image_path"),
  sort: integer("sort").notNull().default(0),
});

export const officers = pgTable("officers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  sort: integer("sort").notNull().default(0),
});

export const committees = pgTable("committees", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  sort: integer("sort").notNull().default(0),
});

export const committeeMembers = pgTable("committee_members", {
  id: serial("id").primaryKey(),
  committeeId: integer("committee_id")
    .notNull()
    .references(() => committees.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  role: text("role").notNull(), // Chairperson | Member | Secretary
  designation: text("designation"), // ID | NE | CEO | CFO
  note: text("note"),
  sort: integer("sort").notNull().default(0),
});

/* --------------------------------------------------------------- documents */

/**
 * The published archive: 110 PDFs at the time of writing. `group` is the tab
 * the file appears under, `file` the stored object. Titles are the Company's
 * own labels, not derived from the file name.
 */
export const documentGroups = pgTable(
  "document_groups",
  {
    key: text("key").primaryKey(), // financialStatements, agmNotices, ...
    label: text("label").notNull(), // "Financial Statements"
    page: text("page").notNull(), // investors | media | governance
    sort: integer("sort").notNull().default(0),
  },
  () => [],
);

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  groupKey: text("group_key")
    .notNull()
    .references(() => documentGroups.key, { onDelete: "restrict" }),
  title: text("title").notNull(),
  /** Stored object path. Kept even when the display title changes. */
  path: storagePath("path").notNull(),
  /** Bytes, for the dashboard listing. */
  sizeBytes: integer("size_bytes"),
  /**
   * A filed notice is never revised in place - a correction arrives as a new
   * file - so this records when the Company published it, not when it was
   * uploaded here.
   */
  publishedOn: text("published_on"),
  passwordProtected: integer("password_protected").notNull().default(0),
  sort: integer("sort").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ------------------------------------------------------------ page content */

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  href: text("href").notNull(),
  sort: integer("sort").notNull().default(0),
});

export const milestones = pgTable("milestones", {
  id: serial("id").primaryKey(),
  year: text("year").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sort: integer("sort").notNull().default(0),
});

export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageKey: text("image_key").references(() => images.key, {
    onDelete: "set null",
  }),
  sort: integer("sort").notNull().default(0),
});

export const strategyObjectives = pgTable("strategy_objectives", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  sort: integer("sort").notNull().default(0),
});

export const esgPillars = pgTable("esg_pillars", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sort: integer("sort").notNull().default(0),
});

export const esgMetrics = pgTable("esg_metrics", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  sort: integer("sort").notNull().default(0),
});

export const esgPolicies = pgTable("esg_policies", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  sort: integer("sort").notNull().default(0),
});

/** Statutory and advisory rows on the About page. Values are a list. */
export const companyInformation = pgTable("company_information", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  values: jsonb("values").notNull().$type<string[]>(),
  sort: integer("sort").notNull().default(0),
});

export const externalLinks = pgTable("external_links", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  href: text("href").notNull(),
  sort: integer("sort").notNull().default(0),
});

/** Market-analysis workstreams and the accommodation formats under study. */
export const workstreams = pgTable("workstreams", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sort: integer("sort").notNull().default(0),
});

export const accommodationFormats = pgTable("accommodation_formats", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  sort: integer("sort").notNull().default(0),
});
