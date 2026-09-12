export const company = {
  name: "AKD Hospitality Limited",
  formerName: "Formerly AKD Capital Limited",
  symbol: "AKDHL",
  exchange: "Pakistan Stock Exchange",
  incorporated: "1936",
  tagline:
    "A Pakistan Stock Exchange listed company with a tourism and hospitality mandate.",

  intro:
    "The Company was incorporated as a Public Limited Company in the year 1936 and its shares are quoted on the Pakistan Stock Exchange. The principal line of business of the Company shall be to carry on the tourism business including hospitality business, motels, destination management services, developing & building tourism attractions and to undertake all ancillary business activities to provide end to end service solutions.",

  vision:
    "To be the most competitive, focused, quality driven and growth oriented Company in Pakistan.",

  mission:
    "The mission of AKD Hospitality Limited is to grow the company in terms of quality and profitability with an emphasis on minimizing risk in order to optimize return to shareholders.",

  group: {
    title: "About AKD Group",
    body: [
      "Starting in 1947 with interests in real estate, followed by stock-broking, late Haji Abdul Karim Dhedhi (may he rest in peace) laid the foundation of what today is the AKD Group, one of the premier business enterprises in Pakistan.",
      "Mr. Aqeel Karim Dhedhi, son of (late) Haji Abdul Karim Dhedhi, is the Chairman of the Group. Led by the Chairman's vision, the group has evolved into a vibrant set of business enterprises operating in key sectors of Pakistan's economy, including financial services, telecom, infrastructure, manufacturing and natural resources.",
    ],
  },

  businesses: [
    {
      title: "Hospitality",
      description:
        "Hotels, business hotels, resorts and extended-stay formats identified within the Company's objects.",
    },
    {
      title: "Motels",
      description:
        "Roadside motels and inns serving travellers on routes between population centres.",
    },
    {
      title: "Destination Management",
      description:
        "Destination management services and the ancillary activities that support end-to-end travel.",
    },
    {
      title: "Tourism Attractions",
      description:
        "Developing and building tourism attractions, together with recreational facilities and activities.",
    },
  ],

  /**
   * The Company's stated position: market analysis and feasibility work rather
   * than operating assets. Sourced from the FY2025 annual report (pp. 21, 29)
   * and the Corporate Briefing Session decks of Nov 2024 and Nov 2025.
   */
  currentStage: {
    eyebrow: "Overview",
    heading: "A 1936 charter, redirected toward Pakistan's tourism opportunity",
    body: [
      "AKD Hospitality Limited was incorporated as a public limited company in 1936. In February 2021 the shareholders altered the Memorandum of Association, changing the Company's name from AKD Capital Limited and its principal line of business to the tourism and hospitality sector.",
      "The Company is presently at the study stage of that mandate. Market analysis is under way across locations, tourist categories, accommodation types and recreational facilities, and feasibilities are being developed for the formats that offer the strongest long-term return to shareholders.",
    ],
    /** Verbatim from the Nov 2025 Corporate Briefing Session deck, slide 22. */
    formatsUnderStudy: [
      "Hotels",
      "Business Hotels",
      "Resorts",
      "Lodges",
      "Extended Stay Hotels",
      "Aparthotels",
      "Inns",
      "Tented Camps",
      "Motels",
      "Farm Houses",
    ],
    /** Strategic objectives as listed in the FY2025 annual report, p. 5. */
    strategy: [
      "Enhance customers' experience",
      "Expand market presence",
      "Sustainability initiatives",
      "Leverage technology",
    ],
    /** Market analysis workstreams, Corporate Briefing Session deck slide 21. */
    workstreams: [
      {
        title: "Locations",
        description:
          "Locations identified across regions of Pakistan, with visitor-number studies in progress.",
      },
      {
        title: "Tourist Category",
        description:
          "Segmentation by age, gender, expenditure budget, aesthetics and length of stay.",
      },
      {
        title: "Types of Accommodation",
        description:
          "Accommodation formats matched to each location and customer category.",
      },
      {
        title: "Recreational Facilities",
        description:
          "Facilities and activities mapped against customer category and location.",
      },
    ],
    /**
     * Facts only - deliberately no financial figures. The FY2025 audit report
     * carries a material uncertainty relating to going concern, so growth
     * framing around financial results would be inappropriate here.
     */
    facts: [
      { value: "1936", label: "Incorporated" },
      { value: "2021", label: "Tourism mandate adopted" },
      { value: "AKDHL", label: "PSX symbol" },
    ],
  },

  stats: [
    { value: "1936", label: "Incorporated" },
    { value: "AKDHL", label: "PSX Symbol" },
    { value: "Public", label: "Listed Company" },
    { value: "Karachi", label: "Head Office" },
  ],

  companyInformation: [
    { label: "Company Secretary", value: ["Mr. Syed Haris Ahmed"] },
    { label: "Auditors", value: ["Riaz Ahmad & Co. - Chartered Accountants"] },
    { label: "Share Registrar", value: ["C & K Management Associates (Pvt) Limited"] },
    { label: "NTN No.", value: ["1335738-7"] },
    { label: "Registration No.", value: ["0000027"] },
    {
      label: "Bankers",
      value: ["MCB Bank Limited", "Bank Al-Habib Limited", "United Bank Limited"],
    },
  ],

  contact: {
    person: "Mr. Syed Haris Ahmed",
    role: "Company Secretary",
    address: [
      "511, 5th Floor, Continental Trade Centre,",
      "Main Clifton Road, Block 8, Clifton,",
      "Karachi, Pakistan.",
    ],
    phone: "(92-21) 35302963",
    fax: "(92-21) 35861662",
    email: "info@akdhospitality.com",
    investorEmail: "investor.relations@akdhospitality.com",
  },

  externalLinks: [
    { label: "Jama Punji", href: "https://jamapunji.pk/" },
    { label: "SECP Online Complaint (SDMS)", href: "https://sdms.secp.gov.pk/" },
    { label: "AKD Securities", href: "http://www.akdsecurities.net/about-akd.aspx" },
  ],
} as const;

