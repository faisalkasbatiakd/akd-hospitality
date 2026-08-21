import { company } from "@/data/company";
import { siteName, siteUrl } from "@/lib/site";

/**
 * Schema.org JSON-LD for the home page.
 *
 * Modelled as a Corporation because the entity is a listed public company:
 * `tickerSymbol` and `foundingDate` are the fields search engines use to tie
 * the site to the right company record. Every value here is taken from the
 * FY2025 annual report or the Company's own contact details - nothing is
 * inferred, and no employee or revenue figures are published.
 */
export function StructuredData() {
  const graph = [
    {
      "@type": "Corporation",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      alternateName: "AKDHL",
      legalName: siteName,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/akd-logo-navy.png`,
        width: 87,
        height: 54,
      },
      description: company.intro,
      foundingDate: "1936",
      tickerSymbol: "AKDHL",
      parentOrganization: {
        "@type": "Organization",
        name: "AKD Group",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "511, 5th Floor, Continental Trade Centre, Main Clifton Road, Block 8, Clifton",
        addressLocality: "Karachi",
        addressCountry: "PK",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: "+92-21-35302963",
          email: company.contact.email,
          areaServed: "PK",
          availableLanguage: "English",
        },
        {
          "@type": "ContactPoint",
          contactType: "investor relations",
          email: company.contact.investorEmail,
          areaServed: "PK",
          availableLanguage: "English",
        },
      ],
      knowsAbout: [
        "Hospitality",
        "Motels",
        "Destination management",
        "Tourism attractions",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      inLanguage: "en-PK",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: siteName,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en-PK",
    },
  ];

  return (
    <script
      type="application/ld+json"
      // The payload is built from our own constants, so there is no untrusted
      // input to escape here.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
