import Image from "next/image";
import {
  BarChart3,
  Check,
  Compass,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import { iconTint } from "@/lib/icon-tints";
import { cn } from "@/lib/utils";
import { getAboutLists, getImages, getSetting } from "@/lib/content";

/** One icon per pillar, in the order the annual report lists them. */
const pillarIcons = [ShieldCheck, Compass, TriangleAlert, BarChart3];

/**
 * Sustainability and ESG.
 *
 * Stands in for the "corporate values" slot a conglomerate site would use: the
 * Company publishes no values list, but it does publish a four-pillar ESG
 * framework, measured metrics and named policies, all of which are real and
 * attributable to the FY2025 annual report.
 */
type EsgHeader = { eyebrow: string; heading: string; intro: string };

export async function EsgFramework() {
  const [images, header, lists] = await Promise.all([
    getImages(),
    getSetting<EsgHeader>("esgHeader"),
    getAboutLists(),
  ]);
  if (!header) return null;
  const media = images["aboutSectionMedia:esg"];
  const esg = {
    ...header,
    pillars: lists.esgPillars,
    metrics: lists.esgMetrics,
    policies: lists.esgPolicies,
  };

  return (
    <section className="border-y border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center" data-aos="fade-up">
          <div className="flex items-center justify-center gap-2.5">
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full bg-brand-accent"
            />
            <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-brand-navy">
              {esg.eyebrow}
            </p>
          </div>
          <h2 className="mt-4 text-[1.75rem] font-medium leading-[1.15] tracking-tight text-brand-navy sm:text-[2.25rem]">
            {esg.heading}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-foreground/75">
            {esg.intro}
          </p>
        </div>

        {/* Four pillars */}
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {esg.pillars.map((pillar, index) => {
            const Icon = pillarIcons[index] ?? ShieldCheck;
            return (
            <li
              key={pillar.title}
              data-aos="fade-up"
              data-aos-delay={index * 90}
              className="group relative overflow-hidden rounded-2xl border border-border bg-background p-6 card-hover lg:p-7"
            >
              {/* Ghosted index, so the cards read as a sequence not a grid of tiles */}
              <span
                aria-hidden
                className="pointer-events-none absolute -top-3 right-4 text-[4.5rem] font-semibold leading-none text-brand-navy/[0.05]"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <span
                className={cn(
                  "relative grid size-11 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                  iconTint(index),
                )}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="relative mt-5 text-base font-medium text-brand-navy lg:text-lg">
                {pillar.title}
              </h3>
              <p className="relative mt-3 text-sm leading-relaxed text-foreground/70">
                {pillar.description}
              </p>
            </li>
            );
          })}
        </ol>

        {/* Feature image, to break the run of text-only blocks */}
        <div
          className="relative mt-6 h-44 overflow-hidden rounded-2xl sm:h-56 lg:mt-8 lg:h-64"
          data-aos="fade-up"
        >
          <Image
            src={media.url}
            alt={media.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Reported metrics + policies */}
        <div className="mt-6 grid gap-5 rounded-2xl border border-border bg-background p-6 lg:mt-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:p-8">
          <div data-aos="fade-up">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy">
              Reported metrics
            </h3>
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6">
              {esg.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt className="text-[1.6rem] font-medium leading-none text-brand-accent">
                    {metric.value}
                  </dt>
                  <dd className="mt-2 text-xs leading-snug text-foreground/70">
                    {metric.label}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              As reported for the year ended 30 June 2025 under the SECP&rsquo;s
              voluntary ESG guidelines.
            </p>
          </div>

          <div data-aos="fade-up" data-aos-delay="120">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy">
              Policies in place
            </h3>
            <ul className="mt-6 space-y-3">
              {esg.policies.map((policy) => (
                <li key={policy} className="flex gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-accent/10 text-brand-accent">
                    <Check className="size-3" aria-hidden />
                  </span>
                  <span className="text-sm leading-relaxed text-foreground/75">
                    {policy}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
