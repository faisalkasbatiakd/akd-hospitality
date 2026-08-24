"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

const SLIDE_MS = 7000;

export type HeroSlide = { image: string; alt: string; credit?: string };
export type HeroHighlight = {
  title: string;
  body: string;
  href: string;
  linkLabel: string;
};

/**
 * Slides and highlights come from the server so they are editable in the
 * dashboard. The carousel timers remain client state.
 */
export function HomeHero({
  heroSlides,
  heroHighlights,
}: {
  heroSlides: HeroSlide[];
  heroHighlights: HeroHighlight[];
}) {
  const [slide, setSlide] = useState(0);
  const [highlight, setHighlight] = useState(0);

  const slideCount = heroSlides.length;
  const highlightCount = heroHighlights.length;

  const goHighlight = useCallback(
    (direction: 1 | -1) =>
      setHighlight((i) => (i + direction + highlightCount) % highlightCount),
    [highlightCount],
  );

  // Cross-fade the background imagery on its own timer.
  useEffect(() => {
    if (slideCount < 2) return;
    const timer = window.setInterval(
      () => setSlide((i) => (i + 1) % slideCount),
      SLIDE_MS,
    );
    return () => window.clearInterval(timer);
  }, [slideCount]);

  /**
   * Both lists are editable now, so neither index can be trusted: the
   * highlight panel simply does not render when there is nothing to show.
   */
  const currentHighlight =
    highlightCount > 0 ? heroHighlights[highlight % highlightCount] : null;

  return (
    <section className="relative isolate flex min-h-[calc(100svh-3rem)] flex-col justify-end overflow-hidden">
      {/* Background slides */}
      {heroSlides.map((item, index) => (
        <div
          key={item.image}
          aria-hidden={index !== slide}
          className={cn(
            "absolute inset-0 -z-10 transition-opacity duration-1000 ease-in-out",
            index === slide ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={item.image}
            alt={index === slide ? item.alt : ""}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      {/* Legibility scrims */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/25 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/55 via-transparent to-black/25"
      />

      {/* Content */}
      <div className="mx-auto w-full max-w-[1600px] px-5 pb-10 pt-28 lg:px-10 lg:pb-12 lg:pt-32">
        <div className="grid items-end gap-8 lg:grid-cols-[1.15fr_auto]">
          {/* Headline */}
          <div className="max-w-2xl" data-aos="fade-up" data-aos-delay="100">
            <h1 className="text-[2.75rem] font-bold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[4rem]">
              Built on Trust
            </h1>
            <span className="mt-4 block h-1 w-24 rounded-full bg-brand-sky" />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 lg:text-lg">
              Incorporated in 1936 and quoted on the Pakistan Stock Exchange,
              with a mandate across hospitality, motels, destination management
              and tourism attractions.
            </p>

            <Link
              href="/about"
              className="group mt-7 inline-flex items-center gap-3 rounded-full border border-white/35 py-1.5 pl-6 pr-1.5 text-sm font-semibold text-white transition-colors hover:bg-white/15"
            >
              About Us
              <span className="grid size-10 place-items-center rounded-full bg-white text-brand-navy transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="size-4" aria-hidden />
              </span>
            </Link>
          </div>

          {/* Highlight glass card */}
          {currentHighlight ? (
          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="w-full rounded-2xl border border-white/25 bg-white/12 p-5 shadow-2xl backdrop-blur-md lg:w-[400px] lg:p-6">
            <div className="flex items-start justify-between gap-4">
              <h2 className="flex items-center gap-2.5 text-2xl font-semibold text-white lg:text-[1.75rem]">
                <span
                  aria-hidden
                  className="size-2 shrink-0 rounded-full bg-brand-sky"
                />
                {currentHighlight.title}
              </h2>

              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => goHighlight(-1)}
                  aria-label="Previous highlight"
                  className="grid size-9 place-items-center rounded-full text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <ArrowLeft className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => goHighlight(1)}
                  aria-label="Next highlight"
                  className="grid size-9 place-items-center rounded-full text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <ArrowRight className="size-4" aria-hidden />
                </button>
              </div>
            </div>

            <p
              aria-live="polite"
              className="mt-4 text-[15px] leading-relaxed text-white/85"
            >
              {currentHighlight.body}
            </p>

            <Link
              href={currentHighlight.href}
              className="-mb-2.5 mt-2.5 inline-block py-2.5 text-sm font-semibold text-brand-sky underline underline-offset-4 transition-opacity hover:opacity-80"
            >
              {currentHighlight.linkLabel}
            </Link>
          </div>
          ) : null}
        </div>

        {/* Slide indicators */}
        <div className="mt-8 flex items-center gap-2">
          {heroSlides.map((item, index) => (
            // Padding gives a 44px-tall hit area; the visible mark stays thin.
            <button
              key={item.image}
              type="button"
              onClick={() => setSlide(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === slide}
              className="group/dot -my-5 px-1 py-5"
            >
              <span
                className={cn(
                  "block h-1 rounded-full transition-[width,background-color] duration-300 ease-out",
                  index === slide
                    ? "w-10 bg-brand-sky"
                    : "w-5 bg-white/40 group-hover/dot:bg-white/70",
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
