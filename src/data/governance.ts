/* ---------------------------------------------------------------------------
 * EDITING THIS FILE CHANGES NOTHING ON THE WEBSITE.
 *
 * It fills a brand-new, empty database once. The live site reads this content
 * from the database, and the seed refuses to run against a database that
 * already has rows - so a change here is never picked up by a deploy.
 *
 * To change what visitors see, use the dashboard:
 *   https://www.akdhospitality.com/admin
 * ------------------------------------------------------------------------- */

/**
 * Board, officers and committees.
 *
 * Every name, role and biography below is taken from the FY2025 annual report:
 * the board and committee composition from the Company Information page (p. 4),
 * and the biographies from the Board of Directors pages (pp. 14-15).
 *
 * This file previously carried the board from the Company's old website, which
 * was years out of date - it named six people who are not on the Board and
 * attributed the office of Chief Executive to someone who does not hold it.
 * For a listed company that is not a cosmetic error, so nothing here is kept
 * unless the annual report states it.
 *
 * Two spellings that look like typos but are not: the Chief Executive is
 * "Paracha" and the independent director is "Piracha". The annual report is
 * consistent on both (pp. 4, 14, 15, 18, 23, 24).
 */

export type Director = {
  name: string;
  role: string;
  bio?: string;
};

/** Board of Directors, annual report p. 4. */
export const boardOfDirectors: Director[] = [
  { name: "Mr. Nadeem Saulat Siddiqui", role: "Chairperson" },
  { name: "Ms. Huma Khurram Rashid Paracha", role: "Director / Chief Executive Officer" },
  { name: "Mr. Kanwar Adeel Zaman", role: "Director" },
  { name: "Mr. Muhammad Siddiq Khokhar", role: "Independent Director" },
  { name: "Mr. Muhammad Sohail", role: "Non-Executive Director" },
  { name: "Mr. Aamir Nazir Dhedhi", role: "Non-Executive Director" },
  { name: "Ms. Uzma Piracha", role: "Independent Director" },
];

/** Officers of the Company, annual report p. 4. */
export const officers: Director[] = [
  { name: "Mr. Syed Haris Ahmed", role: "Company Secretary" },
  { name: "Mr. Faisal Kasbati", role: "Chief Financial Officer" },
  { name: "Mr. Muhammad Gulraiz", role: "Head of Internal Audit" },
];

/**
 * Director biographies, annual report pp. 14-15, condensed from the Company's
 * own text. Order follows the Board listing on p. 4.
 */
export const directorProfiles: Director[] = [
  {
    name: "Mr. Nadeem Saulat Siddiqui",
    role: "Chairperson",
    bio: "Mr. Nadeem Saulat is a certified director and has served as Chairperson of the Board of Directors at AKD Hospitality Limited. An experienced executive with a demonstrated history of working in the investment management industry, he is skilled in negotiation, public relations, business planning and analytical work, with a background in banking. He holds a Master of Business Administration focused in Marketing and Sales from the College of Business Administration.",
  },
  {
    name: "Ms. Huma Khurram Rashid Paracha",
    role: "Chief Executive Officer",
    bio: "Ms. Huma holds a Master of Business Administration from the Institute of Business Administration (IBA) and has attended conferences outside Pakistan. She has local and international work experience, including as Head Coordinator at Imam University in Riyadh, Saudi Arabia. Her skills include marketing, business management, business planning, people management, training and motivational coaching. She is passionate about social welfare, especially in the education sector, and has volunteered with The Citizens Foundation.",
  },
  {
    name: "Mr. Kanwar Adeel Zaman",
    role: "Director",
    bio: "Mr. Kanwar Adeel Zaman has over seventeen years of experience in administration, finance and business management. He has served in national and international organisations in Pakistan and the UAE and works as an independent freelance consultant offering services in legal, account and audit, and system stress testing and user acceptance testing. He has taken training courses at the Centre for Executive Education (IBA) and the Institute of Security Management and Research. He is a certified director and has served as a member of the Audit Committee and the Risk Management Committee of AKD Hospitality Limited.",
  },
  {
    name: "Mr. Muhammad Siddiq Khokhar",
    role: "Independent Director",
    bio: "Mr. Muhammad Siddiq Khokhar holds Master's degrees in Economics and Islamic Studies and an LL.M. from the University of Karachi. He is a member of the Karachi Bar Association, enrolled with the Sindh Bar Council, and an Advocate of the High Court practising in civil, criminal, corporate and labour matters. He attained the position of Senior Economist at PCSIR, Ministry of Science and Technology, Government of Pakistan. He is a certified director under the corporate governance requirements, and has served as Chairperson of the Audit Committee and the Risk Management Committee and a member of the Human Resources Committee of AKD Hospitality Limited.",
  },
  {
    name: "Mr. Muhammad Sohail",
    role: "Non-Executive Director",
    bio: "Mr. Sohail is a businessman with more than thirty years of experience in real estate, from land development to the construction and renovation of buildings and the sale or lease of the finished product to end users. He specialises in real estate valuation and identifying undervalued properties, assessing a property on its economic value and cash flows as well as its physical nature, location and improvements. He has completed numerous real estate projects in Pakistan and overseas. He holds an LL.B., and has served as a member of the Risk Management Committee of AKD Hospitality Limited.",
  },
  {
    name: "Mr. Aamir Nazir Dhedhi",
    role: "Non-Executive Director",
    bio: "Mr. Aamir is a businessman currently focusing on copper, gold and lithium mining and processing using locally available workforce and technology. He began dealing stocks at the Karachi Stock Exchange at the age of fourteen and became the youngest agent at the KSE. He has served as a director at the board of Friendly Securities and at AKD Hospitality Limited, and as a member of the Audit Committee and the Human Resource and Remuneration Committee. He has also run an import and export business, mainly in consumer goods.",
  },
  {
    name: "Ms. Uzma Piracha",
    role: "Independent Director",
    bio: "Ms. Uzma Piracha is an Independent Director with over fifteen years of experience in administration, finance and management. She passed the Central Superior Services (CSS) examinations and served as Assistant Commissioner in Jamshed Town and SITE Town in Karachi, as Deputy Director in government organisations, and with the Asian Development Bank as Section Officer. She has attended training courses at the International Finance Corporation and Habib University. She is a certified director and has served as Chairperson of the Human Resource and Remuneration Committee of AKD Hospitality Limited.",
  },
];

