"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  ChevronDown,
  ChevronUp,
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
  addHeroSlide,
  deleteHeroSlide,
  moveHeroSlide,
  replaceImage,
  updateHeroSlide,
  updateImageAlt,
} from "./actions";

export type Slot = {
  key: string;
  label: string;
  where: string;
  url: string;
  alt: string;
  placeholder: boolean;
};
export type Group = { title: string; description: string; slots: Slot[] };
export type Slide = {
  id: number;
  url: string;
  alt: string;
  credit: string | null;
  placeholder: boolean;
};

type Result = { ok: true } | { ok: false; error: string };

export function ImagesManager({
  groups,
  slides,
}: {
  groups: Group[];
  slides: Slide[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [addingSlide, setAddingSlide] = useState(false);
  const [deletingSlide, setDeletingSlide] = useState<Slide | null>(null);
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
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-brand-navy">Images</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every photograph on the website. Replace one and the page it sits on
          updates.
        </p>
      </div>

      {/* Home page carousel */}
      <Card className="overflow-hidden p-0">
        <CardHeader className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <CardTitle className="text-base">
              Home page hero ({slides.length})
            </CardTitle>
            <CardDescription>
              The rotating photographs behind “Built on Trust”.
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={() => setAddingSlide(true)}
            className="shrink-0"
          >
            <Plus className="size-4" aria-hidden />
            Add slide
          </Button>
        </CardHeader>
        <CardContent className="p-4 sm:p-5">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {slides.map((slide, index) => (
              <li
                key={slide.id}
                className="animate-in overflow-hidden rounded-xl border border-border fade-in"
              >
                <div className="relative aspect-[4/3] bg-secondary">
                  <Image
                    src={slide.url}
                    alt={slide.alt}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 p-3">
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {slide.alt}
                  </p>
                  <div className="flex items-center gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Move up"
                      disabled={index === 0 || busyId === slide.id}
                      onClick={async () => {
                        setBusyId(slide.id);
                        await run(
                          () => moveHeroSlide(slide.id, "up"),
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
                        index === slides.length - 1 || busyId === slide.id
                      }
                      onClick={async () => {
                        setBusyId(slide.id);
                        await run(
                          () => moveHeroSlide(slide.id, "down"),
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
                      aria-label="Edit slide"
                      onClick={() => setEditingSlide(slide)}
                    >
                      <Pencil className="size-4" aria-hidden />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Remove slide"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeletingSlide(slide)}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Keyed slots */}
      {groups.map((group) => (
        <Card key={group.title} className="overflow-hidden p-0">
          <CardHeader className="border-b border-border p-4 sm:p-5">
            <CardTitle className="text-base">
              {group.title} ({group.slots.length})
            </CardTitle>
            <CardDescription>{group.description}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.slots.map((slot) => (
                <li
                  key={slot.key}
                  className="animate-in overflow-hidden rounded-xl border border-border fade-in"
                >
                  <div className="relative aspect-[16/10] bg-secondary">
                    <Image
                      src={slot.url}
                      alt={slot.alt}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-2 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-brand-navy">
                          {slot.label}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {slot.where}
                        </p>
                      </div>
                      {slot.placeholder ? (
                        <Badge
                          variant="outline"
                          className="shrink-0 text-[10px]"
                        >
                          Stock
                        </Badge>
                      ) : (
                        <Badge className="shrink-0 text-[10px]">Uploaded</Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setEditingSlot(slot)}
                    >
                      <Upload className="size-3.5" aria-hidden />
                      Replace
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}

      <SlotDialog
        slot={editingSlot}
        onClose={() => setEditingSlot(null)}
        onSubmit={async (formData, altOnly) => {
          const slot = editingSlot;
          if (!slot) return;
          if (altOnly) {
            const ok = await run(
              () => updateImageAlt(slot.key, String(formData.get("alt") ?? "")),
              "Alt text saved",
            );
            if (ok) setEditingSlot(null);
            return;
          }
          const alt = String(formData.get("alt") ?? "");
          const replaced = await run(
            () => replaceImage(slot.key, formData),
            "Image replaced",
          );
          if (replaced && alt !== slot.alt) {
            await updateImageAlt(slot.key, alt);
          }
          if (replaced) setEditingSlot(null);
        }}
      />

      <SlideDialog
        open={addingSlide}
        onClose={() => setAddingSlide(false)}
        heading="Add a hero slide"
        requireImage
        onSubmit={async (formData) => {
          const ok = await run(() => addHeroSlide(formData), "Slide added");
          if (ok) setAddingSlide(false);
        }}
      />

      <SlideDialog
        open={editingSlide !== null}
        onClose={() => setEditingSlide(null)}
        heading="Edit hero slide"
        slide={editingSlide ?? undefined}
        onSubmit={async (formData) => {
          const ok = await run(
            () => updateHeroSlide(editingSlide!.id, formData),
            "Slide saved",
          );
          if (ok) setEditingSlide(null);
        }}
      />

      <AlertDialog
        open={deletingSlide !== null}
        onOpenChange={(open) => !open && setDeletingSlide(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this slide?</AlertDialogTitle>
            <AlertDialogDescription>
              It will stop appearing in the home page hero. An uploaded file is
              deleted with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                const slide = deletingSlide;
                if (!slide) return;
                setDeletingSlide(null);
                await run(() => deleteHeroSlide(slide.id), "Slide removed");
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

function SlotDialog({
  slot,
  onClose,
  onSubmit,
}: {
  slot: Slot | null;
  onClose: () => void;
  onSubmit: (formData: FormData, altOnly: boolean) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [hasFile, setHasFile] = useState(false);

  const shown = preview ?? slot?.url ?? null;

  return (
    <Dialog
      open={slot !== null}
      onOpenChange={(open) => {
        if (!open) {
          setPreview(null);
          setHasFile(false);
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{slot?.label}</DialogTitle>
          <DialogDescription>{slot?.where}</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            setBusy(true);
            await onSubmit(formData, !hasFile);
            setBusy(false);
            setPreview(null);
            setHasFile(false);
          }}
          className="space-y-4"
        >
          {shown ? (
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-secondary">
              <Image
                src={shown}
                alt=""
                fill
                unoptimized
                sizes="400px"
                className="object-cover"
              />
            </div>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="slot-image">New image</Label>
            <Input
              id="slot-image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                setHasFile(Boolean(file));
                setPreview(file ? URL.createObjectURL(file) : null);
              }}
              className="cursor-pointer file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-secondary file:px-2 file:py-1 file:text-xs file:font-medium file:text-brand-navy"
            />
            <p className="text-xs text-muted-foreground">
              JPG, PNG, WebP or AVIF, up to 8 MB. Leave empty to change only the
              description.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slot-alt">Description (alt text)</Label>
            <Textarea
              id="slot-alt"
              name="alt"
              rows={3}
              required
              maxLength={400}
              key={slot?.key}
              defaultValue={slot?.alt ?? ""}
            />
            <p className="text-xs text-muted-foreground">
              What a screen reader announces, and what search engines read.
              Describe the photograph, not the page.
            </p>
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

function SlideDialog({
  open,
  onClose,
  heading,
  slide,
  requireImage = false,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  heading: string;
  slide?: Slide;
  requireImage?: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const shown = preview ?? slide?.url ?? null;

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
            Landscape photographs work best — the hero is very wide.
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
          {shown ? (
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-secondary">
              <Image
                src={shown}
                alt=""
                fill
                unoptimized
                sizes="400px"
                className="object-cover"
              />
            </div>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="slide-image">Photograph</Label>
            <Input
              id="slide-image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              required={requireImage}
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                setPreview(file ? URL.createObjectURL(file) : null);
              }}
              className="cursor-pointer file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-secondary file:px-2 file:py-1 file:text-xs file:font-medium file:text-brand-navy"
            />
            {!requireImage ? (
              <p className="text-xs text-muted-foreground">
                Leave empty to keep the current photograph.
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slide-alt">Description (alt text)</Label>
            <Textarea
              id="slide-alt"
              name="alt"
              rows={3}
              required
              maxLength={400}
              key={`${slide?.id ?? "new"}-alt`}
              defaultValue={slide?.alt ?? ""}
              placeholder="Aerial view of a river winding through the mountains of northern Pakistan"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slide-credit">Credit</Label>
            <Input
              id="slide-credit"
              name="credit"
              maxLength={120}
              key={`${slide?.id ?? "new"}-credit`}
              defaultValue={slide?.credit ?? ""}
              placeholder="Optional"
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
