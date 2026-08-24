import type { Metadata } from "next";
import { ExternalLink, Mail, TrendingUp } from "lucide-react";

import { getCompany, getDocumentsForPage } from "@/lib/content";
import { ogImage } from "@/lib/site";
import { iconTint } from "@/lib/icon-tints";
import { cn } from "@/lib/utils";
import { FinancialOverview } from "@/components/sections/financial-overview";
import { PageSchema } from "@/components/seo/page-schema";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import {
  InvestorDocuments,
  type DocumentCategory,
} from "@/components/sections/investor-documents";

const pageTitle = "Investors";
const pageDescription =
  "Investor information for AKD Hospitality Limited (AKDHL): financial statements, annual reports, free float disclosures, financial highlights and regulatory links.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/investors" },
  keywords: [
    "AKDHL investor relations",
    "AKD Hospitality financial statements",
    "AKD Hospitality annual report",
    "free float AKDHL",
    "PSX AKDHL",
    "quarterly report",
  ],
  openGraph: {
    type: "article",
    url: "/investors",
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

export default async function InvestorsPage() {
  const company = await getCompany();
  // Seeded and schema-required; null means an unseeded database.
  if (!company) return null;

  // Groups, their labels and their order all come from the dashboard now, so
  // adding a category there adds a tab here without a deploy.
  const categories: DocumentCategory[] = (
    await getDocumentsForPage("investors")
  ).map((group) => ({
    value: group.key,
    label: group.label,
    items: group.items,
  }));

  return (
    <>
      <PageSchema
        path="/investors"
        name={pageTitle}
        description={pageDescription}
        type="CollectionPage"
      />

      <PageHero
        route="/investors"
        title="Investors"
        description="Financial statements, disclosures and regulatory information for shareholders and prospective investors of AKD Hospitality Limited."
      />

      {/* Key facts */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          <Card className="group border-border card-hover">
            <CardContent className="px-6 py-6">
              <span
                className={cn(
                  "grid size-11 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                  iconTint(0),
                )}
              >
                <TrendingUp className="size-5" aria-hidden />
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">
                Company Symbol
              </p>
              <p className="mt-1.5 text-2xl font-semibold text-brand-navy">
                {company.symbol}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Ordinary shares of the Company are quoted on the{" "}
                {company.exchange}.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-border card-hover">
            <CardContent className="px-6 py-6">
              <span
                className={cn(
                  "grid size-11 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                  iconTint(1),
                )}
              >
                <Mail className="size-5" aria-hidden />
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">
                Investor Relations
              </p>
              <a
                href={`mailto:${company.contact.investorEmail}`}
                className="-mb-2 mt-0.5 block py-2 text-sm font-semibold [overflow-wrap:anywhere] text-brand-navy underline-offset-4 hover:text-brand-accent hover:underline"
              >
                {company.contact.investorEmail}
              </a>
              <p className="mt-2 text-sm text-muted-foreground">
                For queries relating to shares, dividends and reports.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-border card-hover">
            <CardContent className="px-6 py-6">
              <span
                className={cn(
                  "grid size-11 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                  iconTint(2),
                )}
              >
                <ExternalLink className="size-5" aria-hidden />
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">
                Regulatory Links
              </p>
              <ul className="mt-2.5 space-y-1.5">
                {company.externalLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="-my-2 inline-block py-2 text-sm text-foreground/85 underline-offset-4 hover:text-brand-accent hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <FinancialOverview />

      {/* Documents */}
      <section className="border-t border-border bg-background py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Downloads"
            title="Investor documents"
            description="Select a category to view and download the related reports and disclosures."
          />

          <InvestorDocuments categories={categories} />
        </div>
      </section>
    </>
  );
}
