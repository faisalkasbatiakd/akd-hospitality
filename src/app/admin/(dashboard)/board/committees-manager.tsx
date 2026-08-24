"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Pencil, Plus, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  createCommitteeMember,
  deleteCommitteeMember,
  renameCommittee,
} from "./actions";

type Member = {
  id: number;
  name: string;
  role: string;
  designation: string | null;
  note: string | null;
};
export type Committee = { id: number; title: string; members: Member[] };

type Result = { ok: true } | { ok: false; error: string };

export function CommitteesManager({
  committees,
}: {
  committees: Committee[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [renaming, setRenaming] = useState<Committee | null>(null);
  const [addingTo, setAddingTo] = useState<Committee | null>(null);

  const run = async (work: () => Promise<Result>, success: string) => {
    const result = await work();
    if (result.ok) {
      toast.success(success);
      startTransition(() => router.refresh());
    } else {
      toast.error(result.error);
    }
    return result.ok;
  };

  return (
    <>
      <Card className="overflow-hidden p-0">
        <CardHeader className="border-b border-border p-4 sm:p-5">
          <CardTitle className="text-base">
            Committees of the Board ({committees.length})
          </CardTitle>
          <CardDescription>
            ID = independent director, NE = non-executive, as reported.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {committees.map((committee) => (
              <li key={committee.id} className="p-4 sm:p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium text-brand-navy">
                    {committee.title}
                  </p>
                  <div className="flex shrink-0 items-center gap-1 self-end sm:self-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAddingTo(committee)}
                    >
                      <UserPlus className="size-3.5" aria-hidden />
                      Add member
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Rename committee"
                      onClick={() => setRenaming(committee)}
                    >
                      <Pencil className="size-4" aria-hidden />
                    </Button>
                  </div>
                </div>

                {committee.members.length === 0 ? (
                  <p className="mt-3 text-xs text-muted-foreground">
                    No members listed.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-1.5">
                    {committee.members.map((member) => (
                      <li
                        key={member.id}
                        className="flex items-center justify-between gap-3 rounded-lg bg-secondary/60 px-3 py-2"
                      >
                        <span className="min-w-0 text-sm text-foreground/85">
                          {member.name}
                          <span className="ml-2 text-xs text-muted-foreground">
                            {member.role}
                            {member.designation ? ` · ${member.designation}` : ""}
                            {member.note ? ` · ${member.note}` : ""}
                          </span>
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Remove ${member.name}`}
                          className="shrink-0 text-destructive hover:text-destructive"
                          onClick={() =>
                            run(
                              () => deleteCommitteeMember(member.id),
                              "Member removed",
                            )
                          }
                        >
                          <Trash2 className="size-3.5" aria-hidden />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Rename */}
      <Dialog
        open={renaming !== null}
        onOpenChange={(open) => !open && setRenaming(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename committee</DialogTitle>
            <DialogDescription>
              This is the heading shown on the Governance page.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              const title = String(
                new FormData(event.currentTarget).get("title") ?? "",
              );
              const ok = await run(
                () => renameCommittee(renaming!.id, title),
                "Committee renamed",
              );
              if (ok) setRenaming(null);
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="committee-title">Title</Label>
              <Input
                id="committee-title"
                name="title"
                required
                maxLength={200}
                key={renaming?.id}
                defaultValue={renaming?.title ?? ""}
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRenaming(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add member */}
      <Dialog
        open={addingTo !== null}
        onOpenChange={(open) => !open && setAddingTo(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a member</DialogTitle>
            <DialogDescription>
              To the {addingTo?.title}.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              formData.set("committeeId", String(addingTo!.id));
              const ok = await run(
                () => createCommitteeMember(formData),
                "Member added",
              );
              if (ok) setAddingTo(null);
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="member-name">Name</Label>
              <Input
                id="member-name"
                name="name"
                required
                maxLength={200}
                placeholder="Mr. Muhammad Siddiq Khokhar"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="member-role">Role</Label>
              <Input
                id="member-role"
                name="role"
                required
                maxLength={80}
                placeholder="Chairperson, Member or Secretary"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="member-designation">Designation</Label>
              <Input
                id="member-designation"
                name="designation"
                maxLength={40}
                placeholder="ID, NE, CEO or CFO"
              />
              <p className="text-xs text-muted-foreground">Optional.</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="member-note">Note</Label>
              <Input
                id="member-note"
                name="note"
                maxLength={200}
                placeholder="Head of Internal Audit"
              />
              <p className="text-xs text-muted-foreground">Optional.</p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddingTo(null)}
              >
                Cancel
              </Button>
              <Button type="submit">
                <Plus className="size-4" aria-hidden />
                Add member
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {pending ? (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" aria-hidden />
          Refreshing
        </p>
      ) : null}
    </>
  );
}
