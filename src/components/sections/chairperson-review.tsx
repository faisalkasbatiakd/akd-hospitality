import Image from "next/image";
import { Quote } from "lucide-react";

import { getSetting } from "@/lib/content";

/**
 * Chairperson's Review.
 *
 * Every sentence attributed to the Chairperson is quoted verbatim from the
 * FY2025 annual report. No portrait exists in any published Company document,
 * so the right-hand panel presents verified board facts rather than a stock
 * photograph of someone who is not him.
 */
type ReviewBlock = {
  eyebrow: string;
  heading: string;
  quotes: string[];
  pullQuote: string;
  signatory: string;
  signatoryRole: string;
  place: string;
  date: string;
  boardFacts: { value: string; label: string }[];
};

export async function ChairpersonReview() {
  const chairpersonReview = await getSetting<ReviewBlock>("chairpersonReview");
  if (!chairpersonReview) return null;

  const review = chairpersonReview;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        {/* Review */}
        <div data-aos="fade-up">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full bg-brand-accent"
            />
            <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-brand-navy">
              {review.eyebrow}
            </p>
          </div>

          <h2 className="mt-4 max-w-xl text-[1.6rem] font-medium leading-[1.2] tracking-tight text-brand-navy sm:text-[2rem] lg:text-[2.25rem]">
            {review.heading}
          </h2>

          <div className="mt-6 space-y-4">
            {review.quotes.map((quote) => (
              <p
                key={quote.slice(0, 40)}
                className="text-[15px] leading-relaxed text-foreground/75"
              >
                &ldquo;{quote}&rdquo;
              </p>
            ))}
          </div>

          {/* Pull quote */}
          <figure className="mt-8 border-l-2 border-brand-accent pl-6">
            <Quote
              className="size-7 text-brand-accent/40"
              aria-hidden
            />
            <blockquote className="mt-3 text-lg leading-snug text-brand-navy lg:text-xl">
              &ldquo;{review.pullQuote}&rdquo;
            </blockquote>
            <figcaption className="mt-5">
              <span className="block text-sm font-semibold uppercase tracking-[0.08em] text-brand-accent">
                {review.signatory}
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {review.signatoryRole} &nbsp;·&nbsp; {review.place},{" "}
                {review.date}
              </span>
            </figcaption>
          </figure>
        </div>

        {/* Board facts, in place of a portrait */}
        <aside
          className="relative overflow-hidden rounded-2xl bg-brand-navy p-7 lg:self-start lg:p-8"
          data-aos="fade-up"
          data-aos-delay="120"
        >
          <Image
            src="/akd-logo-white.png"
            alt=""
            aria-hidden
            width={87}
            height={54}
            className="pointer-events-none absolute -right-3 -top-2 h-28 w-auto opacity-[0.07]"
          />

          <h3 className="relative text-xs font-semibold uppercase tracking-[0.16em] text-white">
            The Board
          </h3>

          <dl className="relative mt-7 space-y-6">
            {review.boardFacts.map((fact) => (
              <div
                key={fact.label}
                className="border-b border-white/10 pb-5 last:border-0 last:pb-0"
              >
                <dt className="text-[1.75rem] font-medium leading-none text-white">
                  {fact.value}
                </dt>
                <dd className="mt-2 text-xs uppercase tracking-[0.08em] text-white/60">
                  {fact.label}
                </dd>
              </div>
            ))}
          </dl>

          <p className="relative mt-7 text-xs leading-relaxed text-white/55">
            As reported for the year ended 30 June 2025.
          </p>
        </aside>
      </div>
    </section>
  );
}
