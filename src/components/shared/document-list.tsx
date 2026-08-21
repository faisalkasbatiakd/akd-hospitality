"use client";

import { useState } from "react";
import { ChevronDown, Download, FileText } from "lucide-react";

import { cn } from "@/lib/utils";
import type { DocItem } from "@/data/investors";

type DocumentListProps = {
  items: readonly DocItem[];
  emptyLabel?: string;
  className?: string;
  /**
   * How many rows to show before the list collapses behind a button.
   * Some categories run to 40+ documents, which buries everything after it.
   */
  initialCount?: number;
};

export function DocumentList({
  items,
  emptyLabel = "No documents available.",
  className,
  initialCount = 5,
}: DocumentListProps) {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) {
    return <p className="mt-4 text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  const collapsible = items.length > initialCount;
  const visible = collapsible && !expanded ? items.slice(0, initialCount) : items;
  const hiddenCount = items.length - initialCount;

  return (
    <div className={cn("mt-4", className)}>
      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-background">
        {visible.map((item) => (
          <li key={item.href} className="min-w-0">
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-w-0 items-center justify-between gap-4 px-5 py-3.5 transition-colors duration-200 hover:bg-brand-accent/[0.04]"
            >
              <span className="flex min-w-0 items-start gap-3">
                <FileText
                  className="mt-0.5 size-4 shrink-0 text-brand-accent"
                  aria-hidden
                />
                <span className="min-w-0 text-sm leading-snug text-foreground/85 [overflow-wrap:anywhere] group-hover:text-brand-navy">
                  {item.title}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors group-hover:text-brand-accent">
                <span className="hidden sm:inline">PDF</span>
                <Download className="size-3.5" aria-hidden />
              </span>
            </a>
          </li>
        ))}
      </ul>

      {collapsible && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="group mt-4 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-brand-navy transition-colors duration-300 hover:border-brand-accent/50 hover:bg-brand-accent/[0.04]"
        >
          {expanded ? "Show fewer" : `Show all ${items.length} documents`}
          {!expanded && (
            <span className="rounded-full bg-brand-accent/10 px-2 py-0.5 text-xs font-semibold text-brand-accent">
              +{hiddenCount}
            </span>
          )}
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-300",
              expanded && "rotate-180",
            )}
            aria-hidden
          />
        </button>
      )}
    </div>
  );
}
