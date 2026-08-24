"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  ChevronDown,
  ChevronUp,
  ImageOff,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
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
import { Textarea } from "@/components/ui/textarea";

import {
  createDirector,
  deleteDirector,
  moveDirector,
  removeDirectorImage,
  updateDirector,
} from "./actions";

export type Director = {
  id: number;
  name: string;
  role: string;
  category: string | null;
  bio: string | null;
  imageUrl: string | null;
};

type Result = { ok: true } | { ok: false; error: string };

const initials = (name: string) =>
  name
    .replace(/^(Mr\.|Ms\.|Mrs\.)\s*/, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();

export function DirectorsManager({ directors }: { directors: Director[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Director | null>(null);
  const [deleting, setDeleting] = useState<Director | null>(null);
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
    <>
      <Card className="overflow-hidden p-0">
        <CardHeader className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <CardTitle className="text-base">
              Board of Directors ({directors.length})
            </CardTitle>
            <CardDescription>
              Names, roles and photographs, in the order shown on the site.
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => setAdding(true)} className="shrink-0">
            <Plus className="size-4" aria-hidden />
            Add director
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {directors.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              No directors listed.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {directors.map((director, index) => (
                <li
                  key={director.id}
                  className="flex animate-in flex-col gap-3 px-4 py-3.5 fade-in sm:flex-row sm:items-center sm:gap-4 sm:px-5"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    {director.imageUrl ? (
                      <Image
                        src={director.imageUrl}
                        alt=""
                        width={44}
                        height={44}
                        // Uploads are served by our own route, which Next's
                        // optimiser is not configured for.
                        unoptimized
                        className="size-11 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-navy text-xs font-medium text-white">
                        {initials(director.name)}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-brand-navy">
                        {director.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {director.role}
                      </p>
                    </div>
                    {director.category ? (
                      <Badge variant="secondary" className="hidden shrink-0 text-[10px] sm:inline-flex">
                        {director.category}
                      </Badge>
                    ) : null}
                    {!director.imageUrl ? (
                      <Badge
                        variant="outline"
                        className="hidden shrink-0 gap-1 text-[10px] lg:inline-flex"
                      >
                        <ImageOff className="size-2.5" aria-hidden />
                        No photo
                      </Badge>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 items-center gap-0.5 self-end sm:self-auto">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Move up"
                      disabled={index === 0 || busyId === director.id}
                      onClick={async () => {
                        setBusyId(director.id);
                        await run(
                          () => moveDirector(director.id, "up"),
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
                        index === directors.length - 1 || busyId === director.id
                      }
                      onClick={async () => {
                        setBusyId(director.id);
                        await run(
                          () => moveDirector(director.id, "down"),
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
                      onClick={() => setEditing(director)}
                    >
                      <Pencil className="size-4" aria-hidden />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Remove"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleting(director)}
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

      <DirectorDialog
        open={adding}
        onClose={() => setAdding(false)}
        heading="Add a director"
        onSubmit={async (formData) => {
          const ok = await run(() => createDirector(formData), "Director added");
          if (ok) setAdding(false);
        }}
      />

      <DirectorDialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        heading="Edit director"
        director={editing ?? undefined}
        onRemovePhoto={
          editing?.imageUrl
            ? async () => {
                await run(
                  () => removeDirectorImage(editing.id),
                  "Photograph removed",
                );
                setEditing(null);
              }
            : undefined
        }
        onSubmit={async (formData) => {
          const ok = await run(
            () => updateDirector(editing!.id, formData),
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
            <AlertDialogTitle>Remove this director?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting?.name} will stop appearing on the Governance page. Any
              uploaded photograph is deleted with them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                const director = deleting;
                if (!director) return;
                setDeleting(null);
                await run(() => deleteDirector(director.id), "Director removed");
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
    </>
  );
}

function DirectorDialog({
  open,
  onClose,
  heading,
  director,
  onSubmit,
  onRemovePhoto,
}: {
  open: boolean;
  onClose: () => void;
  heading: string;
  director?: Director;
  onSubmit: (formData: FormData) => Promise<void>;
  onRemovePhoto?: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const shown = preview ?? director?.imageUrl ?? null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setPreview(null);
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{heading}</DialogTitle>
          <DialogDescription>
            A photograph is optional. Without one the site shows the
            director&rsquo;s initials, rather than a stock portrait standing in
            for a named person.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            setBusy(true);
            await onSubmit(formData);
            setBusy(false);
            setPreview(null);
          }}
          className="space-y-4"
        >
          <div className="flex items-center gap-4">
            {shown ? (
              <Image
                src={shown}
                alt=""
                width={64}
                height={64}
                unoptimized
                className="size-16 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="grid size-16 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground">
                <ImageOff className="size-5" aria-hidden />
              </span>
            )}
            <div className="min-w-0 space-y-1.5">
              <Label htmlFor="director-image">Photograph</Label>
              <Input
                id="director-image"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                ref={fileRef}
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  setPreview(file ? URL.createObjectURL(file) : null);
                }}
                className="cursor-pointer file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-secondary file:px-2 file:py-1 file:text-xs file:font-medium file:text-brand-navy"
              />
              <p className="text-xs text-muted-foreground">
                JPG, PNG, WebP or AVIF, up to 8 MB.
                {director ? " Leave empty to keep the current photograph." : ""}
              </p>
            </div>
          </div>

          {onRemovePhoto ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={async () => {
                setBusy(true);
                await onRemovePhoto();
                setBusy(false);
              }}
              disabled={busy}
            >
              <Trash2 className="size-3.5" aria-hidden />
              Remove photograph
            </Button>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="director-name">Name</Label>
            <Input
              id="director-name"
              name="name"
              required
              maxLength={200}
              placeholder="Mr. Nadeem Saulat Siddiqui"
              key={`${director?.id ?? "new"}-name`}
              defaultValue={director?.name ?? ""}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="director-role">Role</Label>
            <Input
              id="director-role"
              name="role"
              required
              maxLength={200}
              placeholder="Chairperson"
              key={`${director?.id ?? "new"}-role`}
              defaultValue={director?.role ?? ""}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="director-category">Category</Label>
            <Input
              id="director-category"
              name="category"
              maxLength={60}
              placeholder="Independent, Non-Executive or Executive"
              key={`${director?.id ?? "new"}-category`}
              defaultValue={director?.category ?? ""}
            />
            <p className="text-xs text-muted-foreground">
              Optional. As reported in the annual report.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="director-bio">Biography</Label>
            <Textarea
              id="director-bio"
              name="bio"
              rows={4}
              maxLength={4000}
              placeholder="Optional. Only what the Company has published."
              key={`${director?.id ?? "new"}-bio`}
              defaultValue={director?.bio ?? ""}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPreview(null);
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Upload className="size-4" aria-hidden />
              )}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
