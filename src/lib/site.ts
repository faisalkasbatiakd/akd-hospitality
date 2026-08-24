/**
 * Canonical site configuration for metadata.
 *
 * The canonical host is akdhospitality.com without www. Every canonical link,
 * Open Graph URL, sitemap entry and robots directive is derived from this one
 * value, so the whole site moves by changing it in one place.
 *
 * Pick one host and stay on it: serving the same pages on both the apex and the
 * www subdomain splits ranking signals between two URLs. Once DNS is in place,
 * point www.akdhospitality.com at a 301 redirect to the apex rather than
 * letting both resolve.
 *
 * NEXT_PUBLIC_SITE_URL overrides this per environment (Vercel preview, staging,
 * production). The fallback is the production host so that a plain build still
 * emits correct absolute URLs.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://akdhospitality.com"
).replace(/\/$/, "");

/**
 * Whether search engines may index this deployment.
 *
 * Set NEXT_PUBLIC_NOINDEX=true on anything that is not the live site. It is
 * needed while the site runs on a temporary Railway host: the real domain is
 * still serving the previous website, so if the temporary host were indexed
 * there would eventually be two URLs holding the same pages, competing with
 * each other for the same queries.
 *
 * Deliberately opt-out rather than opt-in. A forgotten flag then costs a
 * missing staging page in the index, not the live site vanishing from it.
 */
export const isIndexable = process.env.NEXT_PUBLIC_NOINDEX !== "true";

export const siteName = "AKD Hospitality Limited";

export const defaultTitle =
  "AKD Hospitality Limited | PSX-Listed Tourism Company";

export const defaultDescription =
  "AKD Hospitality Limited (AKDHL): incorporated 1936, quoted on the Pakistan Stock Exchange, with a mandate across hospitality, motels and tourism.";

/**
 * Social card produced by src/app/opengraph-image.tsx.
 *
 * Declared explicitly because a page that sets its own `openGraph` object
 * replaces the inherited one, which drops the file-based image. Spread this
 * into every page's openGraph so the card is never lost.
 */
export const ogImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "AKD Hospitality Limited - incorporated 1936, quoted on the Pakistan Stock Exchange as AKDHL",
} as const;

/**
 * Base path for the Company's PDF library.
 *
 * The archive - 110 documents, every annual report, financial statement, AGM
 * notice and shareholding pattern published by the Company - is served from
 * this site rather than the old domain, which is being retired. Files were
 * re-compressed from 294 MB to 146 MB: scanned documents re-rendered at 150 DPI
 * and oversized embedded images downsampled, with text layers left intact. No
 * document was dropped and no page was lost.
 *
 * Set NEXT_PUBLIC_DOCS_BASE_URL to move the archive to object storage (Vercel
 * Blob, S3, R2) if the deployment target limits static asset size.
 */
export const docsBaseUrl = (
  process.env.NEXT_PUBLIC_DOCS_BASE_URL ?? "/documents"
).replace(/\/$/, "");

/** Build the URL for one document, given its file name. */
export function docUrl(fileName: string) {
  return `${docsBaseUrl}/${encodeURIComponent(fileName)}`;
}
