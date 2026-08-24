import type { Metadata } from "next";
import { asc } from "drizzle-orm";

import { db } from "@/db";
import { heroSlides, images } from "@/db/schema";
import { requireSession } from "@/lib/auth";
import { fileUrl } from "@/lib/storage";

import { type Group, ImagesManager } from "./images-manager";

export const metadata: Metadata = { title: "Images" };

/**
 * Human labels for the storage keys.
 *
 * The keys mirror the old data files, so they read like `aboutMedia:vision`.
 * An editor should not have to know that, hence the lookup - and anything not
 * listed still appears, labelled by its key, rather than being hidden.
 */
const LABELS: Record<string, { label: string; where: string }> = {
  "pageHero:/about": { label: "About Us", where: "Hero photograph, top of the page" },
  "pageHero:/governance": { label: "Governance", where: "Hero photograph, top of the page" },
  "pageHero:/investors": { label: "Investors", where: "Hero photograph, top of the page" },
  "pageHero:/media": { label: "Media", where: "Hero photograph, top of the page" },
  "pageHero:/contact": { label: "Contact", where: "Hero photograph, top of the page" },
  "pageHero:default": { label: "Fallback", where: "Any page without its own hero" },

  "overviewMedia:primary": { label: "Overview, large", where: "Home page — “A 1936 charter…”" },
  "overviewMedia:secondary": { label: "Overview, small", where: "Home page — “A 1936 charter…”" },
  "aboutMedia:vision": { label: "Vision", where: "Home page — vision card" },
  "aboutMedia:mission": { label: "Mission", where: "Home page — mission card" },
  investorPanel: { label: "Investor panel", where: "Home page — “Investor Information”" },
  investorMedia: { label: "Investors page", where: "Investors — section photograph" },
  "aboutSectionMedia:strategy": { label: "Strategy", where: "About — strategic objectives" },
  "aboutSectionMedia:esg": { label: "ESG", where: "About — ESG framework" },
  "aboutSectionMedia:marketAnalysis": { label: "Market analysis", where: "About — feasibility work" },
  "mediaSectionMedia:agm": { label: "AGM", where: "Media — latest general meeting" },
  "mediaSectionMedia:briefing": { label: "Corporate briefing", where: "Media — latest briefing" },

  "businessMedia:Hospitality": { label: "Hospitality", where: "About — lines of business" },
  "businessMedia:Motels": { label: "Motels", where: "About — lines of business" },
  "businessMedia:Destination Management": { label: "Destination Management", where: "About — lines of business" },
  "businessMedia:Tourism Attractions": { label: "Tourism Attractions", where: "About — lines of business" },
};

/** Which card a key belongs to, in the order the cards appear. */
const GROUPS: { title: string; description: string; match: (key: string) => boolean }[] =
  [
    {
      title: "Page heroes",
      description:
        "The full-width photograph at the top of each page, behind the title.",
      match: (key) => key.startsWith("pageHero:"),
    },
    {
      title: "Lines of business",
      description: "One photograph per line of business on the About page.",
      match: (key) => key.startsWith("businessMedia:"),
    },
    {
      title: "Section photographs",
      description:
        "Images inside sections of the Home, About, Investors and Media pages.",
      match: () => true,
    },
  ];

export default async function ImagesPage() {
  await requireSession();

  const [imageRows, slideRows] = await Promise.all([
    db.select().from(images).orderBy(asc(images.key)),
    db.select().from(heroSlides).orderBy(asc(heroSlides.sort), asc(heroSlides.id)),
  ]);

  /** Seeded rows still hold remote Unsplash URLs; uploads hold storage keys. */
  const resolve = (path: string) =>
    /^https?:\/\//.test(path)
      ? { url: path, placeholder: true }
      : { url: fileUrl(path), placeholder: false };

  const assigned = new Set<string>();
  const groups: Group[] = GROUPS.map((group) => ({
    title: group.title,
    description: group.description,
    slots: imageRows
      .filter((row) => !assigned.has(row.key) && group.match(row.key))
      .map((row) => {
        assigned.add(row.key);
        const meta = LABELS[row.key];
        return {
          key: row.key,
          label: meta?.label ?? row.key,
          where: meta?.where ?? row.key,
          alt: row.alt,
          ...resolve(row.path),
        };
      }),
  })).filter((group) => group.slots.length > 0);

  return (
    <ImagesManager
      groups={groups}
      slides={slideRows.map((row) => ({
        id: row.id,
        alt: row.alt,
        credit: row.credit,
        ...resolve(row.path),
      }))}
    />
  );
}
