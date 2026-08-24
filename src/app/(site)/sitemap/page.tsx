import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";

import { getCompany } from "@/lib/content";
import { ogImage } from "@/lib/site";
import { PageSchema } from "@/components/seo/page-schema";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";

const pageTitle = "Sitemap";
const pageDescription =
  "A complete index of every page and section on the AKD Hospitality Limited website, together with the Company's regulatory links.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/sitemap" },
  keywords: [
    "AKD Hospitality sitemap",
    "site index",
    "AKDHL pages",
  ],
  openGraph: {
    type: "article",
    url: "/sitemap",
    title: pageTitle,
    description: pageDescription,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [ogImage.url],
  },
};

type SitemapGroup = {
  title: string;
  href: string;
  children?: { label: string; href: string }[];
};

const groups: SitemapGroup[] = [
  {
    title: "Home",
    href: "/",
    children: [
      { label: "Company Overview", href: "/#overview" },
      { label: "Vision & Mission", href: "/about" },
      { label: "Lines of Business", href: "/about" },
      { label: "About AKD Group", href: "/about" },
    ],
  },
  {
    title: "About Us",
    href: "/about",
    children: [
      { label: "Company Profile", href: "/about" },
      { label: "Vision Statement", href: "/about" },
      { label: "Mission Statement", href: "/about" },
      { label: "Company Information", href: "/about" },
      { label: "About AKD Group", href: "/about" },
    ],
  },
  {
    title: "Governance",
    href: "/governance",
    children: [
      { label: "Board of Directors", href: "/governance" },
      { label: "Director Profiles", href: "/governance" },
      { label: "Audit Committee", href: "/governance" },
      { label: "Human Resource & Remuneration Committee", href: "/governance" },
      { label: "Risk Management Committee", href: "/governance" },
      { label: "Shareholding Pattern", href: "/governance" },
      { label: "Election of Directors", href: "/governance" },
      { label: "Gender Diversity", href: "/governance" },
    ],
  },
  {
    title: "Investors",
    href: "/investors",
    children: [
      { label: "Company Symbol", href: "/investors" },
      { label: "Financial Statements", href: "/investors" },
      { label: "Annual Reports", href: "/investors" },
      { label: "Free Float", href: "/investors" },
      { label: "Financial Highlights", href: "/investors" },
      { label: "Financial Information", href: "/investors" },
    ],
  },
  {
    title: "Media",
    href: "/media",
    children: [
      { label: "Notice of Annual General Meeting", href: "/media" },
      { label: "Notice of Extraordinary General Meeting", href: "/media" },
      { label: "Special Resolutions", href: "/media" },
      { label: "Corporate Briefing Sessions", href: "/media" },
      { label: "Shareholder Forms", href: "/media" },
    ],
  },
  {
    title: "Contact",
    href: "/contact",
    children: [
      { label: "Company Details", href: "/contact" },
      { label: "Office Location", href: "/contact" },
      { label: "Enquiry Form", href: "/contact" },
    ],
  },
  {
    title: "Terms of Use",
    href: "/terms-of-use",
  },
  {
    title: "Disclaimer",
    href: "/disclaimer",
  },
  {
    title: "Sitemap",
    href: "/sitemap",
  },
];

export default async function SitemapPage() {
  const company = await getCompany();
  // Seeded and schema-required; null means an unseeded database.
  if (!company) return null;

  return (
    <>
      <PageSchema
        path="/sitemap"
        name={pageTitle}
        description={pageDescription}
        type="CollectionPage"
      />

      <PageHero
        route="/sitemap"
        title="Sitemap"
        description="An index of every page and section on this website."
      />

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <SectionHeading
          eyebrow="Site index"
          title="All pages"
          description="Use the index below to navigate directly to any section of the website."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.title} className="border-border">
              <CardContent className="px-6 py-5">
                <Link
                  href={group.href}
                  className="group -my-1.5 inline-flex items-center gap-1.5 py-1.5 text-base font-semibold text-brand-navy transition-colors hover:text-brand-accent"
                >
                  {group.title}
                  <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>

                {group.children && (
                  <ul className="mt-3.5 space-y-2">
                    {group.children.map((child) => (
                      <li key={`${group.title}-${child.label}`}>
                        <Link
                          href={child.href}
                          className="-my-2 flex items-start gap-1.5 py-2 text-sm text-muted-foreground transition-colors hover:text-brand-accent"
                        >
                          <ChevronRight
                            className="mt-0.5 size-3.5 shrink-0 text-brand-accent/60"
                            aria-hidden
                          />
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* External links */}
        <div className="mt-14">
          <h2 className="text-lg font-semibold text-brand-navy">
            External links
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {company.externalLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-brand-accent hover:underline"
                >
                  {link.label}
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
