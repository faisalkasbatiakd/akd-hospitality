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
    title: "Corporate Briefing Session held on 21 November 2025",
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
