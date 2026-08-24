import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";

import { type Company, getCompany } from "@/lib/content";
import { ogImage } from "@/lib/site";
import { PageSchema } from "@/components/seo/page-schema";
import { PageHero } from "@/components/shared/page-hero";
import { LegalDocument } from "@/components/shared/legal-document";

const pageTitle = "Disclaimer";
const pageDescription =
  "Disclaimer regarding the information, financial documents and forward-looking statements published on the AKD Hospitality Limited website.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/disclaimer" },
  keywords: [
    "AKD Hospitality disclaimer",
    "forward-looking statements",
    "AKDHL investor disclaimer",
  ],
  openGraph: {
    type: "article",
    url: "/disclaimer",
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

const sectionsFor = (company: Company) => [
  {
    heading: "General information only",
    body: [
      `The information contained on this website is provided by ${company.name} for general information purposes only. While the Company endeavours to keep the information accurate and up to date, no representation or warranty of any kind, express or implied, is given as to its accuracy, completeness or suitability for any particular purpose.`,
    ],
  },
  {
    heading: "Not an offer or investment advice",
    body: [
      `Nothing contained on this website constitutes an offer, invitation or solicitation to buy or sell any securities of the Company, nor does it constitute investment, financial, legal or tax advice.`,
      `Any decision to invest in the securities of the Company should be made only after seeking independent professional advice and after reviewing the Company's audited financial statements and regulatory filings in full.`,
    ],
  },
  {
    heading: "Financial documents",
    body: [
      `Financial statements, quarterly and half-yearly reports, free float disclosures and other documents made available for download on this website are published for the convenience of shareholders and the investor community.`,
      `In the event of any inconsistency between a document on this website and the corresponding version filed with the Securities and Exchange Commission of Pakistan or the ${company.exchange}, the filed version shall prevail.`,
    ],
  },
  {
    heading: "Forward-looking statements",
    body: [
      `Certain statements on this website may be forward-looking in nature, including statements regarding plans, objectives, expectations and future performance. Such statements involve known and unknown risks and uncertainties, and actual results may differ materially.`,
      `The Company undertakes no obligation to update or revise any forward-looking statement to reflect events or circumstances arising after the date of publication.`,
    ],
  },
  {
    heading: "Share price and market data",
    body: [
      `Any share price or market information referenced on this website is indicative only and may be delayed. It should not be relied upon for trading purposes. Shareholders should refer to the ${company.exchange} for official market data relating to the symbol ${company.symbol}.`,
    ],
  },
  {
    heading: "External websites",
    body: [
      `This website may contain links to third-party websites. The Company has no control over the content of those websites and accepts no responsibility or liability in respect of any material contained on them.`,
    ],
  },
  {
    heading: "Limitation of liability",
    body: [
      `To the fullest extent permitted by law, the Company, its directors, officers and employees disclaim all liability for any direct, indirect, incidental or consequential loss or damage arising from access to, use of, or reliance upon this website or any information contained on it.`,
    ],
  },
];

export default async function DisclaimerPage() {
  const company = await getCompany();
  // Seeded and schema-required; null means an unseeded database.
  if (!company) return null;
  const sections = sectionsFor(company);

  return (
    <>
      <PageSchema
        path="/disclaimer"
        name={pageTitle}
        description={pageDescription}
        type="WebPage"
      />

      <PageHero
        route="/disclaimer"
        title="Disclaimer"
        description="Important information about the content published on this website."
      />

      {/* The going-concern and forward-looking warnings below are the reason
          this page exists, so the caution sits above the clauses rather than
          being buried at the end. */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 pt-16 md:pt-20">
          <div
            className="flex gap-4 rounded-2xl border border-amber-300/70 bg-amber-50/60 p-6 lg:p-7"
            data-aos="fade-up"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
              <AlertTriangle className="size-5" aria-hidden />
            </span>
            <p className="text-sm leading-relaxed text-foreground/80">
              Please read this disclaimer carefully. By continuing to use this
              website, you acknowledge and accept the terms set out below.
              Nothing on this website is an offer to sell or a solicitation to
              buy securities, and nothing on it is investment advice.
            </p>
          </div>
        </div>
      </section>

      <LegalDocument
        intro="This website is published for general information about AKD Hospitality Limited. The clauses below set out the limits of what may be relied upon."
        sections={sections}
        note={`For any queries regarding this disclaimer, please contact the Company Secretary at ${company.contact.email} or ${company.contact.phone}.`}
      />

    </>
  );
}
