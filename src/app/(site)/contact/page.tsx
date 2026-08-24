import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Printer,
  TrendingUp,
  User,
} from "lucide-react";

import { type Company, getCompany, getSetting } from "@/lib/content";
import type * as Notices from "@/data/media-notices";
import { iconTint } from "@/lib/icon-tints";
import { cn } from "@/lib/utils";
import { ogImage } from "@/lib/site";
import { PageSchema } from "@/components/seo/page-schema";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { ContactForm } from "@/components/sections/contact-form";

const pageTitle = "Contact";
const pageDescription =
  "Contact AKD Hospitality Limited: Company Secretary, registered office at Continental Trade Centre, Clifton, Karachi, telephone, fax, investor relations and Share Registrar.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/contact" },
  keywords: [
    "AKD Hospitality contact",
    "AKDHL company secretary",
    "Continental Trade Centre Karachi",
    "investor relations email",
    "AKD Hospitality address",
    "AKDHL share registrar",
  ],
  openGraph: {
    type: "article",
    url: "/contact",
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

/**
 * Where an enquiry should actually go.
 *
 * The Company publishes three separate routes and they are not
 * interchangeable: share transfers, folio details and unclaimed dividends are
 * handled by the Share Registrar, not by the Company. Sending everyone to one
 * inbox would just delay those enquiries, so the routes are stated up front.
 *
 * Registrar details are from the Notice of Annual General Meeting 2025, p. 1.
 */
const routesFor = (company: Company, registrarName: string) => [
  {
    icon: Building2,
    label: "General and corporate",
    body: "Company Secretary, for corporate, media and general enquiries.",
    linkLabel: company.contact.email,
    href: `mailto:${company.contact.email}`,
  },
  {
    icon: TrendingUp,
    label: "Investor relations",
    body: "Financial statements, notices, proxy instruments and briefing materials.",
    linkLabel: company.contact.investorEmail,
    href: `mailto:${company.contact.investorEmail}`,
  },
  {
    icon: Landmark,
    label: "Shareholder services",
    body: `Share transfers, folio and CDC details, unclaimed dividends: ${registrarName}.`,
    linkLabel: "See registrar address",
    href: "/media",
  },
] as const;

type DetailItem = {
  icon: LucideIcon;
  label: string;
  lines: readonly string[];
  href?: string;
};

const detailsFor = (company: Company): readonly DetailItem[] => [
  {
    icon: User,
    label: "Contact person",
    lines: [company.contact.person, company.contact.role],
  },
  {
    icon: MapPin,
    label: "Registered office",
    lines: company.contact.address,
  },
  {
    icon: Phone,
    label: "Telephone",
    lines: [company.contact.phone],
    href: `tel:${company.contact.phone.replace(/[^\d+]/g, "")}`,
  },
  // Fax is optional in the settings schema, so the row only appears when the
  // Company still publishes one.
  ...(company.contact.fax
    ? [{ icon: Printer, label: "Fax", lines: [company.contact.fax] }]
    : []),
  {
    icon: Mail,
    label: "Email",
    lines: [company.contact.email],
    href: `mailto:${company.contact.email}`,
  },
  {
    icon: Mail,
    label: "Investor relations",
    lines: [company.contact.investorEmail],
    href: `mailto:${company.contact.investorEmail}`,
  },
];

export default async function ContactPage() {
  const company = await getCompany();
  // Seeded and schema-required; null means an unseeded database.
  if (!company) return null;
  const shareholderServices = await getSetting<
    typeof Notices.shareholderServices
  >("shareholderServices");
  if (!shareholderServices) return null;
  const routes = routesFor(company, shareholderServices.registrar.name);
  const details = detailsFor(company);

  return (
    <>
      <PageSchema
        path="/contact"
        name={pageTitle}
        description={pageDescription}
        type="ContactPage"
      />

      <PageHero
        route="/contact"
        title="Contact Us"
        description="Reach the Company Secretary for corporate enquiries, investor relations for shareholder reporting, or the Share Registrar for anything touching your holding."
      />

      {/* Where to write */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHeading
            eyebrow="Get in touch"
            title="Who to contact"
            description="Three routes, each handled by a different party. Choosing the right one gets your enquiry answered faster."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {routes.map((route, index) => {
              const Icon = route.icon;
              return (
                <div
                  key={route.label}
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
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
                  <h3 className="mt-5 text-base font-medium text-brand-navy">
                    {route.label}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-foreground/70">
                    {route.body}
                  </p>
                  <a
                    href={route.href}
                    className="mt-auto -mb-2 pt-5 pb-2 text-sm font-medium [overflow-wrap:anywhere] text-brand-accent underline-offset-4 transition-colors duration-300 hover:text-brand-navy hover:underline"
                  >
                    {route.linkLabel}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Details + form */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            <div className="min-w-0">
              <SectionHeading eyebrow="Head office" title="Company details" />

              <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                {details.map((detail, index) => {
                  const Icon = detail.icon;
                  return (
                    <div
                      key={detail.label}
                      data-aos="fade-up"
                      data-aos-delay={index * 50}
                      className="card-hover group min-w-0 rounded-2xl border border-border p-5"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "grid size-9 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                            iconTint(index),
                          )}
                        >
                          <Icon className="size-4" aria-hidden />
                        </span>
                        <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                          {detail.label}
                        </dt>
                      </div>
                      <dd className="mt-3.5 space-y-0.5">
                        {detail.href ? (
                          <a
                            href={detail.href}
                            className="-my-2 block py-2 text-sm font-medium [overflow-wrap:anywhere] text-brand-navy underline-offset-4 transition-colors duration-300 hover:text-brand-accent hover:underline"
                          >
                            {detail.lines[0]}
                          </a>
                        ) : (
                          detail.lines.map((line) => (
                            <span
                              key={line}
                              className="block text-sm font-medium leading-relaxed text-foreground/85"
                            >
                              {line}
                            </span>
                          ))
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>

              {/* Map */}
              <div
                className="mt-5 overflow-hidden rounded-2xl border border-border"
                data-aos="fade-up"
              >
                <iframe
                  title="AKD Hospitality Limited office location"
                  src="https://maps.google.com/maps?q=Continental%20Trade%20Centre%20Clifton%20Karachi&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  loading="lazy"
                  className="h-[300px] w-full border-0"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="min-w-0">
              <SectionHeading
                eyebrow="Enquiries"
                title="Send us a message"
                description={`Your message is delivered to ${company.contact.email}. We reply to the email address you provide.`}
              />

              <div className="mt-8" data-aos="fade-up">
                <ContactForm contactEmail={company.contact.email} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
