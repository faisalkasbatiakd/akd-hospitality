import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  FileText,
  Home,
  Mail,
  Megaphone,
  TrendingUp,
} from "lucide-react";

import { getCompany } from "@/lib/content";
import { iconTint } from "@/lib/icon-tints";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Page not found",
  // A 404 must never be indexed: it would compete with the real pages and
  // report a soft error in Search Console.
  robots: { index: false, follow: true },
};

/**
 * The routes a visitor who mistyped a URL most likely wanted. Ordered by how
 * often people arrive looking for them on a listed company's site: filings
 * first, then the corporate pages.
 */
const destinations = [
  {
    icon: TrendingUp,
    href: "/investors",
    title: "Investors",
    body: "Financial statements, annual reports, free float and financial highlights.",
  },
  {
    icon: Megaphone,
    href: "/media",
    title: "Media",
    body: "AGM and EOGM notices, corporate briefings and shareholder forms.",
  },
  {
    icon: Building2,
    href: "/governance",
    title: "Governance",
    body: "Board of Directors, committees and shareholding pattern.",
  },
  {
    icon: FileText,
    href: "/about",
    title: "About Us",
    body: "The Company's history, mandate and lines of business.",
  },
] as const;

export default async function NotFound() {
  const company = await getCompany();
  // Seeded and schema-required; null means an unseeded database.
  if (!company) return null;

  return (
    <>
      <PageHero
        title="Page not found"
        description="The page you were looking for does not exist, or has moved. The links below cover everything published on this website."
      />

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHeading
            eyebrow="Error 404"
            title="Where would you like to go?"
            description="If you followed a link to a document, it may have been renamed. Every published document is listed on the Investors, Media and Governance pages."
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {destinations.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="card-hover group flex flex-col rounded-2xl border border-border p-6 lg:p-7"
                >
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                      iconTint(index),
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h2 className="mt-5 text-base font-medium text-brand-navy">
                    {item.title}
                  </h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-foreground/70">
                    {item.body}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium text-brand-accent">
                    Go to {item.title}
                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-border pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-brand-accent"
            >
              <Home className="size-4" aria-hidden />
              Back to home
            </Link>
            <Link
              href="/sitemap"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-brand-navy transition-colors duration-300 hover:border-brand-accent/50 hover:bg-brand-accent/[0.04]"
            >
              View the sitemap
            </Link>
            <a
              href={`mailto:${company.contact.email}`}
              className="-my-2 inline-flex items-center gap-2 py-2 text-sm font-medium [overflow-wrap:anywhere] text-brand-accent underline-offset-4 transition-colors duration-300 hover:text-brand-navy hover:underline"
            >
              <Mail className="size-4 shrink-0" aria-hidden />
              {company.contact.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
