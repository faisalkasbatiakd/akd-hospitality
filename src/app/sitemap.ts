import type { MetadataRoute } from "next";

import { allRoutes } from "@/lib/nav";
import { siteUrl } from "@/lib/site";

/**
 * The `/sitemap` page is the human-readable index; this generates the XML one
 * search engines read. Priorities put the home page first, then the corporate
 * sections, then the legal pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const priorityFor = (href: string) => {
    if (href === "/") return 1;
    if (["/terms-of-use", "/disclaimer", "/sitemap"].includes(href)) return 0.3;
    return 0.8;
  };

  return allRoutes.map((route) => ({
    url: `${siteUrl}${route.href === "/" ? "" : route.href}`,
    lastModified,
    changeFrequency: route.href === "/" ? "monthly" : "yearly",
    priority: priorityFor(route.href),
  }));
}
