"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";
import type { DocItem } from "@/data/investors";
import { DocumentList } from "@/components/shared/document-list";

export type DocumentCategory = {
  value: string;
  label: string;
  items: readonly DocItem[];
};

type InvestorDocumentsProps = {
  categories: DocumentCategory[];
};

/**
 * Category switcher for investor documents.
 *
 * Plain state rather than a tabs component: only the active category is
 * rendered, which keeps a list of ~100 documents light and the behaviour
 * obvious. Tab semantics are supplied explicitly via role/aria attributes.
 */
export function InvestorDocuments({ categories }: InvestorDocumentsProps) {
  const [active, setActive] = useState(categories[0]?.value);
  const baseId = useId();

  const activeCategory =
    categories.find((category) => category.value === active) ?? categories[0];

  return (
    <div className="mt-10">
      <div
        role="tablist"
        aria-label="Investor document categories"
        className="flex flex-wrap gap-1.5 rounded-lg border border-border bg-card p-1.5"
      >
        {categories.map((category) => {
          const selected = category.value === activeCategory.value;
          return (
            <button
              key={category.value}
              type="button"
              role="tab"
              id={`${baseId}-tab-${category.value}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${category.value}`}
              onClick={() => setActive(category.value)}
              className={cn(
                "rounded-md px-3.5 py-2 text-xs font-medium transition-colors sm:text-sm",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent",
                selected
                  ? "bg-brand-navy text-white"
                  : "text-foreground/70 hover:bg-accent hover:text-brand-navy",
              )}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-${activeCategory.value}`}
        aria-labelledby={`${baseId}-tab-${activeCategory.value}`}
        tabIndex={0}
        className="outline-none"
      >
        <p className="mt-4 text-xs text-muted-foreground">
          {activeCategory.items.length}{" "}
          {activeCategory.items.length === 1 ? "document" : "documents"}
        </p>
        <DocumentList key={activeCategory.value} items={activeCategory.items} />
      </div>
    </div>
  );
}
