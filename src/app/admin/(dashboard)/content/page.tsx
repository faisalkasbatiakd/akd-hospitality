import type { Metadata } from "next";
import { asc } from "drizzle-orm";

import { db } from "@/db";
import { requireSession } from "@/lib/auth";

import {
  OrderedListManager,
  type Item,
} from "../_components/ordered-list-manager";
import { createItem, deleteItem, moveItem, updateItem } from "./actions";
import { LISTS, type ListKey } from "./lists";

export const metadata: Metadata = { title: "Page content" };

const ORDER: ListKey[] = [
  "esgPolicies",
  "esgPillars",
  "esgMetrics",
  "strategyObjectives",
  "workstreams",
  "businesses",
  "companyInformation",
  "externalLinks",
];

/**
 * The ordered lists the site renders that previously had nowhere to be edited.
 *
 * All eight share one manager and one set of actions, bound per list, rather
 * than eight pages that differ only in their columns.
 */
export default async function ContentPage() {
  await requireSession();

  const lists = await Promise.all(
    ORDER.map(async (key) => {
      const config = LISTS[key];
      const rows = await db
        .select()
        .from(config.table)
        .orderBy(asc(config.table.sort), asc(config.table.id));
      return { key, config, rows };
    }),
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-semibold text-brand-navy">Page content</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Lists that appear on the public pages. Changes show on the site
          immediately.
        </p>
      </div>

      {lists.map(({ key, config, rows }) => (
        <OrderedListManager
          key={key}
          title={config.title}
          description={config.description}
          addLabel={config.addLabel}
          primaryField={config.primaryField}
          secondaryField={config.secondaryField}
          fields={config.fields}
          items={rows.map((row) => {
            const item: Item = { id: (row as { id: number }).id };
            for (const field of config.fields) {
              const value = (row as Record<string, unknown>)[field.name];
              // companyInformation stores its value as a list of lines; the
              // form edits it as one box, one line per line.
              item[field.name] = Array.isArray(value)
                ? value.join("\n")
                : String(value ?? "");
            }
            return item;
          })}
          actions={{
            create: createItem.bind(null, key),
            update: updateItem.bind(null, key),
            remove: deleteItem.bind(null, key),
            move: moveItem.bind(null, key),
          }}
        />
      ))}
    </div>
  );
}
