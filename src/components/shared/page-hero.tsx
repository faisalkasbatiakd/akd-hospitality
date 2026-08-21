import Image from "next/image";

import { defaultPageHero, pageHeroes } from "@/data/page-heroes";

type PageHeroProps = {
  title: string;
  description?: string;
  /** Route key used to pick the background image, e.g. "/about". */
  route?: string;
};

/**
 * Banner for inner pages.
 *
 * Shares the home hero's language - full-bleed photograph, neutral scrims, the
 * light-blue accent rule - but reads as a different tier: it is a fixed band
 * rather than full viewport height, and the title is centred where the home
 * headline is left aligned.
 */
export function PageHero({ title, description, route }: PageHeroProps) {
  const media = (route && pageHeroes[route]) || defaultPageHero;

  return (
    <section className="relative isolate flex min-h-[300px] items-center justify-center overflow-hidden sm:min-h-[360px] lg:min-h-[420px]">
      <Image
        src={media.image}
        alt={media.alt}
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />

      {/* Neutral scrims: keep the photograph's own colour, keep text legible. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-brand-navy-dark/55"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/55 via-black/20 to-black/35"
      />

      <div className="mx-auto w-full max-w-[1600px] px-5 pb-10 pt-28 text-center lg:px-10 lg:pb-12 lg:pt-32">
        <h1 className="text-[2.25rem] font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
          {title}
        </h1>

        <span className="mx-auto mt-5 block h-1 w-20 rounded-full bg-brand-sky" />

        {description && (
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/80 lg:text-base">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
