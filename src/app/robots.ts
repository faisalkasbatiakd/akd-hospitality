import type { MetadataRoute } from "next";

import { isIndexable, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  /**
   * On a deployment that is not the live site, crawling stays allowed on
   * purpose. Blocking it with `disallow` would stop a crawler reading the
   * `noindex` on the page, and a URL that is merely uncrawlable can still be
   * listed if something links to it. Letting the crawler in to see the noindex
   * is what actually keeps the host out of the index.
   *
   * The sitemap and host lines are dropped, because both advertise the
   * temporary hostname.
   */
  if (!isIndexable) {
    return { rules: [{ userAgent: "*", allow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
