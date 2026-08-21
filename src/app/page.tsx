import type { Metadata } from "next";

import { StructuredData } from "@/components/seo/structured-data";
import { AboutIntro } from "@/components/sections/about-intro";
import { InvestorPanel } from "@/components/sections/investor-panel";
import { Milestones } from "@/components/sections/milestones";
import { Overview } from "@/components/sections/overview";
import { HomeHero } from "@/components/sections/home-hero";

import { company } from "@/data/company";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  // Home keeps the site-level title verbatim rather than running through the
  // "%s | AKD Hospitality Limited" template, which would repeat the name.
  title: {
    absolute: "AKD Hospitality Limited | PSX-Listed Tourism Company",
  },
  description:
    "AKD Hospitality Limited (AKDHL): incorporated 1936 and quoted on the Pakistan Stock Exchange. Vision, governance, investor reports and company information.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <StructuredData />

      <HomeHero />

      {/* ---------------- Key figures ---------------- */}
      <section className="border-b border-border bg-brand-navy">
        <dl className="mx-auto grid max-w-[1600px] grid-cols-2 gap-y-6 px-5 py-8 md:grid-cols-4 md:divide-x md:divide-white/10 lg:px-10">
          {company.stats.map((stat, index) => (
            <div
              key={stat.label}
              className="md:px-8"
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
              <dt className="text-xs uppercase tracking-[0.16em] text-white/60">
                {stat.label}
              </dt>
              <dd className="mt-1.5 text-2xl font-semibold text-white">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <AboutIntro />

      <Overview />

      <Milestones />

      {/* ---------------- AKD Group ---------------- */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div
          className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16"
          data-aos="fade-up"
        >
          <SectionHeading
            eyebrow="Our parent group"
            title={company.group.title}
            description="One of the premier business enterprises in Pakistan, with interests spanning financial services, telecom, infrastructure, manufacturing and natural resources."
          />
          <div className="space-y-4">
            {company.group.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-sm leading-relaxed text-muted-foreground md:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <InvestorPanel />
    </>
  );
}
