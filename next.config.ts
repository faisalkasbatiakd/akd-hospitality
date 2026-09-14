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

/**
 * Whether search engines may index this deployment. Mirrors `isIndexable` in
 * src/lib/site.ts, read from the environment directly because this file is
 * loaded outside the app's module graph and the `@/` alias does not resolve
 * here.
 */
const isIndexable = process.env.NEXT_PUBLIC_NOINDEX !== "true";

const nextConfig: NextConfig = {
  /*
   * Server actions accept a body large enough for the files the dashboard
   * already says it allows.
   *
   * Next defaults this to 1 MB, and the dashboard advertises a 25 MB limit for
   * filings and 8 MB for images - so every real upload was rejected before the
   * action ran, with a 413 the form could not explain. It went unnoticed
   * because the only upload ever tested here was an 11 KB photograph.
   *
   * Set above 25 MB, not at it: multipart encoding and the accompanying form
   * fields add to the body, so a file exactly on the limit would still fail.
   */
  experimental: {
    serverActions: {
      bodySizeLimit: "30mb",
    },
  },

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
      /*
       * On a deployment that is not the live site, every response is marked
       * noindex at the header rather than only the HTML pages. The archive is
       * 110 PDFs and a PDF cannot carry a meta tag, so the header is the only
       * way to keep the temporary host's copies of the filings - which are the
       * same documents the live site will publish - out of the index.
       *
       * Spread in conditionally so the live site's responses stay clean.
       */
      ...(isIndexable
        ? []
        : [
            {
              source: "/:path*",
              headers: [
                { key: "X-Robots-Tag", value: "noindex, nofollow" },
              ],
            },
          ]),
      {
        /*
         * Applied to everything. None of these depend on the page, and a
         * default that has to be remembered per route eventually is not.
         */
        source: "/:path*",
        headers: [
          // Stop a browser second-guessing a declared Content-Type. Matters
          // most for the archive: a PDF must never be run as something else.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Send the full URL only to ourselves; give other origins the origin
          // alone. Dashboard paths should not travel in a Referer header.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Framing is allowed only from this origin, so the dashboard cannot
          // be embedded in someone else's page and clicked through.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Nothing here needs a camera, a microphone or a location, so none
          // of them can be asked for.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
        /*
         * Strict-Transport-Security is deliberately absent. It is per host, and
         * the cutover to akdhospitality.com is the client's to make against an
         * old site that is HTTP-only on both the apex and www. If that cutover
         * were rolled back, visitors who had already been pinned to HTTPS could
         * not reach the old site at all. Worth enabling once the domain has
         * settled here - see the README.
         */
      },
      {
        /*
         * The dashboard is never indexed, on any deployment including the live
         * one. This is separate from the NEXT_PUBLIC_NOINDEX flag above, which
         * is lifted at launch: the sign-in page is linked from the footer, so
         * without this it would be perfectly crawlable on the real domain, and
         * a company's admin login is not something to publish in search
         * results.
         *
         * no-store as well, so an authenticated page is never held by a proxy
         * or served from the back button after signing out.
         */
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store, must-revalidate" },
        ],
      },
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
