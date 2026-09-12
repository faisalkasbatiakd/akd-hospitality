/**
 * Financial data for the Investors page.
 *
 * Every figure is taken from the FY2025 annual report and is cited to a page.
 * Nothing here is derived or estimated.
 *
 * `goingConcernNotice` below is no longer rendered. It was published above the
 * figures until September 2026 and removed at the client's request. The text is
 * kept here, sourced and ready, so restoring it is a matter of rendering it
 * again rather than rewriting it.
 */

export const financialSnapshot = {
  periodLabel: "Audited, year ended 30 June 2025",
  source: "FY2025 annual report, pp. 88-89",
  items: [
    { label: "Revenue", value: "Rs 6.00 m", note: "Consultancy services, net of sales tax" },
    { label: "Profit after tax", value: "Rs 1.27 m", note: "FY2024: Rs 8.36 m" },
    { label: "Earnings per share", value: "Rs 0.51", note: "FY2024: Rs 3.33" },
    { label: "Total assets", value: "Rs 45.04 m", note: "FY2024: Rs 32.13 m" },
    { label: "Total equity", value: "Rs 37.02 m", note: "FY2024: Rs 23.29 m" },
    { label: "Dividend", value: "Nil", note: "None declared for FY2025" },
  ],
} as const;

/**
 * Six-year operating and financial data, annual report p. 16.
 * All amounts in Rupees '000; loss figures are shown in brackets as published.
 */
export const sixYearData = {
  caption: "Rupees in '000, except earnings per share",
  source: "FY2025 annual report, p. 16",
  years: ["2025", "2024", "2023", "2022", "2021", "2020"],
  rows: [
    { label: "Operating income", values: ["6,000", "6,000", "3,600", "2,500", "3,684", "2,729"] },
    { label: "Operating profit / (loss)", values: ["1,423", "9,481", "(4,785)", "(2,859)", "(9,235)", "(2,927)"] },
    { label: "Net profit / (loss)", values: ["1,266", "8,360", "(4,961)", "(2,817)", "(9,855)", "(2,868)"] },
    { label: "Total comprehensive profit / (loss)", values: ["13,730", "12,198", "(14,461)", "(19,441)", "6,951", "(8,952)"] },
    { label: "Total assets", values: ["45,039", "32,128", "16,917", "27,138", "44,614", "29,991"] },
    { label: "Earnings / (loss) per share (Rs)", values: ["0.51", "3.33", "(1.98)", "(1.12)", "(3.93)", "(1.14)"] },
  ],
} as const;

/** Categories of shareholders as at 30 June 2025, annual report p. 12. */
export const shareholding = {
  asAt: "As at 30 June 2025",
  source: "FY2025 annual report, p. 12",
  totalShareholders: "715",
  totalShares: "2,506,992",
  categories: [
    { label: "Associated companies, undertakings and related parties", holders: "5", shares: "1,435,452", percent: 57.26 },
    { label: "General public - local", holders: "693", shares: "777,107", percent: 31.0 },
    { label: "Other joint stock companies", holders: "7", shares: "275,249", percent: 10.98 },
    { label: "Directors, CEO, their spouses and minor children", holders: "7", shares: "18,101", percent: 0.72 },
    { label: "Non-banking financial companies", holders: "1", shares: "495", percent: 0.02 },
    { label: "Insurance companies", holders: "1", shares: "300", percent: 0.01 },
    { label: "Others", holders: "1", shares: "288", percent: 0.01 },
  ],
  /** Holders of 10% or more voting interest, annual report p. 13. */
  major: [
    { name: "Aqeel Karim Dhedhi", shares: "748,232", percent: "29.85%" },
    { name: "AKD Securities Limited", shares: "306,290", percent: "12.22%" },
  ],
} as const;

/** Capital structure, annual report p. 88 and note 12, p. 107. */
export const capital = [
  { label: "Authorised capital", value: "Rs 1,000,000,000", note: "100,000,000 ordinary shares of Rs 10 each" },
  { label: "Issued, subscribed and paid-up capital", value: "Rs 25,072,733", note: "Ordinary shares of Rs 10 each" },
];

/**
 * Verbatim substance of the auditor's Material Uncertainty paragraph (p. 84)
 * and the related going-concern note (note 1.2, p. 92).
 */
export const goingConcernNotice = {
  title: "Material uncertainty relating to going concern",
  body: "The independent auditor's report on the FY2025 financial statements includes a Material Uncertainty Relating to Going Concern paragraph. The Company's own note records that its operations at reasonable scale in its principal line of business “are at halt since long”, and that the going-concern basis rests on a retainer service agreement and continued sponsor support. The figures on this page should be read together with the full financial statements and the auditor's report.",
  source: "FY2025 annual report, p. 84 and note 1.2, p. 92",
};
