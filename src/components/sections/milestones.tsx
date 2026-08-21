"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { milestones } from "@/data/company";

/**
 * Corporate timeline.
 *
 * Uses Embla rather than a scrolling overflow container: its viewport is
 * `overflow: hidden`, so the wide track is fully contained and cannot push the
 * page into horizontal scroll, and there is no native scrollbar on show.
 */
export function Milestones() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect).on("reInit", onSelect);
    // Subscribe first, then ask Embla to re-measure: the reInit event delivers
    // the initial button state, so nothing is set from the effect body itself.
    emblaApi.reInit();
    return () => {
      emblaApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const arrowClass = (enabled: boolean) =>
    cn(
      "grid size-11 place-items-center rounded-full border transition-colors duration-300",
      enabled
        ? "border-white/30 text-white hover:bg-white/15"
        : "cursor-not-allowed border-white/10 text-white/25",
    );

  return (
    <section className="overflow-hidden bg-brand-navy-dark">
      <div className="mx-auto max-w-[1600px] px-5 py-16 lg:px-10 lg:py-20">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center" data-aos="fade-up">
          <div className="flex items-center justify-center gap-2.5">
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full bg-brand-sky"
            />
            <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-white">
              Story of Progress
            </p>
          </div>

          <h2 className="mt-4 text-[1.75rem] font-medium leading-[1.15] tracking-tight text-white sm:text-[2.25rem] lg:text-[2.6rem]">
            Milestones That Define Us
          </h2>

          <p className="mt-4 text-[15px] leading-relaxed text-white/70">
            From a 1936 incorporation to a tourism and hospitality mandate, as
            reported in the Company&rsquo;s annual report and corporate
            briefings.
          </p>
        </div>

        {/* Controls */}
        <div className="mt-10 flex justify-end gap-2 lg:mt-12">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            aria-label="Previous milestones"
            className={arrowClass(canPrev)}
          >
            <ArrowLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            aria-label="Next milestones"
            className={arrowClass(canNext)}
          >
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>

        {/* Track */}
        <div className="mt-5 overflow-hidden" ref={emblaRef}>
          <ol className="flex">
            {milestones.map((item, index) => (
              <li
                key={item.year}
                className="flex min-w-0 shrink-0 grow-0 basis-[80%] flex-col sm:basis-[46%] lg:basis-[25%]"
                data-aos="fade-up"
                data-aos-delay={index * 80}
              >
                <div className="pb-12 pr-8">
                  <p className="text-[2.25rem] font-medium leading-none text-brand-sky lg:text-[2.5rem]">
                    {item.year}
                  </p>
                  <p className="mt-4 text-[15px] font-medium text-white">
                    {item.title}
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/60">
                    {item.description}
                  </p>
                </div>

                {/*
                  Rule sits in its own block with a guaranteed gap above it, and
                  spans the full slide width so adjacent rules join into one
                  continuous line. The node is pulled up by half its height to
                  centre on the rule.
                */}
                <div className="mt-auto border-t border-white/15 pt-0">
                  <span
                    aria-hidden
                    className="-mt-[7px] block size-3.5 rounded-full bg-brand-sky ring-4 ring-brand-navy-dark"
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
