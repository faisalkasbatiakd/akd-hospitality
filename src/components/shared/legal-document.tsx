import { Scale } from "lucide-react";

import { cn } from "@/lib/utils";

export type LegalSection = {
  heading: string;
  body: readonly string[];
};

type LegalDocumentProps = {
  /** Short lead paragraph shown above the clauses. */
  intro: string;
  sections: readonly LegalSection[];
  /** Where the substance of the document comes from, if it cites anything. */
  note?: string;
  className?: string;
};

/** Stable anchor id so an individual clause can be linked to or cited. */
function clauseId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Shared layout for the Terms of Use and Disclaimer pages.
 *
 * These two pages were the last on the site still rendering as an undifferentiated
 * column of grey text. Legal copy is read differently from marketing copy - people
 * arrive looking for one clause - so the emphasis here is navigation and
 * citability rather than decoration:
 *
 *  * a contents list that sticks beside the text on a wide screen, so the reader
 *    always knows how long the document is and can jump within it;
 *  * an anchor id on every clause, so a specific term can be linked or quoted;
 *  * numbered clauses separated by rules instead of boxed in cards, because ten
 *    stacked cards read worse than continuous prose for text this dense.
 *
 * Body text uses the normal foreground colour rather than muted grey: this is
 * the binding text of the page, not a caption.
 */
export function LegalDocument({
  intro,
  sections,
  note,
  className,
}: LegalDocumentProps) {
  return (
    <section className={cn("bg-background", className)}>
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
          {/* Contents */}
          <nav aria-label="On this page" className="min-w-0 lg:sticky lg:top-10 lg:self-start">
            <h2 className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Scale className="size-4 text-brand-accent" aria-hidden />
              On this page
            </h2>
            <ol className="mt-5 space-y-0.5 border-l border-border">
              {sections.map((section, index) => (
                <li key={section.heading}>
                  <a
                    href={`#${clauseId(section.heading)}`}
                    className="-ml-px flex gap-2.5 border-l-2 border-transparent py-2 pl-4 text-sm text-foreground/70 transition-colors duration-300 hover:border-brand-accent hover:text-brand-navy"
                  >
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      {index + 1}.
                    </span>
                    <span className="min-w-0">{section.heading}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Clauses */}
          <div className="min-w-0">
            <p
              className="text-[15px] leading-relaxed text-foreground/80"
              data-aos="fade-up"
            >
              {intro}
            </p>

            <div className="mt-10 space-y-10">
              {sections.map((section, index) => (
                <article
                  key={section.heading}
                  id={clauseId(section.heading)}
                  data-aos="fade-up"
                  className="scroll-mt-10 border-t border-border pt-8 first:border-0 first:pt-0"
                >
                  <h2 className="flex items-baseline gap-3 text-lg font-medium leading-snug text-brand-navy">
                    <span
                      className="grid size-7 shrink-0 place-items-center self-start rounded-full bg-brand-accent/10 text-xs font-semibold tabular-nums text-brand-accent"
                      aria-hidden
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0">{section.heading}</span>
                  </h2>
                  <div className="mt-4 space-y-3.5 pl-10">
                    {section.body.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 40)}
                        className="text-[15px] leading-relaxed [overflow-wrap:anywhere] text-foreground/80"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            {note && (
              <p className="mt-12 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
                {note}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
