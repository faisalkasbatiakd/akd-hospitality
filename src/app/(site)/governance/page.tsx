import type { Metadata } from "next";
import Image from "next/image";
import {
  Briefcase,
  Info,
  ScrollText,
  ShieldCheck,
  Users,
} from "lucide-react";

/**
 * Director profiles and the two risk diagrams stay in code: the profiles are a
 * password-protected disclosure list, and the diagrams are the Company's own
 * artwork committed to the repository, not editorial images.
 */
import {
  directorProfiles,
  governanceDiagrams,
} from "@/data/governance";
import type * as Governance from "@/data/governance";
import { getBoard, getDocumentsForPage, getSetting } from "@/lib/content";

import { ogImage } from "@/lib/site";
import { iconTint } from "@/lib/icon-tints";
import { cn } from "@/lib/utils";
import { PageSchema } from "@/components/seo/page-schema";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { DocumentList } from "@/components/shared/document-list";
import { ProfileDisclosure } from "@/components/shared/profile-disclosure";
import { Card, CardContent } from "@/components/ui/card";

const pageTitle = "Governance";
const pageDescription =
  "Board of Directors, director profiles, board committees, shareholding pattern and gender diversity disclosures of AKD Hospitality Limited (AKDHL).";

/** One icon per board committee, in the order they are constituted. */
const committeeIcons = [ScrollText, Users, ShieldCheck, Briefcase];

/**
 * Two initials from a director's name, skipping the honorific so that
 * "Mr. Nadeem Saulat Siddiqui" reads as NS rather than MN.
 */
