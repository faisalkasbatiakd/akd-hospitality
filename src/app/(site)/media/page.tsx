import type { Metadata } from "next";
import {
  CalendarDays,
  FileCheck2,
  Gavel,
  Presentation,
  ScrollText,
} from "lucide-react";

import { getDocumentsForPage } from "@/lib/content";
import { iconTint } from "@/lib/icon-tints";
import { cn } from "@/lib/utils";
import { ogImage } from "@/lib/site";
import { PageSchema } from "@/components/seo/page-schema";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { DocumentList } from "@/components/shared/document-list";
import { MediaHighlights } from "@/components/sections/media-highlights";

/**
 * Section furniture stays here - the blurb and icon describe the page, not the
 * filings. Only the items come from the database, matched by group key.
 */
const SECTION_META: Record<string, { description: string; icon: typeof CalendarDays }> = {
  agmNotices: {
    description:
      "Notices issued to shareholders for the Annual General Meeting of the Company.",
    icon: CalendarDays,
  },
  eogmNotices: {
    description:
      "Notices issued for Extraordinary General Meetings convened by the Company.",
    icon: Gavel,
  },
  specialResolutions: {
    description:
      "Special resolutions passed at the general meetings of the Company.",
    icon: ScrollText,
  },
  corporateBriefings: {
    description:
      "Presentations and materials from corporate briefing sessions held with the investor community.",
    icon: Presentation,
  },
  shareholderForms: {
    description:
      "Ballot papers, proxy forms and the annual report circulation form for shareholders.",
    icon: FileCheck2,
  },
};

const pageTitle = "Media";
const pageDescription =
  "AKD Hospitality AGM and EOGM notices, corporate briefing results, shareholder-approved resolutions, shareholder services and the full notice archive.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/media" },
  keywords: [
    "AKD Hospitality AGM notice",
    "AKDHL EOGM",
    "corporate briefing session",
    "special resolution",
    "shareholder forms",
    "proxy form",
    "AKDHL share registrar",
    "e-dividend mandate",
  ],
  openGraph: {
    type: "article",
    url: "/media",
    title: pageTitle,
    description: pageDescription,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [ogImage.url],
  },
};

export default async function MediaPage() {
  const sections = (await getDocumentsForPage("media")).map((group) => ({
    title: group.label,
    description: SECTION_META[group.key]?.description ?? "",
    items: group.items,
    icon: SECTION_META[group.key]?.icon ?? FileCheck2,
  }));

  return (
    <>
      <PageSchema
        path="/media"
        name={pageTitle}
        description={pageDescription}
        type="CollectionPage"
      />

      <PageHero
        route="/media"
        title="Media"
        description="Meeting notices, corporate briefing results, shareholder-approved resolutions and the forms shareholders need, drawn from the Company's own filings."
      />

      <MediaHighlights />

      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHeading
            eyebrow="Document library"
            title="Notices & corporate disclosures"
            description="All notices are published in accordance with the requirements of the Securities and Exchange Commission of Pakistan and the Pakistan Stock Exchange."
          />

          <div className="mt-10 space-y-6">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.title}
                  data-aos="fade-up"
                  className="group rounded-2xl border border-border p-6 card-hover lg:p-7"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                      <span
                        className={cn(
                          "grid size-10 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                          iconTint(index),
                        )}
                      >
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-base font-medium text-brand-navy">
                          {section.title}
                        </h3>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground/70">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-semibold text-brand-accent">
                      {section.items.length} document
                      {section.items.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <DocumentList items={section.items} />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
