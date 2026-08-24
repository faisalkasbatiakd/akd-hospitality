/**
 * The date carried by the Terms of Use and the Disclaimer.
 *
 * The Company gave no date for these pages, so this is the defensible one: the
 * day the text was last revised. It is labelled "Last updated" rather than
 * "Effective from" on purpose. "Last updated" is a statement of fact about this
 * website that we can stand behind. "Effective from" asserts a legal
 * commencement, and that is the Company's to declare, not ours to invent - the
 * wrong date on that label is a claim about when visitors became bound.
 *
 * A date matters more than it looks. Legal pages without one leave a reader
 * unable to tell whether they are reading current terms or something left over
 * from a previous site, and this site replaces one that ran for years.
 *
 * Revise this whenever the wording of either page changes, and only then. It is
 * one constant shared by both pages so the two can never drift apart and
 * disagree about when they were written.
 */
export const legalLastUpdated = new Date("2026-08-25T00:00:00Z");

/** "25 August 2026" - the form used in the Company's own filings. */
export const legalLastUpdatedLabel = legalLastUpdated.toLocaleDateString(
  "en-GB",
  { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" },
);

/** Machine-readable form for the <time> element: "2026-08-25". */
export const legalLastUpdatedIso = legalLastUpdated
  .toISOString()
  .slice(0, 10);
