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

export type Announcement = {
  title: string;
  href: string;
};

/** Rolling notices shown in the ticker above the header. */
export const announcements: Announcement[] = [
  {
    title: "Notice of Annual General Meeting to be held on 28 October 2025",
    href: "/media",
  },
  {
    title: "Corporate Briefing Session held on Nov 21, 2025",
    href: "/media",
  },
  {
    title: "Annual Report 2025 now available for shareholders",
    href: "/investors",
  },
  {
    title: "Quarterly Report for the period ended March 2026 published",
    href: "/investors",
  },
];