/**
 * Imagery for the About section on the home page.
 * Served from the Unsplash CDN until the client provides photography.
 */
/**
 * Corporate milestones. Every entry is taken from the FY2025 annual report or
 * the Corporate Briefing Session decks - no dates are inferred.
 *
 *  1936 - annual report p. 4 and note 1.1, p. 92
 *  1947 - AKD Group founding, annual report / CBS deck slide 5
 *  2021 - EOGM special resolution of 1 February 2021, note 1.1, p. 92
 *  2024 - retainer service agreement, note 1.2(a), p. 92
 *  2025 - feasibilities under development, CBS Nov 2025 deck slide 22
 */
/**
 * Closing investor-relations panel.
 *
 * Deliberately not a careers panel: the FY2025 annual report records four
 * employees at year end (note 30, p. 117) and the Company publishes no
 * vacancies, so a recruitment call to action would not be truthful. Investor
 * relations is the audience this company actually addresses.
 */
/**
 * Sustainability and ESG, as disclosed in the FY2025 annual report.
 *
 * The Company publishes no list of "corporate values", so none is invented
 * here. What it does publish is a four-pillar ESG framework (p. 47) and a set
 * of ESG metrics (p. 50), reported under the SECP's voluntary ESG guidelines.
 * Several of the Company's own statements are forward looking - it uses "we
 * plan to" and "we aim to" - and that framing is preserved rather than
 * rewritten as present achievement.
 */
/**
 * Chairperson's Review, FY2025 annual report pp. 17-18.
 *
 * Everything attributed to the Chairperson below is quoted verbatim from that
 * review - nothing is paraphrased into his voice. No photograph of the
 * Chairperson exists in any published Company document, so the panel beside the
 * quote carries verified board facts instead of a portrait; a stock photograph
 * of an unrelated person must never stand in for a named director.
 */
