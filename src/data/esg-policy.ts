/**
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
 *  * a trailing "(SDG 7, 13)" is parsed into `sdg`, so the goals appear as
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
export const esgPolicyTitle = "ESG Policy – AKD Hospitality Group";

export const esgPolicySections: PolicySection[] = [
  {
    "number": "1",
    "title": "Introduction",
    "items": [
      {
        "text": "At AKD Hospitality Group, we believe hospitality must extend beyond serving guests to include serving the planet, our employees, and the communities we operate in. This policy represents our long-term commitment to embedding sustainability, responsibility, and ethics in every aspect of our operations.",
        "sdg": [
          12,
          16,
          17
        ]
      },
      {
        "text": "This ESG Policy applies to all employees, suppliers, contractors, and business partners, ensuring that everyone connected to our organization upholds the same standards of environmental care, social responsibility, and ethical governance.",
        "sdg": [
          8,
          16,
          17
        ]
      },
      {
        "text": "We align our practices with the United Nations Sustainable Development Goals (SDGs), disclose our performance under the Global Reporting Initiative (GRI), and measure outcomes against the SASB Hospitality & Lodging Standards, providing a robust framework for accountability and transparency.",
        "sdg": [
          12,
          16,
          17
        ]
      }
    ],
    "groups": []
  },
  {
    "number": "2",
    "title": "Environmental Policies",
    "items": [],
    "groups": [
      {
        "number": "2.1",
        "title": "Energy & Climate Action",
        "items": [
          {
            "text": "Annual energy audits will be carried out across all properties to assess efficiency and identify areas for improvement.",
            "sdg": [
              7,
              13
            ]
          },
          {
            "text": "Smart energy meters and monitoring systems will be installed across all hotels and facilities to enable real-time tracking of energy consumption.",
            "sdg": [
              7,
              9,
              13
            ]
          },
          {
            "text": "By 2025, 100% of lighting across our properties will be converted to LED, while HVAC systems and other large equipment will be replaced with best-in-class energy-efficient alternatives.",
            "sdg": [
              7,
              12,
              13
            ]
          },
          {
            "text": "We will progressively transition to renewable energy, aiming to source 50% of our electricity from certified renewable providers by 2030.",
            "sdg": [
              7,
              9,
              13
            ]
          },
          {
            "text": "For emissions that cannot be fully eliminated, we will offset our footprint through certified projects including reforestation, clean energy development, and carbon capture initiatives.",
            "sdg": [
              13,
              15
            ]
          }
        ]
      },
      {
        "number": "2.2",
        "title": "Water Stewardship",
        "items": [
          {
            "text": "We will install low-flow fixtures, dual-flush toilets, and high-efficiency laundry systems across all properties by 2026.",
            "sdg": [
              6
            ]
          },
          {
            "text": "Greywater recycling and rainwater harvesting systems will be introduced where possible, particularly in water-stressed areas.",
            "sdg": [
              6,
              11,
              12
            ]
          },
          {
            "text": "Monthly monitoring of water use will be implemented across all properties, measured on a per guest-night basis to ensure accountability.",
            "sdg": [
              6,
              12
            ]
          },
          {
            "text": "We will support local communities by collaborating with NGOs and authorities to improve water access, awareness, and conservation.",
            "sdg": [
              6,
              11,
              17
            ]
          }
        ]
      },
      {
        "number": "2.3",
        "title": "Waste & Circular Economy",
        "items": [
          {
            "text": "We will move toward a circular economy model, aiming for zero waste to landfill, supported by quarterly waste audits.",
            "sdg": [
              12
            ]
          },
          {
            "text": "Food waste will be reduced through better menu planning, staff training, portion control, and redistribution of surplus food to local charities and food banks.",
            "sdg": [
              2,
              12
            ]
          },
          {
            "text": "By 2026, single-use plastics will be eliminated across all operations, replaced with biodegradable or reusable alternatives.",
            "sdg": [
              12,
              14,
              15
            ]
          },
          {
            "text": "Suppliers will be required to comply with packaging guidelines that prioritize recyclable and biodegradable materials.",
            "sdg": [
              12,
              17
            ]
          }
        ]
      },
      {
        "number": "2.4",
        "title": "Sustainable Sourcing & Biodiversity",
        "items": [
          {
            "text": "At least 60% of food will be locally and seasonally sourced, supporting farmers and reducing emissions.",
            "sdg": [
              2,
              12,
              13
            ]
          },
          {
            "text": "All seafood must carry sustainability certifications, ensuring protection of marine ecosystems.",
            "sdg": [
              14
            ]
          },
          {
            "text": "Products linked to deforestation, overfishing, or exploitative labour practices will be prohibited.",
            "sdg": [
              8,
              12,
              15
            ]
          },
          {
            "text": "Annual biodiversity assessments will be conducted for properties in sensitive regions, with mitigation measures such as pollinator gardens and pesticide-free landscaping.",
            "sdg": [
              15
            ]
          }
        ]
      }
    ]
  },
  {
    "number": "3",
    "title": "Social Policies",
    "items": [],
    "groups": [
      {
        "number": "3.1",
        "title": "Employee Wellbeing & Safety",
        "items": [
          {
            "text": "Every employee will work in a safe and healthy environment, in compliance with international safety standards.",
            "sdg": [
              3,
              8
            ]
          },
          {
            "text": "Quarterly safety drills and annual third-party audits will be conducted to identify and address risks.",
            "sdg": [
              3,
              8
            ]
          },
          {
            "text": "Employees will have access to healthcare benefits, mental health services, and wellness programs.",
            "sdg": [
              3,
              8
            ]
          },
          {
            "text": "Wages will always be maintained at or above the national living wage.",
            "sdg": [
              1,
              8,
              10
            ]
          }
        ]
      },
      {
        "number": "3.2",
        "title": "Diversity, Equity & Inclusion (DEI)",
        "items": [
          {
            "text": "Hiring practices will emphasize inclusivity and accessibility, with job postings designed to remove bias.",
            "sdg": [
              5,
              10
            ]
          },
          {
            "text": "By 2030, at least 40% of management positions will be held by women or underrepresented groups.",
            "sdg": [
              5,
              8,
              10
            ]
          },
          {
            "text": "Annual DEI training will be mandatory for all employees to build cultural awareness and sensitivity.",
            "sdg": [
              5,
              10,
              16
            ]
          },
          {
            "text": "A zero-tolerance policy for discrimination and harassment will be enforced, supported by confidential grievance mechanisms.",
            "sdg": [
              5,
              10,
              16
            ]
          }
        ]
      },
      {
        "number": "3.3",
        "title": "Training & Development",
        "items": [
          {
            "text": "Each employee will complete at least 20 hours of professional training annually.",
            "sdg": [
              4,
              8
            ]
          },
          {
            "text": "Mid-level managers will participate in leadership academies and mentorship programs.",
            "sdg": [
              4,
              5,
              8
            ]
          },
          {
            "text": "An e-learning platform will support continuous education in sustainability, hospitality, and leadership.",
            "sdg": [
              4,
              9
            ]
          },
          {
            "text": "Training outcomes will be tracked annually to ensure effectiveness and progression.",
            "sdg": [
              4,
              8
            ]
          }
        ]
      },
      {
        "number": "3.4",
        "title": "Guest Health, Safety & Experience",
        "items": [
          {
            "text": "All properties will comply with ISO 22000 (food safety) and ISO 45001 (safety) standards.",
            "sdg": [
              3,
              11
            ]
          },
          {
            "text": "Guest facilities will be upgraded to ensure accessibility for individuals with disabilities.",
            "sdg": [
              10,
              11
            ]
          },
          {
            "text": "Guest data will be protected in compliance with GDPR and local data laws.",
            "sdg": [
              9,
              16
            ]
          },
          {
            "text": "Multiple guest feedback channels will be maintained to ensure transparency and rapid response.",
            "sdg": [
              11,
              16
            ]
          }
        ]
      },
      {
        "number": "3.5",
        "title": "Community Engagement",
        "items": [
          {
            "text": "At least 1% of annual profits will be allocated to local community initiatives.",
            "sdg": [
              1,
              11,
              17
            ]
          },
          {
            "text": "Local suppliers, artisans, and SMEs will be prioritized to support local economies.",
            "sdg": [
              8,
              9,
              11
            ]
          },
          {
            "text": "Employees will be encouraged to volunteer with one paid volunteer day per quarter.",
            "sdg": [
              11,
              17
            ]
          },
          {
            "text": "Each property will organize a minimum of four community events per year.",
            "sdg": [
              11,
              17
            ]
          }
        ]
      }
    ]
  },
  {
    "number": "4",
    "title": "Governance Policies",
    "items": [],
    "groups": [
      {
        "number": "4.1",
        "title": "Ethics & Compliance",
        "items": [
          {
            "text": "A Code of Conduct will guide all employees and partners, reinforced through annual training.",
            "sdg": [
              16
            ]
          },
          {
            "text": "Zero tolerance will be enforced for corruption, bribery, or anti-competitive practices.",
            "sdg": [
              16
            ]
          },
          {
            "text": "An independent, 24/7 whistleblower hotline will be provided for confidential reporting.",
            "sdg": [
              16,
              17
            ]
          }
        ]
      },
      {
        "number": "4.2",
        "title": "Board Oversight & ESG Responsibility",
        "items": [
          {
            "text": "A dedicated ESG Committee will oversee progress and report directly to the Board.",
            "sdg": [
              16,
              17
            ]
          },
          {
            "text": "ESG goals will be reviewed quarterly and linked to executive performance and bonuses.",
            "sdg": [
              8,
              16
            ]
          },
          {
            "text": "Annual ESG reports will be presented at Board level to ensure accountability.",
            "sdg": [
              16
            ]
          }
        ]
      },
      {
        "number": "4.3",
        "title": "Data Privacy & Cybersecurity",
        "items": [
          {
            "text": "All personal data will be encrypted and stored in compliance with GDPR and national laws.",
            "sdg": [
              9,
              16
            ]
          },
          {
            "text": "Annual cybersecurity audits will be performed by independent third parties.",
            "sdg": [
              9,
              16,
              17
            ]
          },
          {
            "text": "Employees handling sensitive data will complete cybersecurity training twice annually.",
            "sdg": [
              9,
              16
            ]
          },
          {
            "text": "Modern security measures such as two-factor authentication will be mandatory across all systems.",
            "sdg": [
              9,
              16
            ]
          }
        ]
      },
      {
        "number": "4.4",
        "title": "Transparency & Reporting",
        "items": [
          {
            "text": "An annual ESG report will be published, aligned with GRI and SASB standards.",
            "sdg": [
              12,
              16,
              17
            ]
          },
          {
            "text": "Progress will be mapped against UN SDGs and disclosed publicly.",
            "sdg": [
              12,
              16,
              17
            ]
          },
          {
            "text": "By 2027, ESG reporting will be independently verified by third-party auditors.",
            "sdg": [
              16,
              17
            ]
          },
          {
            "text": "Reports will be made available within six months of each fiscal year-end.",
            "sdg": [
              12,
              16
            ]
          }
        ]
      }
    ]
  },
  {
    "number": "5",
    "title": "Implementation & Monitoring",
    "items": [
      {
        "text": "This policy applies to all employees, contractors, and suppliers, with compliance integrated into contracts and performance reviews.",
        "sdg": [
          12,
          16,
          17
        ]
      },
      {
        "text": "ESG Champions will be appointed at every property to drive initiatives locally and report progress.",
        "sdg": [
          8,
          12,
          16
        ]
      },
      {
        "text": "Internal audits will be conducted annually, with external audits every two years.",
        "sdg": [
          12,
          16
        ]
      },
      {
        "text": "A centralized ESG Dashboard will track KPIs quarterly for company-wide visibility.",
        "sdg": [
          9,
          12
        ]
      },
      {
        "text": "Stakeholder feedback will be collected through annual surveys and consultations, ensuring continuous improvement.",
        "sdg": [
          16,
          17
        ]
      }
    ],
    "groups": []
  },
  {
    "number": "6",
    "title": "Approval & Review",
    "items": [
      {
        "text": "This policy is approved by the Board of Directors and signed by the CEO/Managing Director.",
        "sdg": [
          16
        ]
      },
      {
        "text": "It will be reviewed annually and updated in line with evolving ESG standards.",
        "sdg": [
          12,
          16,
          17
        ]
      },
      {
        "text": "Updated versions will be signed by the CEO/Managing Director and shared publicly for transparency.",
        "sdg": [
          16,
          17
        ]
      }
    ],
    "groups": []
  }
];

/** Title as it appears on the Company's document. */
export const deiPolicyTitle = "Policies For Promoting Diversity Equity & Inclusion";

