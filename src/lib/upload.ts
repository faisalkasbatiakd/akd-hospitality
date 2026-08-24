import { mkdir, unlink, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { join } from "node:path";

import { UPLOAD_PREFIX, isLegacyKey } from "@/lib/storage";

/**
 * Writing and removing dashboard uploads.
 *
 * Kept apart from the actions so the rules for what may be stored live in one
 * place: the type allowlist, the size ceiling, and the generated name. A
 * visitor-supplied filename never reaches the filesystem.
 */

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const MAX_PDF_BYTES = 25 * 1024 * 1024;

export type StoreResult =
  | { ok: true; key: string; bytes: number }
  | { ok: false; error: string };

const megabytes = (bytes: number) => `${(bytes / 1048576).toFixed(1)} MB`;

/** Stores an image and returns its key, or an explanation the UI can show. */
export async function storeImage(file: unknown): Promise<StoreResult> {
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose an image." };
  }

  const extension = IMAGE_TYPES[file.type];
  if (!extension) {
    return {
      ok: false,
      error: "Use a JPG, PNG, WebP or AVIF image.",
    };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      error: `That image is ${megabytes(file.size)}. The limit is ${megabytes(MAX_IMAGE_BYTES)}.`,
    };
  }

  const key = `${UPLOAD_PREFIX}${randomUUID()}${extension}`;
  try {
    await mkdir(join(process.cwd(), "storage", UPLOAD_PREFIX), {
      recursive: true,
    });
    await writeFile(
      join(process.cwd(), "storage", key),
      Buffer.from(await file.arrayBuffer()),
    );
  } catch (error) {
    console.error("Could not write the image:", error);
    return { ok: false, error: "Could not save the image. Please try again." };
  }

  return { ok: true, key, bytes: file.size };
}

/**
 * Deletes a stored upload. Legacy keys are ignored: those files are committed
 * to the repository, and unpublishing one must not delete tracked content.
 */
export async function removeUpload(key: string | null | undefined) {
  if (!key || isLegacyKey(key)) return;
  if (/^https?:\/\//.test(key)) return; // a seeded remote URL, nothing to delete
  try {
    await unlink(join(process.cwd(), "storage", key));
  } catch (error) {
    // The row is already updated; a missing file is not worth failing over.
    console.warn("Could not remove the stored file:", error);
  }
}
