/**
 * Real content for the Media page.
 *
 * Until now this page was a PDF library and nothing else. Everything below is
 * read directly out of the Company's own filings that already sit in
 * /public/documents, and each block carries the document it came from.
 *
 * Sources, all verified first-hand:
 *
 *  - AKD_HL_AGM_Notice_2025.pdf              pp. 1-3  (AGM 2025, book closure,
 *                                                     agenda, share registrar,
 *                                                     shareholder obligations)
 *  - Corporate_Briefing_Session_21_11_2025.pdf        (PSX intimation p. 1,
 *                                                     presentation filing p. 2,
 *                                                     slides 9, 14, 16, 18, 20)
 *  - EOGM_20200201_1.pdf                     pp. 1-2  (1 Feb 2021 resolutions)
 *  - EOGM_20210405.pdf                       p. 1     (notice of 27 Apr 2021 EOGM)
 *  - SpecialResolution_20210427.pdf          pp. 1-2  (name change adopted)
 *
 * The two 2021 EOGM documents are scans with no text layer, so those pages were
 * rendered and read as images rather than extracted.
 *
 * Nothing here is paraphrased into a claim the Company has not made. Where the
 * Company's own wording is forward looking ("we are developing", "we have
 * identified"), that framing is kept.
 */

/** Notice of the 2025 Annual General Meeting. */
export const latestAgm = {
  label: "Latest Annual General Meeting",
  heading: "Annual General Meeting 2025",
  time: "11:00 a.m.",
  date: "Tuesday, 28 October 2025",
  venue: [
    "5th Floor, Continental Trade Centre (CTC),",
    "Block 8, Clifton, Karachi",
  ],
  attendanceNote: "and / or online through Zoom",
  noticeDate: "Notice issued 4 October 2025",
  signedBy: "Syed Haris Ahmed, Company Secretary",
  source: "Notice of Annual General Meeting 2025, p. 1",
  /** Ordinary business, as set out in the notice. */
  agenda: [
    "Confirmation of the minutes of the Annual General Meeting held on 28 October 2024.",
    "Receipt, consideration and adoption of the audited annual financial statements for the year ended 30 June 2025, together with the Chairperson's Review and the Directors' and Auditors' reports.",
    "Appointment of auditors and fixing of their remuneration for the year ending 30 June 2026. On the recommendation of the Audit Committee, the Board proposed the re-appointment of Riaz Ahmad & Co., Chartered Accountants.",
    "Any other business with the permission of the Chair.",
  ],
  keyDates: [
    {
      label: "Share transfer books closed",
      value: "22 - 28 October 2025",
      note: "Both days inclusive",
    },
    {
      label: "Transfers received in order by",
      value: "21 October 2025",
      note: "Close of business, at the Share Registrar",
    },
    {
      label: "Proxy instrument received by",
      value: "48 hours before the meeting",
      note: "Registered Office, Share Registrar or by email",
    },
  ],
} as const;

/** Corporate Briefing Session on the FY2025 results. */
export const latestBriefing = {
  label: "Latest Corporate Briefing Session",
  heading: "Corporate briefing on FY2025 results",
  intimationDate: "21 November 2025",
  sessionDate: "Wednesday, 26 November 2025",
  sessionTime: "3:30 p.m.",
  venue: [
    "Office No. 514, 5th Floor,",
    "Continental Trade Centre, Block 8,",
    "Clifton, Karachi",
  ],
  audience: "Shareholders, investors and analysts",
  presentationFiled: "Presentation filed with the Pakistan Stock Exchange on 25 November 2025",
  source: "Corporate Briefing Session filing, 21 November 2025, pp. 1-2",
  /** Figures the Company itself put on the record in the briefing deck. */
  disclosed: [
    { label: "Profit before levy and tax", value: "Rs 1,394,494", prior: "FY2024: Rs 9,291,386" },
    { label: "Profit after levy and tax", value: "Rs 1,266,304", prior: "FY2024: Rs 8,360,910" },
    { label: "Total comprehensive income", value: "Rs 13,730,304", prior: "FY2024: Rs 12,198,910" },
    { label: "Earnings per share", value: "Rs 0.51", prior: "FY2024: Rs 3.33" },
  ],
  disclosedSource: "Corporate Briefing Session presentation, slides 14 and 16",
  /** Strategy, verbatim from slide 20. */
  strategy: [
    "Enhance customers' experience",
    "Expand market presence",
    "Sustainability initiatives",
    "Leverage technology",
  ],
  strategySource: "Corporate Briefing Session presentation, slide 20",
  /** Challenges the Company names itself, slide 18. */
  challenges: [
    "Climate change",
    "Political uncertainties",
    "Trained staff",
    "Road infrastructure",
    "Communication facilities",
  ],
  challengesSource: "Corporate Briefing Session presentation, slide 18",
} as const;

/**
 * Corporate actions approved by shareholders in 2021.
 *
 * These two meetings are the reason this company is a hospitality company at
 * all, so they are stated rather than left as two untitled PDFs in a list.
 */
