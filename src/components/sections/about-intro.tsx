import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getImages, getSetting } from "@/lib/content";

/**
 * About introduction for the home page.
 *
 * A four-tile row that alternates photography with a statement card, so the
 * vision and mission each sit beside their own image.
 */
type CompanyBlock = { intro: string; vision: string; mission: string };

export async function AboutIntro() {
  const [images, company] = await Promise.all([
    getImages(),
    getSetting<CompanyBlock>("company"),
  ]);
  // Settings are seeded and required by their schema; a missing block means
  // an unseeded database rather than something to render around.
  if (!company) return null;
  const vision = images["aboutMedia:vision"];
  const mission = images["aboutMedia:mission"];

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-16 lg:px-10 lg:py-24">
      {/* Intro: eyebrow left, headline and copy right */}
      <div className="grid items-start gap-6 lg:grid-cols-[180px_1fr] lg:gap-10">
        <div className="flex items-center gap-2.5 lg:pt-2" data-aos="fade-up">
          <span
            aria-hidden
            className="size-2 shrink-0 rounded-full bg-brand-accent"
          />
          <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-brand-navy">
            About Us
          </p>
        </div>

        {/* No width cap on the headline: it fills the column so the row does
            not leave a wide empty gutter on the right. */}
        <div data-aos="fade-up">
          <h2 className="text-[1.6rem] font-normal leading-[1.25] tracking-tight text-brand-navy sm:text-[2rem] lg:text-[2.4rem]">
            A joint stocks company since 1936, now directed at Pakistan&rsquo;s
            tourism sector &mdash; hospitality, motels, destination management
            and the development of tourism attractions.
          </h2>
          <p className="mt-5 max-w-4xl text-[15px] leading-relaxed text-foreground/75">
            {company.intro}
          </p>
        </div>
      </div>

      {/* Alternating media and statement tiles */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-5">
        {/* 1 - photograph */}
        <div
          data-aos="fade-up"
          className="relative min-h-[280px] overflow-hidden rounded-2xl lg:min-h-[430px]"
        >
          <Image
            src={vision.url}
            alt={vision.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        {/* 2 - vision statement */}
        <article
          data-aos="fade-up"
          data-aos-delay="100"
          className="flex min-h-[280px] flex-col rounded-2xl border border-border p-6 lg:min-h-[430px] lg:p-7"
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="max-w-[11.5rem] text-xl font-normal leading-snug text-brand-navy lg:text-[1.35rem]">
              AKD Hospitality&rsquo;s Vision
            </h3>
            <Link
              href="/about"
              aria-label="Read our vision statement"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-navy text-white transition-colors duration-300 hover:bg-brand-accent"
            >
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <p className="mt-6 text-[15px] leading-relaxed text-foreground/75">
            {company.vision}
          </p>
        </article>

        {/* 3 - photograph */}
        <div
          data-aos="fade-up"
          data-aos-delay="200"
          className="relative min-h-[280px] overflow-hidden rounded-2xl lg:min-h-[430px]"
        >
          <Image
            src={mission.url}
            alt={mission.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        {/* 4 - mission statement */}
        <article
          data-aos="fade-up"
          data-aos-delay="300"
          className="flex min-h-[280px] flex-col rounded-2xl bg-brand-navy p-6 lg:min-h-[430px] lg:p-7"
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="max-w-[11.5rem] text-xl font-normal leading-snug text-white lg:text-[1.35rem]">
              AKD Hospitality&rsquo;s Mission
            </h3>
            <Link
              href="/about"
              aria-label="Read our mission statement"
              className="grid size-11 shrink-0 place-items-center rounded-full border border-white/45 text-white transition-colors duration-300 hover:bg-white hover:text-brand-navy"
            >
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <p className="mt-6 text-[15px] leading-relaxed text-white/85">
            {company.mission}{" "}
            <Link
              href="/about"
              className="font-medium text-white underline underline-offset-4"
            >
              Read more
            </Link>
          </p>
        </article>
      </div>
    </section>
  );
}
