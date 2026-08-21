import type { Metadata } from "next";

import { company } from "@/data/company";
import { ogImage } from "@/lib/site";
import { PageSchema } from "@/components/seo/page-schema";
import { PageHero } from "@/components/shared/page-hero";
import { LegalDocument } from "@/components/shared/legal-document";

const pageTitle = "Terms of Use";
const pageDescription =
  "Terms governing access to and use of the AKD Hospitality Limited website: intellectual property, accuracy of information and governing law.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/terms-of-use" },
  keywords: [
    "AKD Hospitality terms of use",
    "website terms",
    "AKDHL legal",
  ],
  openGraph: {
    type: "article",
    url: "/terms-of-use",
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

const sections = [
  {
    heading: "Acceptance of these terms",
    body: [
      `By accessing and using this website, you agree to be bound by these terms of use. If you do not agree with any part of these terms, please discontinue use of the website.`,
    ],
  },
  {
    heading: "Use of the website",
    body: [
      `This website is provided for general information about ${company.name} and its business activities. You may view, download and print material from this website for your own personal, non-commercial use.`,
      `You may not reproduce, republish, distribute or modify any content from this website for commercial purposes without the prior written consent of the Company.`,
    ],
  },
  {
    heading: "Intellectual property",
    body: [
      `All content on this website, including text, graphics, logos, page layout and documents, is the property of the Company or is used with permission, and is protected by applicable intellectual property laws.`,
    ],
  },
  {
    heading: "Accuracy of information",
    body: [
      `The Company makes reasonable efforts to ensure that the information published on this website is accurate and current at the time of publication. However, the Company does not warrant the completeness, accuracy or timeliness of any information and may amend or remove content without prior notice.`,
      `Financial statements, notices and other regulatory documents made available on this website are provided for convenience. In the event of any discrepancy, the versions filed with the Securities and Exchange Commission of Pakistan and the ${company.exchange} shall prevail.`,
    ],
  },
  {
    heading: "Third-party links",
    body: [
      `This website may contain links to external websites operated by third parties. The Company does not control and is not responsible for the content, availability or privacy practices of those websites. Links are provided for convenience only and do not imply endorsement.`,
    ],
  },
  {
    heading: "No investment advice",
    body: [
      `Nothing on this website constitutes investment advice, a recommendation, or an offer or solicitation to buy or sell any securities. Investors should seek independent professional advice before making any investment decision.`,
    ],
  },
  {
    heading: "Limitation of liability",
    body: [
      `To the extent permitted by law, the Company shall not be liable for any loss or damage arising from the use of, or reliance on, this website or its content, or from any inability to access the website.`,
    ],
  },
  {
    heading: "Governing law",
    body: [
      `These terms of use are governed by the laws of the Islamic Republic of Pakistan, and any disputes arising in connection with this website shall be subject to the exclusive jurisdiction of the courts of Karachi.`,
    ],
  },
  {
    heading: "Changes to these terms",
    body: [
      `The Company may revise these terms of use at any time. Any changes will take effect once published on this page, and continued use of the website constitutes acceptance of the revised terms.`,
    ],
  },
  {
    heading: "Contact",
    body: [
      `For any questions regarding these terms of use, please contact the Company Secretary at ${company.contact.email} or ${company.contact.phone}.`,
    ],
  },
];

export default function TermsOfUsePage() {
  return (
    <>
      <PageSchema
        path="/terms-of-use"
        name={pageTitle}
        description={pageDescription}
        type="WebPage"
      />

      <PageHero
        route="/terms-of-use"
        title="Terms of Use"
        description="Please read these terms carefully before using this website."
      />

      <LegalDocument
        intro="These terms govern access to and use of this website. They apply to every visitor, and using the website means accepting them."
        sections={sections}
        note={`These terms may be revised without notice. Questions about them should be directed to the Company Secretary at ${company.contact.email}.`}
      />

    </>
  );
}
