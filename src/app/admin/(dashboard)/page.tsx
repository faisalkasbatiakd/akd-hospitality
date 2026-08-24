import Link from "next/link";
import { sql } from "drizzle-orm";

import { db } from "@/db";
import * as t from "@/db/schema";
import { requireSession } from "@/lib/auth";
import { Card } from "@/components/ui/card";

/** Live counts, so the overview reflects the database rather than a guess. */
async function counts() {
  const [row] = await db
    .select({
      documents: sql<number>`(select count(*)::int from ${t.documents})`,
      directors: sql<number>`(select count(*)::int from ${t.directors})`,
      officers: sql<number>`(select count(*)::int from ${t.officers})`,
      committees: sql<number>`(select count(*)::int from ${t.committees})`,
      announcements: sql<number>`(select count(*)::int from ${t.announcements})`,
      milestones: sql<number>`(select count(*)::int from ${t.milestones})`,
      images: sql<number>`(select count(*)::int from ${t.images})`,
      settings: sql<number>`(select count(*)::int from ${t.settings})`,
    })
    .from(sql`(select 1) as one`);
  return row;
}

const TILES = [
  { key: "documents", label: "Documents", href: "/admin/documents" },
  { key: "directors", label: "Directors", href: "/admin/board" },
  { key: "officers", label: "Officers", href: "/admin/board" },
  { key: "committees", label: "Committees", href: "/admin/board" },
  { key: "announcements", label: "Announcements", href: "/admin/announcements" },
  { key: "milestones", label: "Milestones", href: "/admin/milestones" },
  { key: "images", label: "Images", href: "/admin/images" },
  { key: "settings", label: "Content blocks", href: "/admin/settings" },
] as const;

export default async function AdminOverviewPage() {
  const session = await requireSession();
  const data = await counts();

  const recent = await db
    .select()
    .from(t.auditLog)
    .orderBy(sql`${t.auditLog.at} desc`)
    .limit(8);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-brand-navy">
          Welcome back, {session.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything published on the website, editable here.
        </p>
      </div>

      {/* Two across on the narrowest phones, four on desktop. */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {TILES.map((tile) => (
          <Link key={tile.label + tile.key} href={tile.href} className="min-w-0">
            <Card className="h-full p-4 transition-colors hover:border-brand-accent/40">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-[11px] sm:tracking-[0.14em]">
                {tile.label}
              </p>
              <p className="mt-1 text-xl font-semibold text-brand-navy sm:text-2xl">
                {data[tile.key]}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-medium text-brand-navy">Recent activity</h2>
        </div>
        {recent.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted-foreground">
            Nothing yet. Changes made here will be listed with who made them.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 sm:px-5"
              >
                <span className="min-w-0 text-sm text-foreground/85">
                  {entry.summary}
                  <span className="block truncate text-xs text-muted-foreground">
                    {entry.actorEmail}
                  </span>
                </span>
                <time className="shrink-0 text-xs text-muted-foreground">
                  {entry.at.toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </time>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="border-amber-200 bg-amber-50 p-5">
        <h2 className="text-sm font-medium text-amber-900">
          Financial figures are not editable here
        </h2>
        <p className="mt-1.5 text-sm text-amber-900/85">
          The FY2025 snapshot, six-year record, shareholding pattern, capital
          figures and the going-concern notice are audited numbers tied to pages
          of the annual report. They stay in the codebase, where changing them
          takes a commit and a review.
        </p>
      </Card>
    </div>
  );
}