export const chairpersonReview = {
  eyebrow: "Chairperson's Review",
  heading: "Board performance and oversight",

  /** Verbatim sentences from the review. */
  quotes: [
    "The Board of Directors of the Company has performed their duties meticulously in safeguarding the best interest of the shareholders of the Company and has managed the affairs of the Company in an effective and efficient manner, towards achieving its objective, in accordance with applicable laws and regulations.",
    "The composition of the Board of Directors reflects mix of varied backgrounds and highly experienced individuals in the fields of Finance, Audit, Business and Banking and law.",
  ],

  /** Verbatim pull quote. */
  pullQuote:
    "The Board is fully involved in company's progress and provides strategic direction to the management and will continue to play its role in ensuring high standards of governance.",

  signatory: "Nadeem Saulat Siddiqui",
  signatoryRole: "Chairperson",
  place: "Karachi",
  date: "4 October 2025",

  /**
   * Board facts, all verified: composition and female/male split from the
   * annual report (p. 22 and the social metrics table, p. 50), meeting
   * frequency from the review itself, committees from p. 4.
   */
  boardFacts: [
    { value: "7", label: "Directors on the Board" },
    { value: "2 / 5", label: "Female / male directors" },
    { value: "3", label: "Board committees" },
    { value: "Quarterly", label: "Minimum meeting frequency" },
  ],
} as const;

export const esg = {
  eyebrow: "Sustainability",
  heading: "Our ESG framework",
  intro:
    "The Company has voluntarily adopted the Sustainable Development Goals and reports against the SECP's voluntary ESG guidelines. During the year the Board assumed additional responsibilities for sustainability, including review of ESG performance and alignment with Regulation 10A of the Listed Companies (Code of Corporate Governance) Regulations, 2019.",

  /** Four pillars approach to ESG - annual report p. 47. */
  pillars: [
    {
      title: "Governance",
      description:
        "The Board, with its mix of independent, non-executive and executive members, provides oversight and strategic direction, and reviews ESG performance directly.",
    },
    {
      title: "Strategy",
      description:
        "Relevant Sustainable Development Goals have been adopted in strategic planning, prioritised where the Company's activities are expected to have the biggest impact.",
    },
    {
      title: "Risk Management",
      description:
        "A sustainability risk and opportunity matrix covers energy and climate, water, waste, employee welfare, diversity, guest safety, communities, data privacy and ethics.",
    },
    {
      title: "Metrics & Targets",
      description:
        "Environmental and social indicators are measured and reported annually, together with the policies that govern waste, water, energy, recycling and sourcing.",
    },
  ],

  /**
   * Reported ESG metrics - annual report p. 50. Figures are small because the
   * Company operates a single office; they are published as disclosed.
   */
  metrics: [
    { value: "Zero", label: "Scope 1 GHG emissions" },
    { value: "1 ton", label: "Scope 2 CO₂ emissions" },
    { value: "1,500 kWh", label: "Direct energy use" },
    { value: "1,000 USG", label: "Water consumed in the year" },
  ],

  /** Policies in place, per the environmental and social metric tables, p. 50. */
  policies: [
    "Formal environmental policy covering waste, water, energy and recycling",
    "Sustainable sourcing policy for responsible procurement",
    "Health and safety policy",
    "Anti-harassment and diversity, equity and inclusion policies",
    "Confidential grievance mechanism supervised by a female director",
  ],
} as const;

export const investorPanel = {
  eyebrow: "Investor Relations",
  heading: "Investor Information",
  body: "Annual and quarterly financial statements, free float disclosures, shareholder notices and corporate briefing materials, published under the symbol AKDHL.",
  ctaLabel: "View Reports",
  ctaHref: "/investors",
  image:
    "https://images.unsplash.com/photo-1759323050124-eb669cec0b72?auto=format&fit=crop&w=1600&q=80",
  imageAlt:
    "Aerial view of the Karachi coastline, where the Company's registered office is located",
} as const;

export const milestones = [
  {
    year: "1936",
    title: "Incorporated",
    description:
      "Incorporated in Karachi as a public limited company under the Companies Act, 1913.",
  },
  {
    year: "1947",
    title: "AKD Group founded",
    description:
      "Late Haji Abdul Karim Dhedhi lays the foundation of the AKD Group, beginning with real estate.",
  },
  {
    year: "2021",
    title: "Tourism mandate adopted",
    description:
      "Renamed from AKD Capital Limited, with the principal line of business changed to tourism and hospitality.",
  },
  {
    year: "2024",
    title: "Service agreement executed",
    description:
      "Retainer agreement entered into for the review of hospitality feasibility studies.",
  },
  {
    year: "2025",
    title: "Feasibilities under development",
    description:
      "Market analysis and feasibility studies progressed across ten accommodation formats.",
  },
] as const;

