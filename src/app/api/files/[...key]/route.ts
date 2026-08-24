import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join } from "node:path";

import { NextResponse } from "next/server";

import { safeUploadKey } from "@/lib/storage";

/**
 * Serves files added through the dashboard.
 *
 * Uploads are written outside public/ so a new file is visible without
 * restarting the server, which means they need a route to reach the browser.
 * The 110 committed filings are not served here - they are static assets under
 * public/documents.
 *
 * Swapping local disk for object storage later means redirecting from here
 * instead of streaming, with no change to stored keys.
 */

/**
 * Allowlist rather than a lookup: the type is sent to the browser, so an
 * unexpected extension must fall out of the list rather than be guessed at.
 */
const CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

function toWebStream(path: string) {
  const node = createReadStream(path);
  return new ReadableStream({
    start(controller) {
      node.on("data", (chunk) =>
        controller.enqueue(new Uint8Array(chunk as Buffer)),
      );
      node.on("end", () => controller.close());
      node.on("error", (error) => controller.error(error));
    },
    cancel() {
      node.destroy();
    },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key: segments } = await params;
  // safeUploadKey rejects traversal and anything outside uploads/, so a crafted
  // path cannot be walked into the rest of the filesystem.
  const key = safeUploadKey(segments.map(decodeURIComponent).join("/"));
  if (!key) return new NextResponse("Not found", { status: 404 });

  const contentType = CONTENT_TYPES[extname(key).toLowerCase()];
  if (!contentType) return new NextResponse("Not found", { status: 404 });

  const absolute = join(process.cwd(), "storage", key);

  let size: number;
  try {
    const info = await stat(absolute);
    if (!info.isFile()) return new NextResponse("Not found", { status: 404 });
    size = info.size;
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(toWebStream(absolute), {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(size),
      // Uploads are stored under a generated name, so a given key never
      // changes: a replacement arrives as a new key.
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": "inline",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
