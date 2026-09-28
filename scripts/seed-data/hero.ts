/* ---------------------------------------------------------------------------
 * EDITING THIS FILE CHANGES NOTHING ON THE WEBSITE.
 *
 * It fills a brand-new, empty database once. The live site reads this content
 * from the database, and the seed refuses to run against a database that
 * already has rows - so a change here is never picked up by a deploy.
 *
 * To change what visitors see, use the dashboard:
 *   https://www.akdhospitality.com/admin
 * ------------------------------------------------------------------------- */

export type HeroSlide = {
  image: string;
  alt: string;
  credit: string;
};

/**
 * Hero imagery served from the Unsplash CDN (see next.config.ts remotePatterns).
 * Replace with the client's own photography when it is provided.
 */
export const heroSlides: HeroSlide[] = [
  {
    image:
      "https://images.unsplash.com/photo-1514558427911-8e293bebf18c?auto=format&fit=crop&w=2400&q=80",
    alt: "Aerial view of a river winding through the mountains of northern Pakistan",
    credit: "Unsplash",
  },
  {
    image:
      "https://images.unsplash.com/photo-1742844552193-2fd3425cd26d?auto=format&fit=crop&w=2400&q=80",
    alt: "A grand hotel lobby filled with natural sunlight",
    credit: "Unsplash",
  },
  {
    image:
      "https://images.unsplash.com/photo-1662800291212-5d31184b861c?auto=format&fit=crop&w=2400&q=80",
    alt: "A still mountain lake surrounded by high peaks",
    credit: "Unsplash",
  },
  {
    image:
      "https://images.unsplash.com/photo-1659607168553-197baa0ae9d5?auto=format&fit=crop&w=2400&q=80",
    alt: "Visitors riding a cable car at a mountain tourism attraction",
    credit: "Unsplash",
  },
];

/** Rotating panel shown in the glass card over the hero. */
export const heroHighlights = [
  {
    title: "Our Legacy",
    body: "Incorporated in 1936 as a public limited company. In February 2021 the Company was renamed from AKD Capital Limited and its principal business changed to tourism and hospitality.",
    href: "/about",
    linkLabel: "Learn More",
  },
  {
    title: "Our Business",
    body: "The Company's objects cover hospitality, motels, destination management and the development of tourism attractions, with feasibility work under way across ten accommodation formats.",
    href: "/about",
    linkLabel: "Explore",
  },
  {
    title: "For Investors",
    body: "Financial statements, annual reports, free float disclosures and shareholder notices, all in one place under the symbol AKDHL.",
    href: "/investors",
    linkLabel: "Investor Centre",
  },
];
