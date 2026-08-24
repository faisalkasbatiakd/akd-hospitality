import { docsBaseUrl } from "@/lib/site";

/**
 * Where a stored file lives and how it is served.
 *
 * Two kinds of key, because the archive predates the dashboard:
 *
 *   documents/<name>   the 110 filings already committed under public/documents.
 *                      Served straight from the public directory - 146 MB is not
 *                      copied into a new store just to change how it is
 *                      addressed, and a filed notice never changes anyway.
 *
 *   uploads/<name>     anything added through the dashboard. Written outside
 *                      public/ so Next.js does not have to be restarted for a
 *                      new file to be visible, and streamed by a route handler.
 *
 * Swapping the upload store for S3, R2 or Vercel Blob later means changing
 * fileUrl() and the writer, not the database: keys stay valid.
 */

export const UPLOAD_PREFIX = "uploads/";
export const LEGACY_PREFIX = "documents/";

/**
 * Local directory holding dashboard uploads. Gitignored, created on demand.
 *
 * A literal rather than an env var on purpose. Turbopack traces filesystem
 * access statically: a path it cannot resolve makes it bundle the entire
 * project into the server output, public/documents and all - 146 MB of PDFs
 * shipped as server code. Keeping the segment literal keeps the trace scoped.
 *
 * To store uploads elsewhere in production, mount the volume at ./storage
 * rather than pointing the app at another path.
 */
export const uploadRoot = "storage";

export function isLegacyKey(key: string) {
  return key.startsWith(LEGACY_PREFIX);
}

/** Public URL for a stored file. */
export function fileUrl(key: string) {
  if (isLegacyKey(key)) {
    const name = key.slice(LEGACY_PREFIX.length);
    // docsBaseUrl is configurable so the archive can move to object storage
    // without touching the database.
    return `${docsBaseUrl}/${encodeURIComponent(name)}`;
  }
  return `/api/files/${key.split("/").map(encodeURIComponent).join("/")}`;
}

/**
 * Reverse of docUrl(): recovers the file name from a URL built by the old data
 * files, so the seed can key documents without exporting their private records.
 */
export function keyFromDocUrl(href: string) {
  const name = decodeURIComponent(href.split("/").pop() ?? "");
  return `${LEGACY_PREFIX}${name}`;
}

/**
 * Guards a key coming from a URL segment. Rejects traversal and anything
 * outside the two known prefixes, so the file route cannot be walked up into
 * the rest of the filesystem.
 */
export function safeUploadKey(key: string) {
  if (!key.startsWith(UPLOAD_PREFIX)) return null;
  const rest = key.slice(UPLOAD_PREFIX.length);
  if (!rest || rest.includes("..") || rest.includes("\\") || rest.startsWith("/")) {
    return null;
  }
  // One flat level: uploads/<name>. No nested directories to reason about.
  if (rest.includes("/")) return null;
  return `${UPLOAD_PREFIX}${rest}`;
}
