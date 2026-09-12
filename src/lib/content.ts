import { unstable_cache } from "next/cache";
import { asc } from "drizzle-orm";

import { db } from "@/db";
import * as t from "@/db/schema";
import { fileUrl } from "@/lib/storage";

/**
 * Read side of the content model.
 *
 * Every reader is wrapped in unstable_cache with a tag, so pages stay
 * statically cached between edits instead of hitting Postgres per request.
 * The dashboard's server actions call revalidateTag with the matching tag,
 * which is why the tags are exported rather than inlined as strings.
 *
 * Shapes deliberately mirror what src/data used to export, so the components
 * that render them did not have to change.
 */

export const TAGS = {
  documents: "content:documents",
  governance: "content:governance",
  announcements: "content:announcements",
  milestones: "content:milestones",
  settings: "content:settings",
  images: "content:images",
  page: "content:page",
} as const;

/** Wraps a query so it is cached under a tag and a stable key. */
function cached<T>(key: string, tag: string, query: () => Promise<T>) {
  return unstable_cache(query, [key], { tags: [tag, TAGS.page] });
}

export type DocItem = { title: string; href: string };
export type DocumentGroup = {
  key: string;
  label: string;
  page: string;
  items: DocItem[];
};

/** Every document group with its items, in published order. */
export const getDocumentGroups = cached(
  "document-groups",
  TAGS.documents,
  async (): Promise<DocumentGroup[]> => {
    const [groups, rows] = await Promise.all([
      db
        .select()
        .from(t.documentGroups)
        .orderBy(asc(t.documentGroups.sort)),
      db
        .select({
          groupKey: t.documents.groupKey,
          title: t.documents.title,
          path: t.documents.path,
          sort: t.documents.sort,
          id: t.documents.id,
        })
        .from(t.documents)
        .orderBy(asc(t.documents.sort), asc(t.documents.id)),
    ]);

    return groups.map((group) => ({
      key: group.key,
      label: group.label,
      page: group.page,
      items: rows
        .filter((row) => row.groupKey === group.key)
        .map((row) => ({ title: row.title, href: fileUrl(row.path) })),
    }));
  },
);

/** Groups for one page, so /investors does not carry /media's lists. */
export async function getDocumentsForPage(page: string) {
  const groups = await getDocumentGroups();
  return groups.filter((group) => group.page === page);
}

export const getBoard = cached("board", TAGS.governance, async () => {
  const [directors, officers, committees, members] = await Promise.all([
    db.select().from(t.directors).orderBy(asc(t.directors.sort)),
    db.select().from(t.officers).orderBy(asc(t.officers.sort)),
    db.select().from(t.committees).orderBy(asc(t.committees.sort)),
    db
      .select()
      .from(t.committeeMembers)
      .orderBy(asc(t.committeeMembers.sort)),
  ]);

  return {
    directors: directors.map((d) => ({
      name: d.name,
      role: d.role,
      category: d.category,
      bio: d.bio,
      imageUrl: d.imagePath ? fileUrl(d.imagePath) : null,
    })),
    officers: officers.map((o) => ({ name: o.name, role: o.role })),
    committees: committees.map((c) => ({
      title: c.title,
      members: members
        .filter((m) => m.committeeId === c.id)
        .map((m) => ({
          name: m.name,
          role: m.role,
          designation: m.designation,
          note: m.note,
        })),
    })),
  };
});

export const getAnnouncements = cached(
  "announcements",
  TAGS.announcements,
  async () =>
    (
      await db
        .select({ title: t.announcements.title, href: t.announcements.href })
        .from(t.announcements)
        .orderBy(asc(t.announcements.sort))
    ).map((row) => ({ title: row.title, href: row.href })),
);

export const getMilestones = cached("milestones", TAGS.milestones, async () =>
  (
    await db
      .select({
        year: t.milestones.year,
        title: t.milestones.title,
        description: t.milestones.description,
      })
      .from(t.milestones)
      .orderBy(asc(t.milestones.sort))
  ).map((row) => ({ ...row })),
);

/**
 * Singleton content blocks, keyed as they were stored by the seed. Returned as
 * a map so a page can pull several without one query each.
 */
export const getSettings = cached("settings", TAGS.settings, async () => {
  const rows = await db.select().from(t.settings);
  const map: Record<string, unknown> = {};
  for (const row of rows) map[row.key] = row.value;
  return map;
});