/**
 * Imagery for the lines of business on the About page. Landscape and interior
 * photography only - none of these are AKD properties, so they illustrate the
 * category rather than claiming an asset.
 */
/**
 * Supporting imagery for the About page sections that were text-only.
 * Landscape photography, illustrating the sector rather than any AKD asset.
 */
/**
 * Imagery for the Media page cards.
 *
 * An empty boardroom and an empty office interior on purpose. Every "big event"
 * photograph on Unsplash implies a scale this Company does not have - the
 * FY2025 corporate briefing was held in a single office room - and photographs
 * containing people would read as AKD staff, of whom there are four.
 */
export const mediaSectionMedia = {
  agm: {
    image:
      "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1200&q=80",
    alt: "Empty boardroom with a long table and city view",
  },
  briefing: {
    image:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
    alt: "Bright office interior with a laptop on a window counter",
  },
} as const;

/** Supporting image for the Investors page shareholding block. */
export const investorMedia = {
  image:
    "https://images.unsplash.com/photo-1617373743747-3bb331fd4e8d?auto=format&fit=crop&w=1200&q=80",
  alt: "Concrete office towers under a clear sky",
} as const;

export const aboutSectionMedia = {
  strategy: {
    image:
      "https://images.unsplash.com/photo-1662800291212-5d31184b861c?auto=format&fit=crop&w=1200&q=80",
    alt: "Still mountain lake ringed by high peaks",
  },
  esg: {
    image:
      "https://images.unsplash.com/photo-1632133915653-8ded5c72e329?auto=format&fit=crop&w=1200&q=80",
    alt: "Glacial lake below a mountain range",
  },
  marketAnalysis: {
    image:
      "https://images.unsplash.com/photo-1667922210719-566cbfec2b11?auto=format&fit=crop&w=1200&q=80",
    alt: "River valley between mountain ranges in northern Pakistan",
  },
} as const;

export const businessMedia: Record<string, { image: string; alt: string }> = {
  Hospitality: {
    image:
      "https://images.unsplash.com/photo-1742844552193-2fd3425cd26d?auto=format&fit=crop&w=1000&q=80",
    alt: "Sunlit hotel lobby with seating and tall windows",
  },
  Motels: {
    image:
      "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?auto=format&fit=crop&w=1000&q=80",
    alt: "Timber lodge beside trees below a mountain",
  },
  "Destination Management": {
    image:
      "https://images.unsplash.com/photo-1514558427911-8e293bebf18c?auto=format&fit=crop&w=1000&q=80",
    alt: "Aerial view of a river route winding through mountains",
  },
  "Tourism Attractions": {
    image:
      "https://images.unsplash.com/photo-1659607168553-197baa0ae9d5?auto=format&fit=crop&w=1000&q=80",
    alt: "Visitors riding a cable car at a mountain attraction",
  },
};

export const overviewMedia = {
  primary: {
    image:
      "https://images.unsplash.com/photo-1667922210719-566cbfec2b11?auto=format&fit=crop&w=1600&q=80",
    alt: "A river running through a broad valley between mountain ranges in northern Pakistan",
  },
  secondary: {
    image:
      "https://images.unsplash.com/photo-1632133915653-8ded5c72e329?auto=format&fit=crop&w=1600&q=80",
    alt: "A mountain range rising behind a still glacial lake",
  },
} as const;

export const aboutMedia = {
  vision: {
    image:
      "https://images.unsplash.com/photo-1597350340158-6b2c2ff93a3e?auto=format&fit=crop&w=1400&q=80",
    alt: "Forested valley beside a lake in the mountains of northern Pakistan",
  },
  mission: {
    image:
      "https://images.unsplash.com/photo-1742844552700-3926862c5311?auto=format&fit=crop&w=1400&q=80",
    alt: "Elegant hotel interior opening onto a landscaped outdoor view",
  },
} as const;
