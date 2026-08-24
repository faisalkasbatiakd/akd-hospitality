import Image from "next/image";
import { AlertTriangle, PieChart, TrendingUp, Wallet } from "lucide-react";

import { iconTint } from "@/lib/icon-tints";
import { cn } from "@/lib/utils";
import {
  capital,
  financialSnapshot,
  goingConcernNotice,
  shareholding,
  sixYearData,
} from "@/data/financials";
import { getImages } from "@/lib/content";
import { SectionHeading } from "@/components/shared/section-heading";

const snapshotIcons = [Wallet, TrendingUp, PieChart];

/**
 * Financial snapshot, six-year record and shareholding pattern.
 *
 * This is the one place on the site where the numbers belong, because it is the
 * only place they can be given their proper context: the going-concern notice
 * sits immediately above them.
 */
export async function FinancialOverview() {
  const images = await getImages();
  const investorMedia = images.investorMedia;
  return (
    <>
      {/* Going concern first, so the figures below are never read alone */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 pt-16 md:pt-20">
          <div
            className="flex gap-4 rounded-2xl border border-amber-300/70 bg-amber-50/60 p-6 lg:p-7"
            data-aos="fade-up"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
              <AlertTriangle className="size-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-base font-medium text-brand-navy">
                {goingConcernNotice.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground/75">
                {goingConcernNotice.body}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                {goingConcernNotice.source}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Snapshot */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHeading
            eyebrow="Financial snapshot"
            title="FY2025 at a glance"
            description={financialSnapshot.periodLabel}
          />

          <dl className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {financialSnapshot.items.map((item, index) => {
              const Icon = snapshotIcons[index % snapshotIcons.length];
              return (
                <div
                  key={item.label}
                  data-aos="fade-up"
                  data-aos-delay={index * 70}
                  className="group rounded-2xl border border-border p-6 card-hover lg:p-7"
                >
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                      iconTint(index),
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <dt className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {item.label}
                  </dt>
                  <dd className="mt-2 text-[1.75rem] font-medium leading-none text-brand-navy">
                    {item.value}
                  </dd>
                  <p className="mt-2.5 text-xs leading-relaxed text-foreground/60">
                    {item.note}
                  </p>
                </div>
              );
            })}
          </dl>

          <p className="mt-6 text-xs text-muted-foreground">
            {financialSnapshot.source}
          </p>
        </div>
      </section>

      {/* Six-year record + capital */}
      <section className="border-y border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHeading
            eyebrow="Operating and financial data"
            title="Six-year record"
            description={sixYearData.caption}
          />

          <div
            className="mt-10 overflow-hidden rounded-2xl border border-border"
            data-aos="fade-up"
          >
            {/* Wide table scrolls inside its own container, never the page */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[46rem] border-collapse text-sm">
                <thead>
                  <tr className="bg-brand-navy text-white">
                    <th scope="col" className="px-5 py-3.5 text-left font-medium">
                      Particulars
                    </th>
                    {sixYearData.years.map((y) => (
                      <th
                        key={y}
                        scope="col"
                        className="px-5 py-3.5 text-right font-medium tabular-nums"
                      >
                        {y}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sixYearData.rows.map((row) => (
                    <tr key={row.label} className="border-t border-border">
                      <th
                        scope="row"
                        className="px-5 py-3.5 text-left font-normal text-brand-navy"
                      >
                        {row.label}
                      </th>
                      {row.values.map((v, i) => (
                        <td
                          key={sixYearData.years[i]}
                          className={cn(
                            "px-5 py-3.5 text-right tabular-nums",
                            v.startsWith("(")
                              ? "text-destructive"
                              : "text-foreground/85",
                          )}
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Figures in brackets are losses. {sixYearData.source}
          </p>

          <dl className="mt-10 grid gap-5 sm:grid-cols-2">
            {capital.map((c, index) => (
              <div
                key={c.label}
                data-aos="fade-up"
                data-aos-delay={index * 80}
                className="rounded-2xl border border-border p-6"
              >
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {c.label}
                </dt>
                <dd className="mt-2 text-xl font-medium text-brand-navy">
                  {c.value}
                </dd>
                <p className="mt-2 text-xs text-foreground/60">{c.note}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Shareholding */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHeading
            eyebrow="Shareholding"
            title="Pattern of shareholding"
            description={`${shareholding.asAt} — ${shareholding.totalShareholders} shareholders holding ${shareholding.totalShares} ordinary shares.`}
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:gap-8">
            {/* Categories, as proportion bars */}
            <div
              className="rounded-2xl border border-border p-6 lg:p-7"
              data-aos="fade-up"
            >
              <ul className="space-y-5">
                {shareholding.categories.map((c) => (
                  <li key={c.label}>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-sm text-brand-navy">{c.label}</span>
                      <span className="shrink-0 text-sm font-medium tabular-nums text-brand-accent">
                        {c.percent.toFixed(2)}%
                      </span>
                    </div>
                    <div
                      className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-navy/[0.07]"
                      role="presentation"
                    >
                      <span
                        className="block h-full rounded-full bg-brand-accent"
                        style={{ width: `${Math.max(c.percent, 0.6)}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-foreground/55">
                      {c.holders} holder{c.holders === "1" ? "" : "s"} ·{" "}
                      {c.shares} shares
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-muted-foreground">
                {shareholding.source}
              </p>
            </div>

            {/* Major holders + image */}
            <div className="flex flex-col gap-6">
              <div
                className="rounded-2xl bg-brand-navy p-6 text-white lg:p-7"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em]">
                  Holders of 10% or more
                </h3>
                <dl className="mt-6 space-y-5">
                  {shareholding.major.map((m) => (
                    <div
                      key={m.name}
                      className="border-b border-white/10 pb-4 last:border-0 last:pb-0"
                    >
                      <dt className="text-sm text-white/70">{m.name}</dt>
                      <dd className="mt-1.5 flex items-baseline gap-2">
                        <span className="text-2xl font-medium">{m.percent}</span>
                        <span className="text-xs text-white/55">
                          {m.shares} shares
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div
                className="relative min-h-[180px] flex-1 overflow-hidden rounded-2xl"
                data-aos="fade-up"
                data-aos-delay="180"
              >
                <Image
                  src={investorMedia.url}
                  alt={investorMedia.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
