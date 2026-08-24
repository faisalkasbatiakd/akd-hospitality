import Image from "next/image";

import { getImages } from "@/lib/content";

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
export async function PageHero({ title, description, route }: PageHeroProps) {
  const images = await getImages();
  // Falls back to the shared hero, then to nothing rendering rather than a
  // broken image, if an editor has somehow cleared the slot.
  const media =
    (route ? images[`pageHero:${route}`] : undefined) ??
    images["pageHero:default"];

  /**
   * Both slots would have to be missing for this - only reachable if the images
   * table were emptied. Better a plain navy band than a broken image, and the
   * title still reads.
   */
  if (!media) {
    return (
      <section className="flex min-h-[300px] items-center justify-center bg-brand-navy-dark px-5 py-16 text-center">
        <div>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/80">
              {description}
            </p>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate flex min-h-[300px] items-center justify-center overflow-hidden sm:min-h-[360px] lg:min-h-[420px]">
      <Image
        src={media.url}
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
