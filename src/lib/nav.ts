export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Governance", href: "/governance" },
  { label: "Investors", href: "/investors" },
  { label: "Media", href: "/media" },
  { label: "Contact", href: "/contact" },
];

export const legalNav: NavItem[] = [
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Sitemap", href: "/sitemap" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export const allRoutes: NavItem[] = [...mainNav, ...legalNav];