/** One setting, typed by the caller. Returns null when it has not been seeded. */
export async function getSetting<T>(key: string): Promise<T | null> {
  const settings = await getSettings();
  return (settings[key] as T) ?? null;
}

export type Company = {
  name: string;
  formerName?: string;
  symbol: string;
  exchange: string;
  incorporated: string;
  tagline: string;
  intro: string;
  vision: string;
  mission: string;
  contact: {
    person: string;
    role: string;
    address: string[];
    phone: string;
    fax?: string;
    email: string;
    investorEmail: string;
  };
  externalLinks: { label: string; href: string }[];
};

/**
 * The company record, shaped exactly as src/data/company.ts used to export it
 * for the pages that read identity and contact details.
 *
 * One helper rather than three calls per page: nearly every page needs some of
 * this, and assembling it in one place keeps the pages themselves unchanged
 * apart from becoming async.
 */
export async function getCompany(): Promise<Company | null> {
  const [settings, lists] = await Promise.all([getSettings(), getAboutLists()]);
  const identity = settings.company as Omit<
    Company,
    "contact" | "externalLinks"
  > | undefined;
  const contact = settings.contact as Company["contact"] | undefined;
  // Both are required by the settings schema, so a missing one means the
  // database has not been seeded rather than a field left blank.
  if (!identity || !contact) return null;
  return { ...identity, contact, externalLinks: lists.externalLinks };
}

export const getImages = cached("images", TAGS.images, async () => {
  const rows = await db.select().from(t.images);
  const map: Record<string, { url: string; alt: string; credit: string | null }> =
    {};
  for (const row of rows) {
    map[row.key] = {
      // Seeded values are remote Unsplash URLs; dashboard uploads are storage
      // keys. Anything that already looks absolute is passed through.
      url: /^https?:\/\//.test(row.path) ? row.path : fileUrl(row.path),
      alt: row.alt,
      credit: row.credit,
    };
  }
  return map;
});

/** Hero slides and the rotating highlight panel on the home page. */
export const getHero = cached("hero", TAGS.page, async () => {
  const [slides, highlights] = await Promise.all([
    db.select().from(t.heroSlides).orderBy(asc(t.heroSlides.sort)),
    db.select().from(t.heroHighlights).orderBy(asc(t.heroHighlights.sort)),
  ]);
  return {
    slides: slides.map((s) => ({
      image: /^https?:\/\//.test(s.path) ? s.path : fileUrl(s.path),
      alt: s.alt,
      credit: s.credit ?? undefined,
    })),
    highlights: highlights.map((h) => ({
      title: h.title,
      body: h.body,
      href: h.href,
      linkLabel: h.linkLabel,
    })),
  };
});

/** Lists that belong to the About page. */
export const getAboutLists = cached("about-lists", TAGS.page, async () => {
  const [strategy, pillars, metrics, policies, info, links, work, biz] =
    await Promise.all([
      db
        .select()
        .from(t.strategyObjectives)
        .orderBy(asc(t.strategyObjectives.sort)),
      db.select().from(t.esgPillars).orderBy(asc(t.esgPillars.sort)),
      db.select().from(t.esgMetrics).orderBy(asc(t.esgMetrics.sort)),
      db.select().from(t.esgPolicies).orderBy(asc(t.esgPolicies.sort)),
      db
        .select()
        .from(t.companyInformation)
        .orderBy(asc(t.companyInformation.sort)),
      db.select().from(t.externalLinks).orderBy(asc(t.externalLinks.sort)),
      db.select().from(t.workstreams).orderBy(asc(t.workstreams.sort)),
      db.select().from(t.businesses).orderBy(asc(t.businesses.sort)),
    ]);

  return {
    strategy: strategy.map((row) => row.text),
    esgPillars: pillars.map((p) => ({
      title: p.title,
      description: p.description,
    })),
    esgMetrics: metrics.map((m) => ({ label: m.label, value: m.value })),
    esgPolicies: policies.map((row) => row.text),
    companyInformation: info.map((row) => ({
      label: row.label,
      value: row.values,
    })),
    externalLinks: links.map((l) => ({ label: l.label, href: l.href })),
    workstreams: work.map((w) => ({
      title: w.title,
      description: w.description,
    })),
    businesses: biz.map((b) => ({
      title: b.title,
      description: b.description,
      imageKey: b.imageKey,
    })),
  };
});
