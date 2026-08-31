import {
  BadgeCheck,
  BarChart3,
  Briefcase,
  FileText,
  Gauge,
  Landmark,
  Leaf,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";

import { SdgBadges } from "@/components/shared/sdg-badges";
import {
  deiPolicySections,
  esgPolicySections,
  sdgNames,
  sdgReferenced,
  type PolicyItem,
} from "@/data/esg-policy";
import { iconTint } from "@/lib/icon-tints";
import { cn } from "@/lib/utils";

/**
 * Stable anchor for a heading, so an individual policy section can be linked to
 * or cited. Policy documents get quoted section by section; a page that can only
 * be linked as a whole makes that harder than it needs to be.
 */
export function sectionId(prefix: string, heading: string) {
  return `${prefix}-${heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

/** One icon per ESG section, in the order the Company's document sets them out. */
const esgIcons = [FileText, Leaf, Users, Scale, Gauge, BadgeCheck];

/** One per DE&I section, likewise. */
const deiIcons = [Briefcase, Landmark, ShieldCheck];

/**
 * A commitment, with its goals set beside it rather than inside the sentence.
 *
 * Deliberately a plain list and not an accordion. This is policy text: someone
 * arrives to check whether a specific commitment exists, and to quote it. Text
 * hidden behind a control cannot be searched with the browser's own find, does
 * not print, and does not survive being copied.
 */
function Commitments({ items, idPrefix }: { items: PolicyItem[]; idPrefix: string }) {
  return (
    <ul className="mt-4 space-y-3.5">
      {items.map((item, index) => (
        <li
          key={`${idPrefix}-${index}`}
          className="flex gap-3 text-[15px] leading-relaxed text-foreground/80"
        >
          <span
            aria-hidden
            className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-brand-accent/50"
          />
          <span className="min-w-0">
            {item.text}
            {item.sdg.length > 0 && (
              <SdgBadges goals={item.sdg} className="ml-2 align-middle" />
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Contents list for both documents, sticky beside the text on a wide screen. */
export function PolicyContents() {
  return (
    <nav
      aria-label="On this page"
      className="min-w-0 lg:sticky lg:top-10 lg:self-start"
    >
      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        On this page
      </h2>

      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent">
        ESG Policy
      </p>
      <ol className="mt-2 space-y-0.5 border-l border-border">
        {esgPolicySections.map((section) => (
          <li key={section.number}>
            <a
              href={`#${sectionId("esg", section.title)}`}
              className="-ml-px flex gap-2.5 border-l-2 border-transparent py-1.5 pl-4 text-sm text-foreground/70 transition-colors duration-300 hover:border-brand-accent hover:text-brand-navy"
            >
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {section.number}.
              </span>
              <span className="min-w-0">{section.title}</span>
            </a>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent">
        Diversity, Equity &amp; Inclusion
      </p>
      <ol className="mt-2 space-y-0.5 border-l border-border">
        {deiPolicySections.map((section) => (
          <li key={section.title}>
            <a
              href={`#${sectionId("dei", section.title)}`}
              className="-ml-px flex border-l-2 border-transparent py-1.5 pl-4 text-sm text-foreground/70 transition-colors duration-300 hover:border-brand-accent hover:text-brand-navy"
            >
              <span className="min-w-0">{section.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** The ESG Policy: six numbered sections, most with numbered subsections. */
export function EsgPolicyDocument() {
  return (
    <div className="space-y-14">
      {esgPolicySections.map((section, index) => {
        const Icon = esgIcons[index % esgIcons.length];
        return (
          <article
            key={section.number}
            id={sectionId("esg", section.title)}
            data-aos="fade-up"
            className="scroll-mt-10 border-t border-border pt-10 first:border-0 first:pt-0"
          >
            <h3 className="flex items-baseline gap-3.5">
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center self-start rounded-lg",
                  iconTint(index),
                )}
                aria-hidden
              >
                <Icon className="size-[18px]" />
              </span>
              <span className="min-w-0 text-xl font-medium leading-snug text-brand-navy">
                <span className="mr-2 tabular-nums text-muted-foreground">
                  {section.number}.
                </span>
                {section.title}
              </span>
            </h3>

            {/* Commitments stated before any subsection. */}
            {section.items.length > 0 && (
              <div className="pl-[3.125rem]">
                <Commitments items={section.items} idPrefix={`esg-${section.number}`} />
              </div>
            )}

            {section.groups.map((group) => (
              <div
                key={group.number}
                id={sectionId("esg", `${group.number} ${group.title}`)}
                className="mt-8 scroll-mt-10 pl-[3.125rem]"
              >
                <h4 className="text-base font-medium leading-snug text-brand-navy">
                  <span className="mr-2 tabular-nums text-muted-foreground">
                    {group.number}
                  </span>
                  {group.title}
                </h4>
                <Commitments items={group.items} idPrefix={`esg-${group.number}`} />
              </div>
            ))}
          </article>
        );
      })}
    </div>
  );
}

/**
 * The DE&I policies: a statement of intent under each heading, then the
 * procedures that carry it out. The source document's own two-part shape, kept
 * rather than flattened, because "what we intend" and "what we will do about it"
 * are different kinds of statement and a reader is usually after the second.
 */
export function DeiPolicyDocument() {
  return (
    <div className="space-y-14">
      {deiPolicySections.map((section, index) => {
        const Icon = deiIcons[index % deiIcons.length];
        return (
          <article
            key={section.title}
            id={sectionId("dei", section.title)}
            data-aos="fade-up"
            className="scroll-mt-10 border-t border-border pt-10 first:border-0 first:pt-0"
          >
            <h3 className="flex items-baseline gap-3.5">
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center self-start rounded-lg",
                  iconTint(index + 2),
                )}
                aria-hidden
              >
                <Icon className="size-[18px]" />
              </span>
              <span className="min-w-0 text-xl font-medium leading-snug text-brand-navy">
                {section.title}
                {section.sdg.length > 0 && (
                  <SdgBadges goals={section.sdg} className="ml-2.5 align-middle" />
                )}
              </span>
            </h3>

            <div className="pl-[3.125rem]">
              {section.policy && (
                <p className="mt-4 border-l-2 border-brand-accent/30 pl-4 text-[15px] leading-relaxed text-foreground/80">
                  {section.policy}
                </p>
              )}

              {section.items.length > 0 && (
                <>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Procedures
                  </p>
                  <Commitments items={section.items} idPrefix={`dei-${index}`} />
                </>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

/**
 * What the goal numbers mean.
 *
 * At the foot of the page rather than the head: it is reference material, and
 * putting seventeen definitions above the policy would make the reader scroll
 * past a glossary to reach the thing they came for.
 */
export function SdgLegend() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <h2 className="flex items-center gap-2.5 text-sm font-semibold text-brand-navy">
          <BarChart3 className="size-4 text-brand-accent" aria-hidden />
          UN Sustainable Development Goals referenced
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          The Company tags each commitment above with the goals it serves. All
          seventeen are referenced across the two policies.
        </p>
        <ul className="mt-6 grid gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {sdgReferenced.map((n) => (
            <li key={n} className="flex gap-2.5 text-sm text-foreground/80">
              <span className="w-6 shrink-0 text-right font-medium tabular-nums text-brand-accent">
                {n}
              </span>
              <span className="min-w-0">{sdgNames[n]}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
