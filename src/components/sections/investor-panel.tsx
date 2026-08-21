import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { company, investorPanel } from "@/data/company";

/**
 * Closing two-panel call to action: a statement card beside a photograph.
 *
 * The card carries the AKD monogram as a faint watermark, so the panel reads as
 * the Company's own without needing a second colour.
 */
export function InvestorPanel() {
  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1600px] px-5 py-14 lg:px-10 lg:py-16">
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          {/* Statement card */}
          <div
            className="relative flex min-h-[300px] flex-col justify-center overflow-hidden rounded-2xl border border-border bg-background p-8 lg:min-h-[420px] lg:p-12"
            data-aos="fade-up"
          >
            {/* Monogram watermark */}
            <Image
              src="/akd-logo-navy.png"
              alt=""
              aria-hidden
              width={87}
              height={54}
              className="pointer-events-none absolute -right-4 -top-2 h-32 w-auto opacity-[0.06] lg:h-44"
            />

            <div className="relative">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="size-2 shrink-0 rounded-full bg-brand-accent"
                />
                <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-brand-navy">
                  {investorPanel.eyebrow}
                </p>
              </div>

              <h2 className="mt-5 text-[2rem] font-medium leading-[1.1] tracking-tight text-brand-navy lg:text-[2.75rem]">
                {investorPanel.heading}
              </h2>

              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-foreground/75">
                {investorPanel.body}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={investorPanel.ctaHref}
                  className="group inline-flex items-center gap-3 rounded-full border border-brand-navy/25 py-1.5 pl-6 pr-1.5 text-sm font-medium text-brand-navy transition-colors duration-300 hover:border-brand-navy"
                >
                  {investorPanel.ctaLabel}
                  <span className="grid size-10 place-items-center rounded-full bg-brand-navy text-white transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                </Link>

                <a
                  href={`mailto:${company.contact.investorEmail}`}
                  className="-my-2.5 inline-block py-2.5 text-sm [overflow-wrap:anywhere] text-brand-accent underline-offset-4 hover:underline"
                >
                  {company.contact.investorEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Photograph */}
          <div
            className="relative min-h-[240px] overflow-hidden rounded-2xl lg:min-h-[420px]"
            data-aos="fade-up"
          >
            <Image
              src={investorPanel.image}
              alt={investorPanel.imageAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
