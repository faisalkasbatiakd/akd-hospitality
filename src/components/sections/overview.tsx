import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { company, overviewMedia } from "@/data/company";

/**
 * Overview of where the Company currently stands.
 *
 * Content comes from the FY2025 annual report and the Corporate Briefing
 * Session decks. The figures shown are corporate facts rather than financial
 * results: the FY2025 audit report carries a material uncertainty relating to
 * going concern, so a growth-figures treatment would misrepresent the position.
 *
 * Sits on the page background with a hairline rule above it, so it separates
 * from the section before without introducing a second surface colour.
 */
export function Overview() {
  const { currentStage } = company;

  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1600px] px-5 py-14 lg:px-10 lg:py-16">
        {/* Heading row */}
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
          <div data-aos="fade-up">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-full bg-brand-accent"
              />
              <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-brand-navy">
                {currentStage.eyebrow}
              </p>
            </div>
            <h2 className="mt-4 max-w-xl text-[1.6rem] font-normal leading-[1.2] tracking-tight text-brand-navy sm:text-[2rem] lg:text-[2.3rem]">
              {currentStage.heading}
            </h2>
          </div>

          <div className="space-y-3 lg:pt-1" data-aos="fade-up">
            {currentStage.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-[15px] leading-relaxed text-foreground/75"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Media row: tall photograph beside a photograph with the figures below */}
        <div className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-2 lg:gap-6">
          <div
            data-aos="fade-up"
            className="relative h-[240px] overflow-hidden rounded-2xl sm:h-[320px] lg:h-[430px]"
          >
            <Image
              src={overviewMedia.primary.image}
              alt={overviewMedia.primary.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col" data-aos="fade-up" data-aos-delay="120">
            <div className="relative h-[200px] overflow-hidden rounded-2xl sm:h-[240px] lg:h-[270px]">
              <Image
                src={overviewMedia.secondary.image}
                alt={overviewMedia.secondary.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* Corporate facts */}
            <dl className="mt-6 grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:divide-x sm:divide-border">
              {currentStage.facts.map((fact, index) => (
                <div key={fact.label} className={index > 0 ? "sm:pl-5" : ""}>
                  <dt className="text-[1.75rem] font-medium leading-none text-brand-accent">
                    {fact.value}
                  </dt>
                  <dd className="mt-2 text-xs font-medium uppercase leading-snug tracking-[0.08em] text-foreground/70">
                    {fact.label}
                  </dd>
                </div>
              ))}
            </dl>

            <Link
              href="/about"
              className="group mt-7 inline-flex w-fit items-center gap-3 rounded-full border border-brand-navy/25 py-1.5 pl-6 pr-1.5 text-sm font-medium text-brand-navy transition-colors duration-300 hover:border-brand-navy"
            >
              Learn More
              <span className="grid size-10 place-items-center rounded-full bg-brand-navy text-white transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="size-4" aria-hidden />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
