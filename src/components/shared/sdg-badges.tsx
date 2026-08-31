import { sdgNames } from "@/data/esg-policy";
import { cn } from "@/lib/utils";

type SdgBadgesProps = {
  goals: number[];
  className?: string;
};

/**
 * The UN goals a commitment is tagged with.
 *
 * The Company tags nearly every line of its policies this way, written inline as
 * "(SDG 7, 13)" at the end of the sentence. Sixty-two commitments each ending in
 * a parenthetical is a lot of noise in the reading line, so the tags are lifted
 * out and set as labels instead - the sentence reads as a sentence, and the
 * goals become scannable down the page.
 *
 * Each badge shows only the number, because the full goal names are long enough
 * to dominate the commitment they annotate. The name is carried on the
 * accessible label, and spelled out in the legend at the foot of the page, so
 * nothing depends on the reader already knowing what SDG 13 is.
 */
export function SdgBadges({ goals, className }: SdgBadgesProps) {
  if (goals.length === 0) return null;

  return (
    <span className={cn("inline-flex flex-wrap items-center gap-1.5", className)}>
      {goals.map((n) => (
        <span
          key={n}
          // The visible text is "SDG 7"; the label reads the goal out in full.
          aria-label={`Sustainable Development Goal ${n}: ${sdgNames[n] ?? ""}`}
          title={sdgNames[n]}
          className="rounded-full border border-brand-accent/25 bg-brand-accent/5 px-2 py-0.5 text-[11px] font-medium leading-none tabular-nums text-brand-accent"
        >
          SDG {n}
        </span>
      ))}
    </span>
  );
}
