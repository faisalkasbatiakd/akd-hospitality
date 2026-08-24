import type { Metadata } from "next";
import { asc } from "drizzle-orm";

import { db } from "@/db";
import { milestones } from "@/db/schema";
import { requireSession } from "@/lib/auth";

import { OrderedListManager } from "../_components/ordered-list-manager";
import {
  createMilestone,
  deleteMilestone,
  moveMilestone,
  updateMilestone,
} from "./actions";

export const metadata: Metadata = { title: "Milestones" };

export default async function MilestonesPage() {
  await requireSession();
  const rows = await db
    .select()
    .from(milestones)
    .orderBy(asc(milestones.sort), asc(milestones.id));

  return (
    <OrderedListManager
      title="Milestones"
      description="The company timeline on the home page, under “Milestones That Define Us”."
      addLabel="Add milestone"
      primaryField="label"
      secondaryField="description"
      items={rows.map((row) => ({
        id: row.id,
        label: `${row.year} — ${row.title}`,
        year: row.year,
        title: row.title,
        description: row.description,
      }))}
      fields={[
        { name: "year", label: "Year", placeholder: "1936", maxLength: 20 },
        {
          name: "title",
          label: "Title",
          placeholder: "Incorporated",
          maxLength: 200,
        },
        {
          name: "description",
          label: "Description",
          placeholder: "What happened, in one or two sentences.",
          multiline: true,
          maxLength: 1000,
        },
      ]}
      actions={{
        create: createMilestone,
        update: updateMilestone,
        remove: deleteMilestone,
        move: moveMilestone,
      }}
    />
  );
}
