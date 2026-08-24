import type { Metadata } from "next";
import { asc } from "drizzle-orm";

import { db } from "@/db";
import { committeeMembers, committees, directors, officers } from "@/db/schema";
import { requireSession } from "@/lib/auth";
import { fileUrl } from "@/lib/storage";

import { OrderedListManager } from "../_components/ordered-list-manager";
import { CommitteesManager } from "./committees-manager";
import { DirectorsManager } from "./directors-manager";
import {
  createOfficer,
  deleteOfficer,
  moveOfficer,
  updateOfficer,
} from "./actions";

export const metadata: Metadata = { title: "Board & officers" };

export default async function BoardPage() {
  await requireSession();

  const [directorRows, officerRows, committeeRows, memberRows] =
    await Promise.all([
      db.select().from(directors).orderBy(asc(directors.sort), asc(directors.id)),
      db.select().from(officers).orderBy(asc(officers.sort), asc(officers.id)),
      db.select().from(committees).orderBy(asc(committees.sort)),
      db
        .select()
        .from(committeeMembers)
        .orderBy(asc(committeeMembers.sort), asc(committeeMembers.id)),
    ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-brand-navy">
          Board &amp; officers
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything on the Governance page: the Board, the officers of the
          Company and the four committees.
        </p>
      </div>

      <DirectorsManager
        directors={directorRows.map((row) => ({
          id: row.id,
          name: row.name,
          role: row.role,
          category: row.category,
          bio: row.bio,
          imageUrl: row.imagePath ? fileUrl(row.imagePath) : null,
        }))}
      />

      <OrderedListManager
        title="Officers of the Company"
        description="The Company Secretary, Chief Financial Officer and Head of Internal Audit."
        addLabel="Add officer"
        primaryField="name"
        secondaryField="role"
        items={officerRows.map((row) => ({
          id: row.id,
          name: row.name,
          role: row.role,
        }))}
        fields={[
          {
            name: "name",
            label: "Name",
            placeholder: "Mr. Syed Haris Ahmed",
            maxLength: 200,
          },
          {
            name: "role",
            label: "Role",
            placeholder: "Company Secretary",
            maxLength: 200,
          },
        ]}
        actions={{
          create: createOfficer,
          update: updateOfficer,
          remove: deleteOfficer,
          move: moveOfficer,
        }}
        emptyLabel="No officers listed."
      />

      <CommitteesManager
        committees={committeeRows.map((committee) => ({
          id: committee.id,
          title: committee.title,
          members: memberRows
            .filter((member) => member.committeeId === committee.id)
            .map((member) => ({
              id: member.id,
              name: member.name,
              role: member.role,
              designation: member.designation,
              note: member.note,
            })),
        }))}
      />
    </div>
  );
}