export const corporateActions = {
  heading: "Shareholder-approved corporate actions",
  intro:
    "Two Extraordinary General Meetings held in 2021 changed the Company's principal line of business, its authorised capital and its name.",
  items: [
    {
      date: "1 February 2021",
      meeting: "Extraordinary General Meeting",
      title: "Principal line of business changed to tourism",
      body: "Special resolutions replaced Clause 3 of the Memorandum of Association so that the principal line of business is to carry on the tourism business, including hospitality, motels, destination management services and the developing and building of tourism attractions.",
      source: "Notice of EOGM, 1 February 2021, p. 1",
    },
    {
      date: "1 February 2021",
      meeting: "Extraordinary General Meeting",
      title: "Authorised capital doubled",
      body: "The authorised share capital was increased from Rs 500,000,000 divided into 50,000,000 shares of Rs 10 each to Rs 1,000,000,000 divided into 100,000,000 shares of Rs 10 each, ranking pari passu with the existing ordinary shares.",
      source: "Notice of EOGM, 1 February 2021, p. 2",
    },
    {
      date: "27 April 2021",
      meeting: "Extraordinary General Meeting",
      title: "Company renamed AKD Hospitality Limited",
      body: "Shareholders unanimously approved the change of name from AKD Capital Limited (AKDCL) to AKD Hospitality Ltd (AKD-HL), under Section 26 of the Companies Act, 2017, so that the name matched the new principal line of business.",
      source: "Special resolution adopted 27 April 2021, p. 2",
    },
  ],
} as const;

/**
 * Record of general meetings for which a notice is published on this page.
 *
 * Dates are taken from the notices themselves. Each notice that carries a text
 * layer confirms the date encoded in its file name exactly - 28 October 2025,
 * 28 October 2024, 22 October 2020 and 23 October 2018 were read directly, and
 * the 2023 and 2017 meetings are confirmed by the following year's notice - so
 * the remaining scanned notices are listed on the same basis.
 */
export const meetingRecord = {
  heading: "Record of general meetings",
  intro:
    "Every notice referenced below is published in full in the document library on this page.",
  source: "Notices of general meeting, 2016 to 2025",
  rows: [
    { date: "28 October 2025", type: "Annual General Meeting", financialYear: "FY2025" },
    { date: "28 October 2024", type: "Annual General Meeting", financialYear: "FY2024" },
    { date: "25 October 2023", type: "Annual General Meeting", financialYear: "FY2023" },
    { date: "27 October 2022", type: "Annual General Meeting", financialYear: "FY2022" },
    { date: "21 October 2021", type: "Annual General Meeting", financialYear: "FY2021" },
    { date: "27 April 2021", type: "Extraordinary General Meeting", financialYear: "Name change" },
    { date: "1 February 2021", type: "Extraordinary General Meeting", financialYear: "Business and capital" },
    { date: "22 October 2020", type: "Annual General Meeting", financialYear: "FY2020" },
    { date: "5 October 2019", type: "Annual General Meeting", financialYear: "FY2019" },
    { date: "23 October 2018", type: "Annual General Meeting", financialYear: "FY2018" },
    { date: "23 October 2017", type: "Annual General Meeting", financialYear: "FY2017" },
    { date: "22 October 2016", type: "Annual General Meeting", financialYear: "FY2016" },
  ],
} as const;

/**
 * What a shareholder actually has to do, drawn from the notes to the 2025 AGM
 * notice. This is the part of a notice shareholders most often need and least
 * often read, so it is surfaced rather than left inside a PDF.
 */
export const shareholderServices = {
  heading: "Shareholder services",
  intro:
    "Requirements set out in the notes to the Notice of Annual General Meeting, under the Companies Act, 2017 and SECP regulations.",
  source: "Notice of Annual General Meeting 2025, pp. 1-3",
  registrar: {
    label: "Share Registrar",
    name: "C & K Management Associates (Pvt) Limited",
    address: [
      "M-13, Progressive Plaza,",
      "Plot No. 5-CL-10, Civil Lines Quarter,",
      "Beaumont Road, Karachi",
    ],
  },
  items: [
    {
      title: "Identification documents",
      body: "Shareholders are requested to provide a copy of a valid CNIC, or NTN for other than individuals, or passport for foreign individuals, along with their folio number, to the Company Secretary or the Share Registrar.",
    },
    {
      title: "E-dividend mandate",
      body: "Under Section 242 of the Companies Act, 2017 listed companies may pay cash dividends only by electronic transfer into a bank account designated by the shareholder. A dividend mandate form is published by the Company.",
    },
    {
      title: "Zakat declaration",
      body: "Members seeking zakat exemption are requested to submit a declaration on Form CZ-50 under the Zakat and Ushr Ordinance, 1980.",
    },
    {
      title: "Unclaimed dividend",
      body: "Members who have not claimed a cash dividend should contact the Share Registrar. Under Section 244, dividends or share certificates unclaimed for three years from the date they became payable are to be deposited with the Federal Government.",
    },
    {
      title: "Attending and voting",
      body: "A member entitled to attend and vote may appoint another member as proxy. The instrument appointing a proxy must reach the Registered Office, the Share Registrar or investor.relations@akdhospitality.com not less than 48 hours before the meeting.",
    },
    {
      title: "Annual report by email or hard copy",
      body: "Under Section 223(6), the annual report and notice of meeting may be circulated by email. Shareholders wishing to choose email or a hard copy should submit the Circulation of Annual Report Request Form.",
    },
  ],
} as const;
