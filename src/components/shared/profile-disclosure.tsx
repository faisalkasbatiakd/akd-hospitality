import { ChevronDown } from "lucide-react";

type ProfileDisclosureItem = {
  name: string;
  role: string;
  bio?: string;
};

type ProfileDisclosureProps = {
  items: readonly ProfileDisclosureItem[];
};

/**
 * Expandable profile list built on native <details>/<summary>.
 *
 * Preferred over an accordion component here: it ships no JavaScript, is
 * keyboard and screen-reader accessible by default, and keeps every bio in the
 * DOM so the content stays crawlable.
 */
export function ProfileDisclosure({ items }: ProfileDisclosureProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details
          key={item.name}
          className="disclosure group rounded-xl border border-border bg-background px-5 transition-colors duration-300 open:border-brand-accent/40 hover:border-brand-accent/40"
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent [&::-webkit-details-marker]:hidden">
            <span>
              <span className="block text-sm font-semibold text-brand-navy">
                {item.name}
              </span>
              <span className="mt-0.5 block text-xs text-brand-accent">
                {item.role}
              </span>
            </span>
            <ChevronDown
              className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
              aria-hidden
            />
          </summary>

          {item.bio && (
            <p className="border-t border-border pb-5 pt-4 text-sm leading-relaxed text-muted-foreground">
              {item.bio}
            </p>
          )}
        </details>
      ))}
    </div>
  );
}
