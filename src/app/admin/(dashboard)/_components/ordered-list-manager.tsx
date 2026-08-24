"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Textarea } from "@/components/ui/textarea";

export type Field = {
  name: string;
  label: string;
  placeholder?: string;
  hint?: string;
  multiline?: boolean;
  maxLength?: number;
  required?: boolean;
};

/**
 * A row: a numeric id plus whatever string fields the page declares. Written
 * as one index signature rather than an intersection, which would require id
 * to be both a number and a string.
 */
export type Item = { id: number; [field: string]: string | number };

type Result = { ok: true } | { ok: false; error: string };

/**
 * One editor for every simple ordered list in the dashboard.
 *
 * Announcements, milestones, officers and the ESG lists all behave the same
 * way: add, edit, reorder, remove. Writing that five times would mean five
 * places to fix a bug in, so the shape of a row is described by `fields` and
 * the behaviour lives here.
 */
export function OrderedListManager({
  title,
  description,
  addLabel,
  fields,
  items,
  primaryField,
  secondaryField,
  actions,
  emptyLabel = "Nothing here yet.",
}: {
  title: string;
  description: string;
  addLabel: string;
  fields: Field[];
  items: Item[];
  /** Shown as the row's heading. */
  primaryField: string;
  /** Shown under it, muted. */
  secondaryField?: string;
  actions: {
    create: (formData: FormData) => Promise<Result>;
    update: (id: number, formData: FormData) => Promise<Result>;
    remove: (id: number) => Promise<Result>;
    move: (id: number, direction: "up" | "down") => Promise<Result>;
  };
  emptyLabel?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState<Item | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

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
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-brand-navy">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Button onClick={() => setAdding(true)} className="shrink-0">
          <Plus className="size-4" aria-hidden />
          {addLabel}
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        <CardHeader className="border-b border-border p-4 sm:p-5">
          <CardTitle className="text-base">
            {items.length} {items.length === 1 ? "entry" : "entries"}
          </CardTitle>
          <CardDescription>
            The order here is the order on the website.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              {emptyLabel}
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  className="flex animate-in flex-col gap-3 px-4 py-3.5 fade-in sm:flex-row sm:items-center sm:justify-between sm:px-5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-brand-navy">
                      {item[primaryField]}
                    </p>
                    {secondaryField && item[secondaryField] ? (
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {item[secondaryField]}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 items-center gap-0.5 self-end sm:self-auto">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Move up"
                      disabled={index === 0 || busyId === item.id}
                      onClick={async () => {
                        setBusyId(item.id);
                        await run(() => actions.move(item.id, "up"), "Moved up");
                        setBusyId(null);
                      }}
                    >
                      <ChevronUp className="size-4" aria-hidden />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Move down"
                      disabled={index === items.length - 1 || busyId === item.id}
                      onClick={async () => {
                        setBusyId(item.id);
                        await run(
                          () => actions.move(item.id, "down"),
                          "Moved down",
                        );
                        setBusyId(null);
                      }}
                    >
                      <ChevronDown className="size-4" aria-hidden />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Edit"
                      onClick={() => setEditing(item)}
                    >
                      <Pencil className="size-4" aria-hidden />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Remove"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleting(item)}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <RowDialog
        open={adding}
        onClose={() => setAdding(false)}
        heading={addLabel}
        fields={fields}
        onSubmit={async (formData) => {
          const ok = await run(() => actions.create(formData), "Added");
          if (ok) setAdding(false);
        }}
      />

      <RowDialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        heading="Edit entry"
        fields={fields}
        values={editing ?? undefined}
        onSubmit={async (formData) => {
          const ok = await run(
            () => actions.update(editing!.id, formData),
            "Saved",
          );
          if (ok) setEditing(null);
        }}
      />

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this entry?</AlertDialogTitle>
            <AlertDialogDescription>
              “{deleting?.[primaryField]}” will stop appearing on the website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                const item = deleting;
                if (!item) return;
                setDeleting(null);
                await run(() => actions.remove(item.id), "Removed");
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {pending ? (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" aria-hidden />
          Refreshing
        </p>
      ) : null}
    </div>
  );
}

function RowDialog({
  open,
  onClose,
  heading,
  fields,
  values,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  heading: string;
  fields: Field[];
  values?: Item;
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{heading}</DialogTitle>
          <DialogDescription>
            Changes appear on the website as soon as they are saved.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            setBusy(true);
            await onSubmit(formData);
            setBusy(false);
          }}
          className="space-y-4"
        >
          {fields.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <Label htmlFor={`f-${field.name}`}>{field.label}</Label>
              {field.multiline ? (
                <Textarea
                  id={`f-${field.name}`}
                  name={field.name}
                  rows={4}
                  required={field.required ?? true}
                  maxLength={field.maxLength}
                  placeholder={field.placeholder}
                  // Keyed on the row so switching between entries reloads the
                  // defaults instead of keeping the previous row's text.
                  key={`${values?.id ?? "new"}-${field.name}`}
                  defaultValue={String(values?.[field.name] ?? "")}
                />
              ) : (
                <Input
                  id={`f-${field.name}`}
                  name={field.name}
                  required={field.required ?? true}
                  maxLength={field.maxLength}
                  placeholder={field.placeholder}
                  key={`${values?.id ?? "new"}-${field.name}`}
                  defaultValue={String(values?.[field.name] ?? "")}
                />
              )}
              {field.hint ? (
                <p className="text-xs text-muted-foreground">{field.hint}</p>
              ) : null}
            </div>
          ))}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : null}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
