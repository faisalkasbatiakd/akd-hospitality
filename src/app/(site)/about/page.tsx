import type { Metadata } from "next";
import Image from "next/image";
import {
  BedDouble,
  Building2,
  Compass,
  Cpu,
  Eye,
  FerrisWheel,
  FileText,
  Hash,
  Hotel,
  Landmark,
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";

import { iconTint } from "@/lib/icon-tints";
import { cn } from "@/lib/utils";
import { getAboutLists, getImages, getSetting } from "@/lib/content";
import { ChairpersonReview } from "@/components/sections/chairperson-review";
import { EsgFramework } from "@/components/sections/esg-framework";
import { ogImage } from "@/lib/site";
import { PageSchema } from "@/components/seo/page-schema";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";

/** Strategic objectives, in the order the annual report lists them (p. 5). */
const strategyIcons = [Sparkles, TrendingUp, Leaf, Cpu];

/** Market-analysis workstreams, in deck order (CBS slide 21). */
const workstreamIcons = [MapPin, Users, BedDouble, FerrisWheel];

/** Lines of business, in the order they appear in the data file. */
const businessIcons = [Hotel, BedDouble, Compass, FerrisWheel];

/** Icon per statutory detail, keyed by the label in the data file. */
const corporateDetailIcons: Record<string, typeof FileText> = {
  "Company Secretary": UserRound,
  Auditors: ShieldCheck,
  "Share Registrar": Building2,
  "NTN No.": Hash,
  "Registration No.": Hash,
  Bankers: Landmark,
};

const pageTitle = "About Us";
const pageDescription =
  "Incorporated 1936 and quoted on the PSX as AKDHL. Vision and mission, the Chairperson's review, ESG framework and statutory company details.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/about" },
  keywords: [
    "AKD Hospitality about",
    "AKDHL company profile",
    "AKD Hospitality vision mission",
    "AKD Hospitality ESG",
    "Chairperson review",
    "Pakistan tourism company",
  ],
  openGraph: {
    type: "article",
    url: "/about",
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

type CompanyBlock = {
  name: string;
  formerName?: string;
  intro: string;
  vision: string;
  mission: string;
};
type StageBlock = { body: string[] };

export default async function AboutPage() {
  const [images, companyBlock, stage, lists] = await Promise.all([
    getImages(),
    getSetting<CompanyBlock>("company"),
    getSetting<StageBlock>("currentStage"),
    getAboutLists(),
  ]);
  if (!companyBlock) return null;

  // Shaped to match what this page used to import, so the markup below is
  // untouched: only the source of the values has moved.
  const company = {
    ...companyBlock,
    companyInformation: lists.companyInformation,
    businesses: lists.businesses,
    currentStage: {
      body: stage?.body ?? [],
      strategy: lists.strategy,
      workstreams: lists.workstreams,
      formatsUnderStudy: lists.formatsUnderStudy,
    },
  };
  const aboutMedia = {
    vision: images["aboutMedia:vision"],
    mission: images["aboutMedia:mission"],
  };
  const aboutSectionMedia = {
    strategy: images["aboutSectionMedia:strategy"],
    esg: images["aboutSectionMedia:esg"],
    marketAnalysis: images["aboutSectionMedia:marketAnalysis"],
  };
  return (
    <>
      <PageSchema
        path="/about"
        name={pageTitle}
        description={pageDescription}
        type="AboutPage"
      />

      <PageHero
        route="/about"
        title="About Us"
        description="A public limited company incorporated in 1936 and quoted on the Pakistan Stock Exchange, with a mandate across hospitality, motels, destination management and tourism attractions."
      />

      {/* Company profile + vision and mission */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <SectionHeading
          eyebrow="Company profile"
          title={company.name}
          description={company.formerName}
        />
        <p className="mt-6 max-w-4xl text-[15px] leading-relaxed text-foreground/75 md:text-base">
          {company.intro}
        </p>

        {/* Vision and mission, as stated in the FY2025 annual report (p. 5). */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {[
            {
              key: "vision",
              label: "Our Vision",
              icon: Eye,
              body: [company.vision],
              media: aboutMedia.vision,
            },
            {
              key: "mission",
              label: "Our Mission",
              icon: Target,
              body: [company.mission],
              media: aboutMedia.mission,
            },
          ].map((card, index) => {
            const Icon = card.icon;
            return (
              <article
                key={card.key}
                data-aos="fade-up"
                data-aos-delay={index * 120}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background card-hover"
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={card.media.url}
                    alt={card.media.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6 lg:p-8">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                        iconTint(index),
                      )}
                    >
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <h2 className="text-2xl font-medium tracking-tight text-brand-navy lg:text-[1.75rem]">
                      {card.label}
                    </h2>
                  </div>

                  {card.body.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 30)}
                      className="mt-4 text-[15px] leading-relaxed text-foreground/75"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        {/*
          Strategic objectives sit with vision and mission because that is how
          the FY2025 annual report presents them (p. 5), rather than with the
          market-analysis workstreams further down.
        */}
        <div
          className="mt-12 grid overflow-hidden rounded-2xl border border-border lg:grid-cols-[1fr_1.55fr]"
          data-aos="fade-up"
        >
          <div className="relative h-44 lg:h-auto lg:min-h-[260px]">
            <Image
              src={aboutSectionMedia.strategy.url}
              alt={aboutSectionMedia.strategy.alt}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="px-6 py-7 lg:px-8 lg:py-8">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy">
            Strategic objectives
          </h2>
          <ol className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {company.currentStage.strategy.map((item, index) => {
              const Icon = strategyIcons[index] ?? Sparkles;
              return (
                <li key={item} className="flex items-start gap-3.5">
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-xl",
                      iconTint(index),
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="pt-1.5 text-[15px] leading-snug text-foreground/80">
                    {item}
                  </span>
                </li>
              );
            })}
          </ol>
          </div>
        </div>
      </section>

      <ChairpersonReview />

      <EsgFramework />

      {/* Company information */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHeading
            eyebrow="Corporate details"
            title="Company Information"
            description="Statutory and advisory details of AKD Hospitality Limited."
          />

          {/*
            Boxed cards, matching the other sections on the page. `items-start`
            keeps each card at its natural height, so the short values do not
            leave the empty space a stretched grid row would.
          */}
          <div className="mt-10 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {company.companyInformation.map((item, index) => {
              const Icon = corporateDetailIcons[item.label] ?? FileText;
              return (
                <div
                  key={item.label}
                  data-aos="fade-up"
                  data-aos-delay={index * 70}
                  className="group rounded-2xl border border-border bg-background p-6 card-hover lg:p-7"
                >
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                      iconTint(index),
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>

                  <dl className="mt-5">
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {item.label}
                    </dt>
                    <dd className="mt-2 space-y-1">
                      {item.value.map((line) => (
                        <span
                          key={line}
                          className="block text-[15px] font-medium leading-snug text-brand-navy"
                        >
                          {line}
                        </span>
                      ))}
                    </dd>
                  </dl>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Current stage: market analysis, feasibilities, strategy */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHeading
            eyebrow="Where we are today"
            title="Market analysis and feasibility work"
            description="The Company's current activity under its tourism mandate, as reported in the FY2025 annual report and the Corporate Briefing Session of November 2025."
          />

          <div
            className="relative mt-10 h-48 overflow-hidden rounded-2xl sm:h-60 lg:h-72"
            data-aos="fade-up"
          >
            <Image
              src={aboutSectionMedia.marketAnalysis.url}
              alt={aboutSectionMedia.marketAnalysis.alt}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy">
                Market analysis under way
              </h3>
              <ul className="mt-5 divide-y divide-border border-y border-border">
                {company.currentStage.workstreams.map((item, index) => (
                  <li key={item.title} className="flex items-start gap-4 py-4">
                    <span
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-xl",
                        iconTint(index),
                      )}
                    >
                      {(() => {
                        const Icon = workstreamIcons[index] ?? MapPin;
                        return <Icon className="size-4" aria-hidden />;
                      })()}
                    </span>
                    <span>
                      <span className="block text-[15px] font-medium text-brand-navy">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-foreground/70">
                        {item.description}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-10">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy">
                  Formats under feasibility
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {company.currentStage.formatsUnderStudy.map((format) => (
                    <li
                      key={format}
                      className="rounded-full border border-border bg-background px-3.5 py-1.5 text-[13px] text-brand-navy transition-colors duration-300 hover:border-brand-accent/50"
                    >
                      {format}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Businesses */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <SectionHeading
          eyebrow="Operations"
          title="Lines of business"
          description="The principal line of business of the Company is tourism, together with the ancillary activities required to provide end-to-end service solutions."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {company.businesses.map((business, index) => {
            const Icon = businessIcons[index] ?? Hotel;
            const media = business.imageKey ? images[business.imageKey] : undefined;
            return (
              /*
                Photograph on the leading edge rather than across the top, so
                these read differently from the vision and mission cards higher
                up the page. Stacks on small screens.
              */
              <article
                key={business.title}
                data-aos="fade-up"
                data-aos-delay={index * 80}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border card-hover sm:flex-row"
              >
                {media && (
                  <div className="relative h-44 shrink-0 overflow-hidden sm:h-auto sm:w-[38%]">
                    <Image
                      src={media.url}
                      alt={media.alt}
                      fill
                      sizes="(min-width: 640px) 22vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6 lg:p-7">
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                      iconTint(index),
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-brand-navy lg:text-lg">
                    {business.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                    {business.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
