import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileCheck2 } from "lucide-react";

import { PageHero } from "@/components/shared/page-hero";
import { PageSchema } from "@/components/seo/page-schema";
import {
  DeiPolicyDocument,
  EsgPolicyDocument,
  PolicyContents,
  SdgLegend,
} from "@/components/sections/policy-documents";
import {
  deiPolicySections,
  deiPolicyTitle,
  esgPolicySections,
  esgPolicyTitle,
} from "@/data/esg-policy";
import { getCompany } from "@/lib/content";
import { ogImage } from "@/lib/site";

const pageTitle = "ESG & Sustainability Policy";
const pageDescription =
  "AKD Hospitality Limited's ESG Policy and its policies for promoting diversity, equity and inclusion, with each commitment mapped to the UN Sustainable Development Goals.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/esg" },
  openGraph: {
    type: "article",
    url: "/esg",
    title: pageTitle,
    description: pageDescription,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
  },
};

/**
 * The Company's ESG and DE&I policies in full.
 *
 * These are not new claims. The FY2025 annual report already lists, among the
 * Company's policies, a "formal environmental policy covering waste, water,
 * energy and recycling" and "anti-harassment and diversity, equity and inclusion
 * policies" - and the ESG framework on /about is built from that report. This
 * page publishes the text of those policies, so the framework there stops being
 * a list of titles and becomes something a shareholder can actually read.
 *
 * The two documents are kept apart rather than merged. They were approved
 * separately, they overlap in places, and interleaving them would produce a
 * third document that the Board never saw.
 */
export default async function EsgPage() {
  const company = await getCompany();
  // Seeded and schema-required; null means an unseeded database.
  if (!company) return null;

  const commitments =
    esgPolicySections.reduce(
      (n, s) => n + s.items.length + s.groups.reduce((m, g) => m + g.items.length, 0),
      0,
    ) + deiPolicySections.reduce((n, s) => n + s.items.length, 0);

  return (
    <>
      <PageSchema
        path="/esg"
        name={pageTitle}
        description={pageDescription}
        type="WebPage"
      />

      <PageHero
        route="/esg"
        title={pageTitle}
        description="How the Company intends to operate: its environmental, social and governance commitments, and its policies on diversity, equity and inclusion."
      />

      {/* What these documents are, and how they relate to the annual report. */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-12">
            <div className="max-w-3xl" data-aos="fade-up">
              <p className="text-[15px] leading-relaxed text-foreground/80">
                Two documents are published here in full: the{" "}
                <strong className="font-medium text-brand-navy">
                  {esgPolicyTitle}
                </strong>{" "}
                and the{" "}
                <strong className="font-medium text-brand-navy">
                  {deiPolicyTitle}
                </strong>
                . Together they set out {commitments} commitments, each mapped by
                the Company to the UN Sustainable Development Goals it serves.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-foreground/80">
                These are the policies referred to in the Company&rsquo;s FY2025
                annual report, whose four-pillar ESG framework and measured
                environmental indicators are set out on the About page.
              </p>
              <Link
                href="/about#esg"
                className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-accent transition-colors duration-300 hover:text-brand-navy"
              >
                The ESG framework and reported metrics
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div
              className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-5 lg:max-w-xs"
              data-aos="fade-up"
              data-aos-delay="80"
            >
              <FileCheck2
                className="mt-0.5 size-5 shrink-0 text-brand-accent"
                aria-hidden
              />
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Reproduced as supplied by the Company. Approved by the Board and
                signed by the Chief Executive, and reviewed annually under the
                policy&rsquo;s own terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The documents, with a contents list that sticks beside them. */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
            <PolicyContents />

            <div className="min-w-0 space-y-20">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">
                  {esgPolicyTitle}
                </h2>
                <div className="mt-8">
                  <EsgPolicyDocument />
                </div>
              </div>

              <div className="border-t border-border pt-16">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-accent">
                  {deiPolicyTitle}
                </h2>
                <div className="mt-8">
                  <DeiPolicyDocument />
                </div>
              </div>

              <p className="border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
                Questions about these policies should be directed to the Company
                Secretary at {company.contact.email}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SdgLegend />
    </>
  );
}
