import type { Metadata } from "next";
import { asc } from "drizzle-orm";

import { db } from "@/db";
import { announcements } from "@/db/schema";
import { requireSession } from "@/lib/auth";

import { OrderedListManager } from "../_components/ordered-list-manager";
import {
  createAnnouncement,
  deleteAnnouncement,
  moveAnnouncement,
  updateAnnouncement,
} from "./actions";

export const metadata: Metadata = { title: "Announcements" };

export default async function AnnouncementsPage() {
  await requireSession();
  const rows = await db
    .select()
    .from(announcements)
    .orderBy(asc(announcements.sort), asc(announcements.id));

  return (
    <OrderedListManager
      title="Announcements"
      description="The rolling notices in the ticker above the header, on every page."
      addLabel="Add notice"
      primaryField="title"
      secondaryField="href"
      items={rows.map((row) => ({
        id: row.id,
        title: row.title,
        href: row.href,
      }))}
      fields={[
        {
          name: "title",
          label: "Notice",
          placeholder: "Notice of Annual General Meeting to be held on ...",
          maxLength: 300,
        },
        {
          name: "href",
          label: "Links to",
          placeholder: "/media",
          hint: "A path on this site, starting with /. The ticker is on every page, so it does not link off-site.",
          maxLength: 300,
        },
      ]}
      actions={{
        create: createAnnouncement,
        update: updateAnnouncement,
        remove: deleteAnnouncement,
        move: moveAnnouncement,
      }}
    />
  );
}
