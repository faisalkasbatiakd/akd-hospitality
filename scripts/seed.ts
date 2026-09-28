/**
 * Seeds the database from the site's existing content.
 *
 * The data is imported from src/data rather than transcribed. Retyping 1,280
 * lines of filings, director names and document titles by hand would introduce
 * exactly the errors this project has spent its time removing, so the modules
 * that currently render the site are the source of truth for the first load.
 *
 * Idempotent: refuses to overwrite a populated database unless --force is
 * given, so it cannot silently destroy edits made in the dashboard.
 *
 *   npm run db:seed
 *   npm run db:seed -- --force
 */
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

import { sql } from "drizzle-orm";

import { db } from "@/db";
import * as t from "@/db/schema";
import { keyFromDocUrl } from "@/lib/storage";

import { company, chairpersonReview, esg, investorPanel, milestones as milestoneData, businessMedia, overviewMedia, aboutMedia, aboutSectionMedia, investorMedia, mediaSectionMedia } from "@/data/company";
import { announcements } from "./seed-data/announcements";
import { heroSlides, heroHighlights } from "./seed-data/hero";
import { pageHeroes, defaultPageHero } from "./seed-data/page-heroes";
import { boardOfDirectors, officers, committees, electionOfDirectors, genderDiversity } from "@/data/governance";
import { financialStatements, annualReports, freeFloat, financialHighlights, financialInformation } from "@/data/investors";
import { agmNotices, eogmNotices, specialResolutions, corporateBriefings, shareholderForms } from "@/data/media";
import { shareholdingPatternDocs, electionDocs, genderDiversityDocs } from "./seed-data/governance-docs";
import { latestAgm, latestBriefing, corporateActions, meetingRecord, shareholderServices } from "@/data/media-notices";

const force = process.argv.includes("--force");
const PUBLIC_DOCS = join(process.cwd(), "public", "documents");

let warnings = 0;
const warn = (message: string) => {
  warnings += 1;
  console.warn(`  ! ${message}`);
};

/** Document groups, in the order their tabs appear on each page. */
const GROUPS = [
  { key: "financialStatements", label: "Financial Statements", page: "investors", docs: financialStatements },
  { key: "annualReports", label: "Annual Reports", page: "investors", docs: annualReports },
  { key: "freeFloat", label: "Free Float", page: "investors", docs: freeFloat },
  { key: "financialHighlights", label: "Financial Highlights", page: "investors", docs: financialHighlights },
  { key: "financialInformation", label: "Financial Information", page: "investors", docs: financialInformation },
  { key: "agmNotices", label: "Notice of Annual General Meeting", page: "media", docs: agmNotices },
  { key: "eogmNotices", label: "Notice of Extraordinary General Meeting", page: "media", docs: eogmNotices },
  { key: "specialResolutions", label: "Special Resolutions", page: "media", docs: specialResolutions },
  { key: "corporateBriefings", label: "Corporate Briefing Sessions", page: "media", docs: corporateBriefings },
  { key: "shareholderForms", label: "Shareholder Forms", page: "media", docs: shareholderForms },
  { key: "shareholdingPattern", label: "Pattern of Shareholding", page: "governance", docs: shareholdingPatternDocs },
  { key: "election", label: "Election of Directors", page: "governance", docs: electionDocs },
  { key: "genderDiversity", label: "Gender Diversity", page: "governance", docs: genderDiversityDocs },
] as const;

/** Unsplash URL -> a stable image key. Real files replace these via the dashboard. */
const imageKey = (prefix: string, name: string) => `${prefix}:${name}`;

async function isPopulated() {
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(t.documents);
  return (row?.n ?? 0) > 0;
}

async function wipe() {
  // Order matters: children before parents, and document_groups is restricted.
  await db.execute(sql`
    truncate table
      ${t.committeeMembers}, ${t.committees}, ${t.directors}, ${t.officers},
      ${t.documents}, ${t.documentGroups}, ${t.announcements}, ${t.milestones},
      ${t.businesses}, ${t.strategyObjectives}, ${t.esgPillars}, ${t.esgMetrics},
      ${t.esgPolicies}, ${t.companyInformation}, ${t.externalLinks},
      ${t.workstreams}, ${t.accommodationFormats}, ${t.heroSlides},
      ${t.heroHighlights}, ${t.images}, ${t.settings}
    restart identity cascade
  `);
}

