/**
 * Generate src/data/esg-policy.ts from the two Word documents the Company
 * supplied, in content-source/.
 *
 *   npm run policies:import
 *
 * Generated rather than typed out for the same reason the seed imports from
 * src/data instead of restating it: these are board-approved policy documents,
 * and a hand-transcription of fifty-odd commitments with SDG references is a
 * quiet way to publish something the Board did not approve. Re-run this when an
 * updated .docx arrives and the diff shows exactly what the Company changed.
 *
 * A .docx is a zip; the text lives in word/document.xml. Word splits a sentence
 * across many <w:r> runs, so every <w:t> inside a paragraph is concatenated
 * rather than read individually.
 */

import { writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

/** Paragraphs of a .docx, in order, each tagged as a list item or not. */
function paragraphs(path) {
  // Reading the zip through PowerShell's Expand-Archive would be slower than a
  // tiny inflate here, and Node has no zip reader built in. So: pull the one
  // entry we need with the system unzip, which Git for Windows provides.
  const xml = execFileSync("unzip", ["-p", path, "word/document.xml"], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });

  const out = [];
  // Each <w:p>…</w:p> is one paragraph.
  for (const m of xml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)) {
    const p = m[0];
    const text = [...p.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)]
      .map((t) => t[1])
      .join("")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .trim();
    if (!text) continue;
    out.push({ text, list: /<w:numPr[ >/]/.test(p) });
  }
  return out;
}

/**
 * Split a trailing "(SDG 7, 13)" off a commitment.
 *
 * The Company tags almost every line with the UN goals it serves. Left inline
 * they read as clutter at the end of every sentence; pulled out they become the
 * most useful thing on the page, so they are parsed rather than displayed as
 * written.
 */
function splitSdg(text) {
  const m = text.match(/\s*\(SDG\s*([0-9,\s&]+)\)\s*$/i);
  if (!m) return { text, sdg: [] };
  const sdg = m[1]
    .split(/[,&]/)
    .map((n) => n.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= 17);
  return { text: text.slice(0, m.index).trim(), sdg };
}

/**
 * Drop decorative emoji from a heading.
 *
 * The source documents put a seedling, scales and a bar chart on three section
 * headings. They are removed for display and only there: this site sets its
 * headings in one typeface with lucide icons throughout, and an emoji in a
 * heading on a listed company's policy page reads as a different document
 * pasted in. Nothing in the policy's substance is touched - the icon the page
 * puts beside each section carries the same meaning in the site's own
 * vocabulary.
 */
function stripEmoji(text) {
  return text
    .replace(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu,
      "",
    )
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Strip a leading "2.1 " or "3. " from a heading, keeping the number apart. */
function splitNumber(text) {
  const clean = stripEmoji(text);
  const m = clean.match(/^(\d+(?:\.\d+)?)[.)]?\s+(.*)$/);
  return m ? { number: m[1], title: m[2].trim() } : { number: null, title: clean };
}

/**
 * The ESG policy: numbered sections, some with numbered subsections, each
 * holding a list of commitments.
 */
function parseEsg(paras) {
  const sections = [];
  let section = null;
  let group = null;

  for (const { text, list } of paras) {
    if (list) {
      const { text: body, sdg } = splitSdg(text);
      // A commitment before any subsection belongs straight to the section.
      const target = group ?? section;
      if (target) target.items.push({ text: body, sdg });
      continue;
    }

    const { number, title } = splitNumber(text);
    if (!number) continue; // document title, or the signature line

    if (number.includes(".")) {
      group = { number, title, items: [] };
      section?.groups.push(group);
    } else {
      section = { number, title, items: [], groups: [] };
      group = null;
      sections.push(section);
    }
  }
  return sections;
}

/**
 * The DE&I policies: sections separated by "Policy:" / "Procedures:" labels
 * rather than numbers.
 *
 * The first section carries no heading of its own in the source - the document
 * title stands in for it - so one is supplied here and flagged in the generated
 * file, because a page needs a heading there and inventing one silently would
 * hide that it is ours and not the Company's.
 */
function parseDei(paras) {
  const SUPPLIED_FIRST_HEADING = "Dignified Employment & Staff Growth";
  const sections = [];
  let section = null;
  let expecting = null; // "policy" once a "Policy:" label has been seen

  for (const [i, { text, list }] of paras.entries()) {
    if (i === 0) continue; // document title

    if (list) {
      const { text: body, sdg } = splitSdg(text);
      section?.items.push({ text: body, sdg });
      continue;
    }

    if (/^policy:?$/i.test(text)) { expecting = "policy"; continue; }
    if (/^procedures:?$/i.test(text)) { expecting = null; continue; }

    // A long paragraph right after "Policy:", or the opening paragraph, is the
    // statement of intent rather than a heading.
    if (expecting === "policy" || (section === null && text.length > 120)) {
      if (!section) {
        section = { title: SUPPLIED_FIRST_HEADING, supplied: true, sdg: [], policy: "", items: [] };
        sections.push(section);
      }
      section.policy = text;
      expecting = null;
      continue;
    }

    // The DE&I headings carry their goals inline - "Community & Cultural
    // Inclusion (SDG 10 & 11)" - so the same parse applies, and the section
    // gets labels instead of a parenthetical.
    const { text: heading, sdg } = splitSdg(stripEmoji(text));
    section = { title: heading, supplied: false, sdg, policy: "", items: [] };
    sections.push(section);
  }
  return sections;
}

