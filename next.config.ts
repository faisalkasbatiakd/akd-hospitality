import type { NextConfig } from "next";

/**
 * Old ASP.NET paths mapped to their replacement route.
 *
 * These are not hypothetical. Scanning the 110 filings in /public/documents
 * turns up "http://akdhospitality.com/Investors.aspx" printed inside four of
 * them, including the FY2025 Notice of Annual General Meeting that went to
 * every shareholder on the register. Those shareholders will type that URL, so
 * it has to land somewhere useful rather than on a 404.
 *
 * ASP.NET routing was case insensitive and Next's is not, so each path is
 * registered in both the capitalised form the old site used and lower case.
 * Anything genuinely unknown is left to fall through to the 404 page, which now
 * carries links to every section - a blanket redirect would hide real problems.
 */
const legacyPaths: Record<string, string> = {
  "Default.aspx": "/",
  "index.aspx": "/",
  "AboutUs.aspx": "/about",
  "About.aspx": "/about",
  "Governance.aspx": "/governance",
  "Investors.aspx": "/investors",
  "Media.aspx": "/media",
  "ContactUs.aspx": "/contact",
  "Contact.aspx": "/contact",
  "TermsOfUse.aspx": "/terms-of-use",
  "Terms.aspx": "/terms-of-use",
  "Disclaimer.aspx": "/disclaimer",
  "Sitemap.aspx": "/sitemap",
};

const nextConfig: NextConfig = {
  images: {
    // Hero and section imagery is served from the Unsplash CDN for now.
    // Swap for local files in /public once the client supplies photography.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },

  async redirects() {
    const seen = new Set<string>();
    const rules: { source: string; destination: string; permanent: boolean }[] =
      [];

    for (const [legacy, destination] of Object.entries(legacyPaths)) {
      for (const variant of [legacy, legacy.toLowerCase()]) {
        const source = `/${variant}`;
        if (seen.has(source)) continue;
        seen.add(source);
        rules.push({ source, destination, permanent: true });
      }
    }

    return rules;
  },

  async headers() {
    return [
      {
        /*
         * The document archive is 110 files and about 146 MB, and none of it
         * ever changes: a filed AGM notice or an audited financial statement
         * is fixed once published, and a revision arrives as a new file with a
         * new name. So it is cached hard, at the CDN and in the browser.
         *
         * Without this the archive is revalidated far more often than it needs
         * to be, which matters most for the visitors who cost the most to
         * serve - someone on a phone in Pakistan opening several filings in a
         * row.
         */
        source: "/documents/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            // Open filings in the browser's viewer rather than forcing a
            // download; a shareholder usually wants to read one page.
            key: "Content-Disposition",
            value: "inline",
          },
        ],
      },
      {
        // The client's own diagrams, likewise fixed once published.
        source: "/governance/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