async function main() {
  console.log("Seeding from scripts/seed-data and src/data\n");

  if (await isPopulated()) {
    if (!force) {
      console.error(
        "Database already holds documents. Re-running would discard dashboard\n" +
          "edits. Pass --force if that is what you want:\n\n" +
          "  npm run db:seed -- --force\n",
      );
      process.exit(1);
    }
    console.log("--force given: clearing existing content\n");
  }
  await wipe();

  /* ---------------------------------------------------------- documents */
  await db.insert(t.documentGroups).values(
    GROUPS.map((g, i) => ({ key: g.key, label: g.label, page: g.page, sort: i })),
  );

  let docCount = 0;
  for (const group of GROUPS) {
    const rows = group.docs.map((doc, i) => {
      const key = keyFromDocUrl(doc.href);
      const name = key.replace(/^documents\//, "");
      const onDisk = join(PUBLIC_DOCS, name);
      let sizeBytes: number | null = null;
      if (existsSync(onDisk)) {
        sizeBytes = statSync(onDisk).size;
      } else {
        warn(`${group.key}: file missing on disk - ${name}`);
      }
      return {
        groupKey: group.key,
        title: doc.title,
        path: key,
        sizeBytes,
        // Flagged on the real Governance page; the label carries the notice.
        passwordProtected: /password protected/i.test(doc.title) ? 1 : 0,
        sort: i,
      };
    });
    if (rows.length) await db.insert(t.documents).values(rows);
    docCount += rows.length;
    console.log(`  documents  ${group.key.padEnd(22)} ${rows.length}`);
  }

  /* -------------------------------------------------------- governance */
  await db.insert(t.directors).values(
    boardOfDirectors.map((d, i) => ({
      name: d.name,
      role: d.role,
      category: /independent/i.test(d.role)
        ? "Independent"
        : /non-executive/i.test(d.role)
          ? "Non-Executive"
          : /chief executive/i.test(d.role)
            ? "Executive"
            : null,
      bio: "bio" in d ? ((d as { bio?: string }).bio ?? null) : null,
      imagePath: null, // no photograph of any director appears in any filing
      sort: i,
    })),
  );

  await db.insert(t.officers).values(
    officers.map((o, i) => ({ name: o.name, role: o.role, sort: i })),
  );

  for (const [i, committee] of committees.entries()) {
    const [row] = await db
      .insert(t.committees)
      .values({ title: committee.title, sort: i })
      .returning({ id: t.committees.id });
    await db.insert(t.committeeMembers).values(
      committee.members.map((m, j) => ({
        committeeId: row.id,
        name: m.name,
        role: m.role,
        designation: "designation" in m ? ((m as { designation?: string }).designation ?? null) : null,
        note: "note" in m ? ((m as { note?: string }).note ?? null) : null,
        sort: j,
      })),
    );
  }

  /* ------------------------------------------------------ page content */
  await db.insert(t.announcements).values(
    announcements.map((a, i) => ({ title: a.title, href: a.href, sort: i })),
  );

  await db.insert(t.milestones).values(
    milestoneData.map((m, i) => ({
      year: m.year,
      title: m.title,
      description: m.description,
      sort: i,
    })),
  );

  await db.insert(t.strategyObjectives).values(
    company.currentStage.strategy.map((s, i) => ({ text: s, sort: i })),
  );

  await db.insert(t.esgPillars).values(
    esg.pillars.map((p, i) => ({ title: p.title, description: p.description, sort: i })),
  );
  await db.insert(t.esgMetrics).values(
    esg.metrics.map((m, i) => ({ label: m.label, value: m.value, sort: i })),
  );
  await db.insert(t.esgPolicies).values(
    esg.policies.map((p, i) => ({ text: p, sort: i })),
  );

  await db.insert(t.companyInformation).values(
    company.companyInformation.map((row, i) => ({
      label: row.label,
      values: [...row.value],
      sort: i,
    })),
  );

  await db.insert(t.externalLinks).values(
    company.externalLinks.map((l, i) => ({ label: l.label, href: l.href, sort: i })),
  );

  await db.insert(t.workstreams).values(
    company.currentStage.workstreams.map((w, i) => ({
      title: w.title,
      description: w.description,
      sort: i,
    })),
  );
  await db.insert(t.accommodationFormats).values(
    company.currentStage.formatsUnderStudy.map((f, i) => ({ label: f, sort: i })),
  );

  /* -------------------------------------------------------------- hero */
  await db.insert(t.heroSlides).values(
    heroSlides.map((s, i) => ({
      path: s.image,
      alt: s.alt,
      credit: s.credit ?? null,
      sort: i,
    })),
  );
  await db.insert(t.heroHighlights).values(
    heroHighlights.map((h, i) => ({
      title: h.title,
      body: h.body,
      href: h.href,
      linkLabel: h.linkLabel,
      sort: i,
    })),
  );

  /* ------------------------------------------------------------ images */
  const imageRows: { key: string; path: string; alt: string; credit: string | null }[] = [];
  const addImage = (key: string, media: { image: string; alt: string }) =>
    imageRows.push({ key, path: media.image, alt: media.alt, credit: null });

  for (const [route, media] of Object.entries(pageHeroes)) {
    addImage(imageKey("pageHero", route), media);
  }
  addImage(imageKey("pageHero", "default"), defaultPageHero);
  addImage("investorPanel", { image: investorPanel.image, alt: investorPanel.imageAlt });
  for (const [name, media] of Object.entries(businessMedia)) addImage(imageKey("businessMedia", name), media);
  for (const [name, media] of Object.entries(overviewMedia)) addImage(imageKey("overviewMedia", name), media);
  for (const [name, media] of Object.entries(aboutMedia)) addImage(imageKey("aboutMedia", name), media);
  for (const [name, media] of Object.entries(aboutSectionMedia)) addImage(imageKey("aboutSectionMedia", name), media);
  for (const [name, media] of Object.entries(mediaSectionMedia)) addImage(imageKey("mediaSectionMedia", name), media);
  // investorMedia is a single image, not a map of them.
  addImage("investorMedia", investorMedia);

  // Dedupe: several collections point at the same photograph.
  const seen = new Set<string>();
  const uniqueImages = imageRows.filter((r) => {
    if (seen.has(r.key)) return false;
    seen.add(r.key);
    return true;
  });
  await db.insert(t.images).values(uniqueImages);

  /* ---------------------------------------------------------- settings */
  const put = (key: string, value: unknown) => ({ key, value: value as object });
  await db.insert(t.settings).values([
    put("company", {
      name: company.name,
      formerName: company.formerName,
      symbol: company.symbol,
      exchange: company.exchange,
      incorporated: company.incorporated,
      tagline: company.tagline,
      intro: company.intro,
      vision: company.vision,
      mission: company.mission,
    }),
    put("contact", company.contact),
    put("group", company.group),
    put("stats", company.stats),
    put("currentStage", {
      eyebrow: company.currentStage.eyebrow,
      heading: company.currentStage.heading,
      body: company.currentStage.body,
      facts: company.currentStage.facts,
    }),
    put("chairpersonReview", chairpersonReview),
    put("esgHeader", { eyebrow: esg.eyebrow, heading: esg.heading, intro: esg.intro }),
    put("investorPanel", {
      eyebrow: investorPanel.eyebrow,
      heading: investorPanel.heading,
      body: investorPanel.body,
      ctaLabel: investorPanel.ctaLabel,
      ctaHref: investorPanel.ctaHref,
    }),
    put("latestAgm", latestAgm),
    put("latestBriefing", latestBriefing),
    put("corporateActions", corporateActions),
    put("meetingRecord", meetingRecord),
    put("shareholderServices", shareholderServices),
    put("genderDiversity", genderDiversity),
    put("electionOfDirectors", electionOfDirectors),
  ]);

  /* --------------------------------------------------------- businesses */
  await db.insert(t.businesses).values(
    company.businesses.map((b, i) => ({
      title: b.title,
      description: b.description,
      imageKey: seen.has(imageKey("businessMedia", b.title))
        ? imageKey("businessMedia", b.title)
        : null,
      sort: i,
    })),
  );

  /* ------------------------------------------------------------ report */
  console.log(`
Seeded:
  documents            ${docCount}   (expected 110)
  directors            ${boardOfDirectors.length}
  officers             ${officers.length}
  committees           ${committees.length}
  announcements        ${announcements.length}
  milestones           ${milestoneData.length}
  businesses           ${company.businesses.length}
  strategy objectives  ${company.currentStage.strategy.length}
  ESG pillars          ${esg.pillars.length}
  ESG metrics          ${esg.metrics.length}
  ESG policies         ${esg.policies.length}
  company info rows    ${company.companyInformation.length}
  external links       ${company.externalLinks.length}
  workstreams          ${company.currentStage.workstreams.length}
  formats under study  ${company.currentStage.formatsUnderStudy.length}
  hero slides          ${heroSlides.length}
  hero highlights      ${heroHighlights.length}
  images               ${uniqueImages.length}
  settings             14
`);

  if (docCount !== 110) {
    warn(`expected 110 documents, seeded ${docCount}`);
  }
  if (warnings) {
    console.warn(`Finished with ${warnings} warning(s).\n`);
    process.exit(1);
  }
  console.log("Done, no warnings.\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\nSeed failed:\n", error);
    process.exit(1);
  });