function initialsOf(name: string) {
  const words = name
    .replace(/^(Mr|Mrs|Ms|Dr)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean);
  return words.slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/governance" },
  keywords: [
    "AKD Hospitality governance",
    "AKDHL board of directors",
    "board committees",
    "shareholding pattern",
    "election of directors",
    "code of corporate governance Pakistan",
  ],
  openGraph: {
    type: "article",
    url: "/governance",
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

export default async function GovernancePage() {
  const { directors: boardOfDirectors, officers, committees } = await getBoard();
  // Governance filings are managed on the dashboard alongside every other
  // document, so they come from the same reader as the Investors and Media
  // lists rather than a separate static file.
  const [electionOfDirectors, genderDiversity] = await Promise.all([
    getSetting<typeof Governance.electionOfDirectors>("electionOfDirectors"),
    getSetting<typeof Governance.genderDiversity>("genderDiversity"),
  ]);
  if (!electionOfDirectors || !genderDiversity) return null;
  const govDocs = await getDocumentsForPage("governance");
  const docsFor = (key: string) =>
    govDocs.find((group) => group.key === key)?.items ?? [];
  const shareholdingPatternDocs = docsFor("shareholdingPattern");
  const electionDocs = docsFor("election");
  const genderDiversityDocs = docsFor("genderDiversity");

  return (
    <>
      <PageSchema
        path="/governance"
        name={pageTitle}
        description={pageDescription}
        type="WebPage"
      />

      <PageHero
        route="/governance"
        title="Governance"
        description="The Board of Directors and its committees oversee the Company's strategy, risk management and compliance with the requirements of the Securities and Exchange Commission of Pakistan."
      />

      {/* Board of Directors */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <SectionHeading
          eyebrow="Leadership"
          title="Board of Directors"
          description="The Board comprises executive, non-executive and independent directors."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boardOfDirectors.map((director, index) => (
            <Card
              key={director.name}
              data-aos="fade-up"
              data-aos-delay={index * 70}
              className="group border-border card-hover"
            >
              <CardContent className="flex items-start gap-4 px-6 py-6">
                {/*
                  A real photograph when the Company has supplied one through
                  the dashboard, initials otherwise. Never a stock portrait: a
                  stranger's face beside a named director misrepresents them.
                */}
                {director.imageUrl ? (
                  <Image
                    src={director.imageUrl}
                    alt={director.name}
                    width={56}
                    height={56}
                    // Served by our own file route, which the image optimiser
                    // is not configured for.
                    unoptimized
                    className="size-14 shrink-0 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span
                    className={cn(
                      "grid size-14 shrink-0 place-items-center rounded-full text-base font-semibold tracking-wide transition-transform duration-300 group-hover:scale-105",
                      iconTint(index),
                    )}
                    aria-hidden
                  >
                    {initialsOf(director.name)}
                  </span>
                )}

                <span className="min-w-0">
                  <h3 className="text-base font-semibold leading-snug text-brand-navy">
                    {director.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-brand-accent">
                    {director.role}
                  </p>
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Officers. Published on p. 4 alongside the Board, and previously
            missing from the site entirely. */}
        <h3 className="mt-14 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Officers of the Company
        </h3>
        <dl className="mt-5 grid gap-4 sm:grid-cols-3">
          {officers.map((officer, index) => (
            <div
              key={officer.name}
              data-aos="fade-up"
              data-aos-delay={index * 70}
              className="card-hover min-w-0 rounded-2xl border border-border p-5"
            >
              <dt className="text-sm font-semibold leading-snug text-brand-navy">
                {officer.name}
              </dt>
              <dd className="mt-1.5 text-sm text-brand-accent">
                {officer.role}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Director profiles */}
      <section className="border-y border-border bg-background py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Profiles"
            title="Director profiles"
            description="Background and experience of the directors associated with AKD Hospitality Limited."
          />

          <div className="mt-10">
            <ProfileDisclosure items={directorProfiles} />
          </div>
        </div>
      </section>

      {/* Committees */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <SectionHeading
          eyebrow="Board committees"
          title="Committees of the Board"
          description="Committees constituted by the Board to strengthen oversight and internal controls."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {committees.map((committee, index) => {
            const Icon = committeeIcons[index] ?? ShieldCheck;
            return (
              <Card
                key={committee.title}
                data-aos="fade-up"
                data-aos-delay={index * 90}
                className="group border-border card-hover"
              >
                <CardContent className="px-6 py-6 lg:px-7">
                  <span
                    className={cn(
                      "grid size-11 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                      iconTint(index),
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>

                  <h3 className="mt-5 text-base font-medium leading-snug text-brand-navy lg:text-lg">
                    {committee.title}
                  </h3>

                  {/*
                    Roles come from the annual report rather than being
                    inferred from list position, so a data change can never
                    silently promote the wrong person to chair.
                  */}
                  <ul className="mt-5 divide-y divide-border border-t border-border">
                    {committee.members.map((member) => (
                      <li
                        key={member.name}
                        className="flex items-start gap-3 py-2.5"
                      >
                        <span
                          className={cn(
                            "w-[5.5rem] shrink-0 rounded-full px-2 py-1 text-center text-xs font-semibold uppercase tracking-[0.06em]",
                            member.role === "Chairperson"
                              ? "bg-brand-navy text-white"
                              : "bg-brand-navy/5 text-brand-navy/70",
                          )}
                        >
                          {member.role === "Chairperson" ? "Chair" : member.role}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm text-foreground/85">
                            {member.name}
                          </span>
                          {(member.designation || member.note) && (
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                              {member.note ??
                                (member.designation === "ID"
                                  ? "Independent director"
                                  : "Non-executive director")}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Risk framework diagrams - the Company's own artwork */}
      <section className="border-y border-border bg-background py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Risk oversight"
            title="How risk is managed"
            description="The framework and threat map the Board uses, as published in the FY2025 annual report."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {governanceDiagrams.map((d, index) => (
              <figure
                key={d.src}
                data-aos="fade-up"
                data-aos-delay={index * 110}
                className="group overflow-hidden rounded-2xl border border-border card-hover"
              >
                <div className="relative aspect-[16/10] bg-white">
                  <Image
                    src={d.src}
                    alt={d.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-contain p-4"
                  />
                </div>
                <figcaption className="border-t border-border px-6 py-5">
                  <p className="text-[15px] font-medium text-brand-navy">
                    {d.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground/70">
                    {d.caption}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Disclosures */}
      <section className="border-y border-border bg-background py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Disclosures"
            title="Shareholding, elections & diversity"
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            {/* Shareholding pattern */}
            <div>
              <h3 className="text-base font-semibold text-brand-navy">
                Shareholding Pattern
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Annual pattern of shareholding as filed with the regulator.
              </p>
              <DocumentList items={shareholdingPatternDocs} />
            </div>

            {/* Election of directors */}
            <div className="space-y-8">
              <div>
                <h3 className="text-base font-semibold text-brand-navy">
                  Election of Directors
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Notices, director profiles and shareholder lists relating to
                  the election of directors.
                </p>
                <DocumentList items={electionDocs} />

                <div className="mt-4 flex gap-3 rounded-lg border border-brand-sky/40 bg-brand-sky/10 px-4 py-3">
                  <Info
                    className="mt-0.5 size-4 shrink-0 text-brand-sky"
                    aria-hidden
                  />
                  <p className="text-xs leading-relaxed text-foreground/80">
                    {electionOfDirectors.passwordNote}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-brand-navy">
                  {genderDiversity.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {genderDiversity.body}
                </p>
                <DocumentList items={genderDiversityDocs} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