export type CommitteeMember = {
  name: string;
  /** Chairperson, Member or Secretary, exactly as recorded on p. 4. */
  role: "Chairperson" | "Member" | "Secretary";
  /**
   * Independence designation as published: ID for independent director, NE for
   * non-executive. Absent where the Company does not state one.
   */
  designation?: "ID" | "NE";
  note?: string;
};

/**
 * Board committees, annual report p. 4.
 *
 * Roles are published, not inferred: the chair of each committee is stated in
 * the report, and the Audit Committee's secretary is the Head of Internal
 * Audit. The Management Committee is included because the Company lists it
 * alongside the board committees.
 */
export const committees: {
  title: string;
  members: readonly CommitteeMember[];
}[] = [
  {
    title: "Audit Committee",
    members: [
      { name: "Mr. Muhammad Siddiq Khokhar", role: "Chairperson", designation: "ID" },
      { name: "Mr. Aamir Nazir Dhedhi", role: "Member", designation: "NE" },
      { name: "Ms. Uzma Piracha", role: "Member", designation: "ID" },
      { name: "Mr. Muhammad Gulraiz", role: "Secretary", note: "Head of Internal Audit" },
    ],
  },
  {
    title: "Human Resource and Remuneration Committee",
    members: [
      { name: "Ms. Uzma Piracha", role: "Chairperson", designation: "ID" },
      { name: "Mr. Aamir Nazir Dhedhi", role: "Member", designation: "NE" },
      { name: "Mr. Muhammad Siddiq Khokhar", role: "Member", designation: "ID" },
    ],
  },
  {
    title: "Risk Management and Sustainability Committee",
    members: [
      { name: "Mr. Muhammad Siddiq Khokhar", role: "Chairperson", designation: "ID" },
      { name: "Mr. Kanwar Adeel Zaman", role: "Member", designation: "NE" },
      { name: "Mr. Muhammad Sohail", role: "Member", designation: "NE" },
    ],
  },
  {
    title: "Management Committee",
    members: [
      { name: "Ms. Huma Khurram Rashid Paracha", role: "Chairperson", note: "Director / Chief Executive" },
      { name: "Mr. Faisal Kasbati", role: "Member", note: "Chief Financial Officer" },
    ],
  },
];

export const electionOfDirectors = {
  passwordNote:
    "For the password, please contact Mr. Syed Haris Ahmed, Company Secretary, at info@akdhospitality.com or (92-21) 35302963.",
  profiles: [
    "Mr. Nadeem Saulat Siddiqui (Chairperson)",
    "Ms. Huma Khurram Rashid Paracha (Director / Chief Executive Officer)",
    "Mr. Kanwar Adeel Zaman (Director)",
    "Mr. Muhammad Siddiq Khokhar (Independent Director)",
    "Mr. Muhammad Sohail (Non-Executive Director)",
    "Mr. Aamir Nazir Dhedhi (Non-Executive Director)",
    "Ms. Uzma Piracha (Independent Director)",
  ],
};

export const genderDiversity = {
  title: "Gender Diversity",
  body: "AKD Hospitality Limited is committed to maintaining a diverse and inclusive workplace. The Company reports on gender diversity in line with the requirements of the Securities and Exchange Commission of Pakistan, including the gender pay gap statement issued under Circular 10 of 2024.",
};

/**
 * Diagrams lifted from the FY2025 annual report (pp. 66 and 69). These are the
 * Company's own artwork, not stock illustration, which is why they are worth
 * showing on this page.
 */
export const governanceDiagrams = [
  {
    src: "/governance/risk-management-framework.png",
    alt: "Diagram of the Company's risk management framework: risk-reward strategy, risk governance, risk management process and risk assurance, leading from strategic objectives to risk-informed decisions",
    title: "Our risk management framework",
    caption:
      "Four layers run from strategic objectives through to risk-informed decisions. Reproduced from the FY2025 annual report, page 66.",
  },
  {
    src: "/governance/emerging-threats.png",
    alt: "Wheel diagram of emerging threats and risk drivers grouped into market, social and geo-political, technology, and financial, legal and regulatory quadrants",
    title: "Emerging threats and risk drivers",
    caption:
      "Threats mapped by category and time horizon, from imminent to beyond two years. Reproduced from the FY2025 annual report, page 69.",
  },
] as const;
