import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { join } from "node:path";

import { eq, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { auditLog, documents } from "@/db/schema";
import { currentSession } from "@/lib/auth";
import { TAGS } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import { UPLOAD_PREFIX, uploadRoot } from "@/lib/storage";
import { MAX_PDF_BYTES } from "@/lib/upload";

/**
 * Publishing a filing.
 *
 * This is a route handler rather than a server action, and that is the whole
 * point of it. Server actions carry their multipart body through Next's own
 * parser, and that parser gives up a little under 10 MB: the stream is cut off
 * mid-form and busboy throws "Unexpected end of form", which surfaces as a bare
 * 500 with nothing the dialog can explain. It is not the documented
 * `serverActions.bodySizeLimit` - that is set to 30 MB in next.config.ts and
 * the failure happens well below it, on both `next dev` and a production build.
 * Measured on this codebase: 9 MB uploads, 10 MB does not.
 *
 * That ceiling is not a theoretical one. ANNUAL_REPORT_2025.pdf is 12 MB, the
 * dashboard has always advertised 25 MB, and the client could not publish it.
 *
 * Route handlers do not go through that parser, so `request.formData()` here
 * takes the full body - verified against the live deployment, which accepted a
 * 12 MB request to /api/contact without the edge touching it. The size rule
 * that applies is ours, MAX_PDF_BYTES, and it is enforced below with a message
 * that says the actual number.
 *
 * The session is re-checked here. The proxy matcher covers /admin, not
 * /api/admin, so this endpoint is guarded by this function and nothing else.
 */

const titleSchema = z.string().trim().min(1, "A title is required").max(300);

function fail(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

function hostnameOf(value: string) {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function firstHeader(request: Request, name: string) {
  return request.headers.get(name)?.split(",")[0]?.trim() ?? "";
}

/**
 * Railway (and any TLS-terminating proxy) makes `new URL(request.url).origin`
 * a different string from the browser's Origin header: http vs https, or the
 * generated `*.up.railway.app` host instead of www. The dashboard posts from
 * https://www.akdhospitality.com; comparing those two origins 403s a real
 * upload. Trust the Origin host against this site's hosts instead.
 */
function isDashboardOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const host = hostnameOf(origin);
  if (!host) return false;
  if (host === "localhost" || host === "127.0.0.1") return true;

  const trusted = new Set<string>([
    hostnameOf(siteUrl),
    "www.akdhospitality.com",
    "akdhospitality.com",
  ]);

  const forwarded =
    firstHeader(request, "x-forwarded-host") || firstHeader(request, "host");
  const forwardedHost = forwarded.split(":")[0].toLowerCase();
  if (
    forwardedHost.endsWith(".up.railway.app") ||
    forwardedHost.endsWith(".railway.app")
  ) {
    trusted.add(forwardedHost);
  }

  return trusted.has(host);
}

export async function POST(request: Request) {
  const session = await currentSession();
  if (!session) return fail("Your session has ended. Sign in again.", 401);

  /*
   * The session cookie is SameSite=lax, so a cross-site POST never carries it
   * and this endpoint is already out of reach of a form on another origin.
   * Checked explicitly anyway: server actions get this for free and a route
   * handler does not, and the cookie policy is a setting someone could change
   * later without thinking about this file.
   *
   * Do not compare Origin to `request.url`: behind Railway that string is the
   * internal URL, not https://www.akdhospitality.com.
   */
  if (!isDashboardOrigin(request)) {
    return fail("That request did not come from the dashboard.", 403);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    // A truncated or malformed body - a dropped connection mid-upload.
    return fail("The upload was interrupted. Please try again.", 400);
  }

  const groupKey = String(form.get("groupKey") ?? "");
  if (!groupKey) return fail("Choose a category.", 400);

  const parsedTitle = titleSchema.safeParse(form.get("title"));
  if (!parsedTitle.success) {
    return fail(parsedTitle.error.issues[0].message, 400);
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return fail("Choose a PDF to upload.", 400);
  }
  if (file.type !== "application/pdf") {
    return fail("Only PDF files can be published.", 400);
  }
  if (file.size > MAX_PDF_BYTES) {
    return fail(
      `That file is ${(file.size / 1048576).toFixed(1)} MB. The limit is ${
        MAX_PDF_BYTES / 1048576
      } MB.`,
      413,
    );
  }

  // Stored under a generated name: two filings can share a display title, and a
  // visitor-supplied name must never reach the filesystem.
  const key = `${UPLOAD_PREFIX}${randomUUID()}.pdf`;
  try {
    await mkdir(join(process.cwd(), uploadRoot, UPLOAD_PREFIX), {
      recursive: true,
    });
    await writeFile(
      join(process.cwd(), uploadRoot, key),
      Buffer.from(await file.arrayBuffer()),
    );
  } catch (error) {
    console.error("Could not write the upload:", error);
    return fail("Could not save the file. Please try again.", 500);
  }

  // New filings go to the top of their group: the archive reads newest first.
  const [{ min }] = await db
    .select({ min: sql<number>`coalesce(min(${documents.sort}), 0)` })
    .from(documents)
    .where(eq(documents.groupKey, groupKey));

  const [row] = await db
    .insert(documents)
    .values({
      groupKey,
      title: parsedTitle.data,
      path: key,
      sizeBytes: file.size,
      sort: min - 1,
    })
    .returning({ id: documents.id });

  await db.insert(auditLog).values({
    actorEmail: session.email,
    action: "upload",
    entity: "documents",
    entityId: String(row.id),
    summary: `Added “${parsedTitle.data}” to ${groupKey}`,
  });

  /*
   * revalidateTag rather than updateTag: updateTag may only be called from a
   * server action, and this is a route handler.
   *
   * { expire: 0 } rather than the recommended "max". "max" serves the stale
   * page once more and refreshes behind it, so a newly published filing would
   * be missing the first time anyone looked - and "I changed it and nothing
   * happened" is the one complaint this dashboard has already produced twice.
   * Expiring now costs one uncached render and makes the upload visible at once.
   */
  revalidateTag(TAGS.documents, { expire: 0 });
  revalidatePath("/admin/documents");

  return NextResponse.json({ ok: true });
}
