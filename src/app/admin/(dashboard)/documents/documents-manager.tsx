"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Loader2,
  Lock,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { uploadFailureMessage } from "../_lib/upload-error";

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
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  deleteDocument,
  moveDocument,
  renameDocument,
} from "./actions";

type Group = { key: string; label: string; page: string; count: number };
type Doc = {
  id: number;
  title: string;
  url: string;
  committed: boolean;
  sizeLabel: string | null;
  passwordProtected: boolean;
};

export function DocumentsManager({
  groups,
  activeKey,
  documents,
  total,
}: {
  groups: Group[];
  activeKey: string;
  documents: Doc[];
  total: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [addOpen, setAddOpen] = useState(false);
  const [renaming, setRenaming] = useState<Doc | null>(null);
  const [deleting, setDeleting] = useState<Doc | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const active = groups.find((g) => g.key === activeKey);

  const selectGroup = (key: string) => {
    const next = new URLSearchParams(params.toString());
    next.set("group", key);
    router.replace(`/admin/documents?${next.toString()}`);
  };

  /** Runs an action, surfaces the outcome, and refreshes the server data. */
  const run = async (
    work: () => Promise<{ ok: true } | { ok: false; error: string }>,
    success: string,
  ) => {
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
          <h1 className="text-xl font-semibold text-brand-navy">Documents</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {total} PDFs published across the Investors, Media and Governance
            pages.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="shrink-0">
          <Plus className="size-4" aria-hidden />
          Add document
        </Button>
      </div>

      {/* Category chips. A select on the narrowest screens, chips above that. */}
      <div className="sm:hidden">
        <Label htmlFor="group-select" className="mb-1.5 block">
          Category
        </Label>
        {/* Base UI's Select can emit null when a value is cleared. */}
        <Select
          value={activeKey}
          onValueChange={(value) => value && selectGroup(value)}
        >
          <SelectTrigger id="group-select" className="w-full">
            {/* Rendered explicitly: Base UI otherwise shows the raw value, and
                these values are internal keys like "corporateBriefings". */}
            <SelectValue>
              {active ? `${active.label} (${active.count})` : "Choose"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectItem key={group.key} value={group.key}>
                {group.label} ({group.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="hidden flex-wrap gap-2 sm:flex">
        {groups.map((group) => {
          const isActive = group.key === activeKey;
          return (
            <button
              key={group.key}
              onClick={() => selectGroup(group.key)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "border-brand-navy bg-brand-navy text-white"
                  : "border-border bg-background text-foreground/70 hover:border-brand-accent/40 hover:text-brand-navy"
              }`}
            >
              {group.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  isActive ? "bg-white/20" : "bg-secondary text-brand-navy"
                }`}
              >
                {group.count}
              </span>
            </button>
          );
        })}
      </div>

      <Card className="overflow-hidden p-0">
        <CardHeader className="border-b border-border p-4 sm:p-5">
          <CardTitle className="text-base">{active?.label}</CardTitle>
          <CardDescription>
            Shown on the {active?.page} page, in this order.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {documents.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              Nothing in this category yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="w-24">Size</TableHead>
                    <TableHead className="w-40 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc, index) => (
                    <TableRow key={doc.id} className="animate-in fade-in">
                      <TableCell className="min-w-0">
                        <div className="flex items-start gap-2.5">
                          <FileText
                            className="mt-0.5 size-4 shrink-0 text-brand-accent"
                            aria-hidden
                          />
                          <div className="min-w-0">
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-foreground/90 hover:text-brand-navy hover:underline"
                            >
                              {doc.title}
                            </a>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                              {doc.committed ? (
                                <Badge variant="secondary" className="text-[10px]">
                                  In repository
                                </Badge>
                              ) : (
                                <Badge className="text-[10px]">Uploaded</Badge>
                              )}
                              {doc.passwordProtected ? (
                                <Badge
                                  variant="outline"
                                  className="gap-1 text-[10px]"
                                >
                                  <Lock className="size-2.5" aria-hidden />
                                  Password
                                </Badge>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {doc.sizeLabel ?? "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Move up"
                            disabled={index === 0 || busyId === doc.id}
                            onClick={async () => {
                              setBusyId(doc.id);
                              await run(
                                () => moveDocument(doc.id, "up"),
                                "Moved up",
                              );
                              setBusyId(null);
                            }}
                          >
                            <ChevronUp className="size-4" aria-hidden />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Move down"
                            disabled={
                              index === documents.length - 1 || busyId === doc.id
                            }
                            onClick={async () => {
                              setBusyId(doc.id);
                              await run(
                                () => moveDocument(doc.id, "down"),
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
                            aria-label="Open"
                            // Rendering an anchor, so Base UI must not assume
                            // native button semantics.
                            nativeButton={false}
                            render={
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noreferrer"
                              />
                            }
                          >
                            <ExternalLink className="size-4" aria-hidden />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Rename"
                            onClick={() => setRenaming(doc)}
                          >
                            <Pencil className="size-4" aria-hidden />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Remove"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleting(doc)}
                          >
                            <Trash2 className="size-4" aria-hidden />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddDocumentDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        groups={groups}
        defaultGroup={activeKey}
        onDone={() => startTransition(() => router.refresh())}
      />

      <RenameDialog
        doc={renaming}
        onClose={() => setRenaming(null)}
        onSubmit={async (title) => {
          const ok = await run(
            () => renameDocument(renaming!.id, title),
            "Title updated",
          );
          if (ok) setRenaming(null);
        }}
      />

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this document?</AlertDialogTitle>
            <AlertDialogDescription>
              “{deleting?.title}” will stop appearing on the website.
              {deleting?.committed
                ? " The file itself stays in the repository, so this can be undone by adding it back."
                : " The uploaded file will be deleted and cannot be recovered."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                const doc = deleting;
                if (!doc) return;
                setDeleting(null);
                await run(() => deleteDocument(doc.id), "Document removed");
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

function AddDocumentDialog({
  open,
  onOpenChange,
  groups,
  defaultGroup,
  onDone,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: Group[];
  defaultGroup: string;
  onDone: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [groupKey, setGroupKey] = useState(defaultGroup);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a document</DialogTitle>
          <DialogDescription>
            PDF only, up to 25 MB. The title is what visitors see.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const data = new FormData(form);
            data.set("groupKey", groupKey);
            setBusy(true);
            try {
              /*
               * Posted to a route handler, not a server action. Next's action
               * parser truncates a multipart body a little under 10 MB, which
               * made every filing over that size fail with an unexplained 500 -
               * see the note in src/app/api/admin/documents/route.ts.
               */
              const response = await fetch("/api/admin/documents", {
                method: "POST",
                body: data,
              });
              const result = (await response.json().catch(() => null)) as
                | { ok: boolean; error?: string }
                | null;
              if (response.ok && result?.ok) {
                toast.success("Document added");
                form.reset();
                onOpenChange(false);
                onDone();
              } else {
                toast.error(
                  result?.error ??
                    "The upload did not go through. Please try again.",
                );
              }
            } catch (error) {
              // Only a dropped connection reaches here now: the endpoint
              // answers with a message of its own for everything else.
              toast.error(uploadFailureMessage(error));
            } finally {
              setBusy(false);
            }
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="doc-group">Category</Label>
            <Select
              value={groupKey}
              onValueChange={(value) => value && setGroupKey(value)}
            >
              <SelectTrigger id="doc-group" className="w-full">
                <SelectValue placeholder="Choose a category">
                  {groups.find((g) => g.key === groupKey)?.label ??
                    "Choose a category"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.key} value={group.key}>
                    {group.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="doc-title">Title</Label>
            <Input
              id="doc-title"
              name="title"
              required
              maxLength={300}
              placeholder="Enter the document title"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="doc-file">PDF file</Label>
            <Input
              id="doc-file"
              name="file"
              type="file"
              accept="application/pdf"
              required
              className="cursor-pointer file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-secondary file:px-2 file:py-1 file:text-xs file:font-medium file:text-brand-navy"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Uploading
                </>
              ) : (
                <>
                  <Upload className="size-4" aria-hidden />
                  Add document
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RenameDialog({
  doc,
  onClose,
  onSubmit,
}: {
  doc: Doc | null;
  onClose: () => void;
  onSubmit: (title: string) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <Dialog open={doc !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename document</DialogTitle>
          <DialogDescription>
            This changes the label visitors see. The file itself is unchanged.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const title = String(
              new FormData(event.currentTarget).get("title") ?? "",
            );
            setBusy(true);
            await onSubmit(title);
            setBusy(false);
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="rename-title">Title</Label>
            <Input
              id="rename-title"
              name="title"
              required
              maxLength={300}
              defaultValue={doc?.title ?? ""}
              key={doc?.id}
              autoFocus
            />
          </div>
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
