import type { Metadata } from "next";
import { asc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { documentGroups, documents } from "@/db/schema";
import { requireSession } from "@/lib/auth";
import { fileUrl, isLegacyKey } from "@/lib/storage";

import { DocumentsManager } from "./documents-manager";

export const metadata: Metadata = { title: "Documents" };

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>;
}) {
  await requireSession();
  const { group } = await searchParams;

  const groups = await db
    .select({
      key: documentGroups.key,
      label: documentGroups.label,
      page: documentGroups.page,
      count: sql<number>`(
        select count(*)::int from ${documents}
        where ${documents.groupKey} = ${documentGroups.key}
      )`,
    })
    .from(documentGroups)
    .orderBy(asc(documentGroups.sort));

  const active = groups.find((g) => g.key === group) ?? groups[0];

  const rows = active
    ? await db
        .select({
          id: documents.id,
          title: documents.title,
          path: documents.path,
          sizeBytes: documents.sizeBytes,
          passwordProtected: documents.passwordProtected,
        })
        .from(documents)
        .where(eq(documents.groupKey, active.key))
        .orderBy(asc(documents.sort), asc(documents.id))
    : [];

  return (
    <DocumentsManager
      groups={groups}
      activeKey={active?.key ?? ""}
      total={groups.reduce((sum, g) => sum + g.count, 0)}
      documents={rows.map((row) => ({
        id: row.id,
        title: row.title,
        url: fileUrl(row.path),
        // Legacy filings are committed to the repository; the UI says so before
        // anyone tries to delete one.
        committed: isLegacyKey(row.path),
        sizeLabel:
          row.sizeBytes && row.sizeBytes > 0
            ? `${(row.sizeBytes / 1048576).toFixed(row.sizeBytes < 1048576 ? 2 : 1)} MB`
            : null,
        passwordProtected: row.passwordProtected === 1,
      }))}
    />
  );
}