export const deiPolicySections: DeiSection[] = [
  {
    "title": "Dignified Employment & Staff Growth",
    "supplied": true,
    "sdg": [],
    "policy": "We are committed to providing dignified employment, fair compensation, and continuous opportunities for staff growth. Our workplace will encourage professional development, respect labour rights, and maintain a culture where employees feel valued and supported in their careers.",
    "items": [
      {
        "text": "Inclusive Recruitment: Transparent hiring practices will ensure fairness and equal access for all qualified candidates.",
        "sdg": []
      },
      {
        "text": "Fair Wages: Competitive salaries will be reviewed regularly to ensure they remain fair and equitable.",
        "sdg": []
      },
      {
        "text": "Performance Reviews: Annual reviews will be tied to promotions, training, and professional growth opportunities.",
        "sdg": []
      },
      {
        "text": "Skill Development: Training programs in hospitality, digital tools, and languages will be offered to support career advancement.",
        "sdg": []
      },
      {
        "text": "Grievance Redressal: Clear systems will allow employees to raise concerns safely and have them resolved promptly.",
        "sdg": []
      }
    ]
  },
  {
    "title": "Community & Cultural Inclusion",
    "supplied": false,
    "sdg": [
      10,
      11
    ],
    "policy": "We aim to promote inclusive and culturally respectful tourism that uplifts local communities and protects heritage. Our practices will celebrate diversity, reduce inequalities, and ensure accessibility for all.",
    "items": [
      {
        "text": "Respecting Heritage: Tourism activities will highlight and preserve Pakistan’s cultural and historical sites.",
        "sdg": []
      },
      {
        "text": "Local Employment: Locals will be employed as guides, artisans, and performers to generate sustainable community income.",
        "sdg": []
      },
      {
        "text": "Eco-Conservation: We will support projects that protect the environment and encourage community-led sustainability efforts.",
        "sdg": []
      },
      {
        "text": "Accessibility: Services and facilities will be adapted to ensure inclusion of differently-abled guests.",
        "sdg": []
      }
    ]
  },
  {
    "title": "Governance, Transparency & ESG Reporting",
    "supplied": false,
    "sdg": [
      16,
      17
    ],
    "policy": "We will maintain the highest standards of governance, ethics, and accountability. Transparency in reporting and strong partnerships will be at the heart of our sustainability and inclusion agenda.",
    "items": [
      {
        "text": "Sustainability Reports: Annual ESG and sustainability reports will be published for stakeholders.",
        "sdg": []
      },
      {
        "text": "Independent Audits: Regular audits of environmental, financial, and governance practices will be conducted.",
        "sdg": []
      },
      {
        "text": "Partnerships: Collaboration with NGOs, government, and community groups will strengthen our impact.",
        "sdg": []
      },
      {
        "text": "Oversight Committee: A Sustainability & DEI Committee will be established to track progress and ensure accountability.",
        "sdg": []
      }
    ]
  }
];

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
export const sdgReferenced: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
