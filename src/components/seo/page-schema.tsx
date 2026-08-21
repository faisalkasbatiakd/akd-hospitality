import { siteName, siteUrl } from "@/lib/site";

type PageSchemaProps = {
  /** Route path, e.g. "/about". */
  path: string;
  /** Page title as shown in the breadcrumb trail. */
  name: string;
  description: string;
  /**
   * Schema.org type for the page. Defaults to WebPage; "AboutPage",
   * "ContactPage" and "CollectionPage" are the other useful ones here.
   */
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
};

/**
 * Per-page JSON-LD: a typed page node plus its breadcrumb trail, both tied back
 * to the Corporation and WebSite nodes declared on the home page by `@id`.
 * Reusable across the inner pages so each one carries its own trail.
 */
export function PageSchema({
  path,
  name,
  description,
  type = "WebPage",
}: PageSchemaProps) {
  const url = `${siteUrl}${path}`;

  const graph = [
    {
      "@type": type,
      "@id": `${url}#webpage`,
      url,
      name: `${name} | ${siteName}`,
      description,
      inLanguage: "en-PK",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      breadcrumb: { "@id": `${url}#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name,
          item: url,
        },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      // Built entirely from our own constants, so there is nothing to escape.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": graph,
        }),
      }}
    />
  );
}