const esgParas = paragraphs("content-source/esg-policy.docx");
const deiParas = paragraphs("content-source/de-and-i-policies.docx");

const esg = parseEsg(esgParas);
const dei = parseDei(deiParas);

const esgTitle = stripEmoji(esgParas[0].text);
const deiTitle = stripEmoji(deiParas[0].text);

// Every SDG actually referenced, so the page can label them without carrying a
// list of all seventeen.
const used = new Set();
for (const s of esg) {
  for (const it of s.items) it.sdg.forEach((n) => used.add(n));
  for (const g of s.groups) for (const it of g.items) it.sdg.forEach((n) => used.add(n));
}
for (const s of dei) {
  s.sdg.forEach((n) => used.add(n));
  for (const it of s.items) it.sdg.forEach((n) => used.add(n));
}

const file = `/**
 * The Company's ESG and DE&I policies, as supplied.
 *
 * GENERATED FILE - do not edit by hand. Produced by scripts/import-policies.mjs
 * from the Word documents in content-source/. When the Company sends a revised
 * policy, replace the .docx and re-run:
 *
 *   npm run policies:import
 *
 * The wording is the Company's, transcribed by machine rather than by hand, so
 * that what this site publishes is what the Board approved. Two presentational
 * changes were made and no others:
 *
 *  * a trailing "(SDG 7, 13)" is parsed into \`sdg\`, so the goals appear as
 *    labels rather than as text repeated at the end of every sentence;
 *  * decorative emoji are dropped from three section headings, which the page
 *    replaces with the icon set used everywhere else on this site.
 *
 * Deliberately not in the database. These are board-approved documents reviewed
 * annually, in the same category as the audited figures in financials.ts: a
 * free-text field over a policy commitment invites an edit nobody approved.
 * They change through a release.
 */

export type PolicyItem = {
  text: string;
  /** UN Sustainable Development Goals the Company tags this commitment with. */
  sdg: number[];
};

export type PolicyGroup = {
  /** "2.1", from the source document's own numbering. */
  number: string;
  title: string;
  items: PolicyItem[];
};

export type PolicySection = {
  number: string;
  title: string;
  /** Commitments stated before any subsection. */
  items: PolicyItem[];
  groups: PolicyGroup[];
};

export type DeiSection = {
  title: string;
  /** Goals the Company tags this section with, taken from its heading. */
  sdg: number[];
  /**
   * True when the heading is ours rather than the Company's. The source
   * document's opening section runs under the document title with no heading of
   * its own, and a page needs one there.
   */
  supplied: boolean;
  /** The statement of intent under "Policy:". */
  policy: string;
  /** The lines under "Procedures:". */
  items: PolicyItem[];
};

/** Title as it appears on the Company's document. */
export const esgPolicyTitle = ${JSON.stringify(esgTitle)};

export const esgPolicySections: PolicySection[] = ${JSON.stringify(esg, null, 2)};

/** Title as it appears on the Company's document. */
export const deiPolicyTitle = ${JSON.stringify(deiTitle)};

export const deiPolicySections: DeiSection[] = ${JSON.stringify(dei, null, 2)};

/** Short names for the goals these policies actually reference. */
export const sdgNames: Record<number, string> = {
  1: "No Poverty",
  2: "Zero Hunger",
  3: "Good Health and Well-being",
  4: "Quality Education",
  5: "Gender Equality",
  6: "Clean Water and Sanitation",
  7: "Affordable and Clean Energy",
  8: "Decent Work and Economic Growth",
  9: "Industry, Innovation and Infrastructure",
  10: "Reduced Inequalities",
  11: "Sustainable Cities and Communities",
  12: "Responsible Consumption and Production",
  13: "Climate Action",
  14: "Life Below Water",
  15: "Life on Land",
  16: "Peace, Justice and Strong Institutions",
  17: "Partnerships for the Goals",
};

/** The goals referenced across both documents, ascending. */
export const sdgReferenced: number[] = ${JSON.stringify([...used].sort((a, b) => a - b))};
`;

writeFileSync("src/data/esg-policy.ts", file);

const count = (arr) => arr.reduce((n, s) => n + s.items.length + (s.groups?.reduce((m, g) => m + g.items.length, 0) ?? 0), 0);
console.log(`ESG policy : ${esg.length} sections, ${esg.reduce((n, s) => n + s.groups.length, 0)} subsections, ${count(esg)} commitments`);
console.log(`DE&I policy: ${dei.length} sections, ${count(dei)} procedures`);
console.log(`SDGs referenced: ${[...used].sort((a, b) => a - b).join(", ")}`);
console.log(`\nwrote src/data/esg-policy.ts`);
