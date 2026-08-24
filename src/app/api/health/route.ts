import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";

/**
 * Readiness check for the platform's health probe.
 *
 * Checks the database, not just that the process is up: the site's content
 * lives in Postgres, so a server that cannot reach it is not ready to serve
 * even though it answers TCP. Without this the platform routes traffic the
 * moment the port opens, which is what produced a 502 on the first request
 * after a deploy.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return NextResponse.json({ status: "ok", database: "up" });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      { status: "degraded", database: "down" },
      { status: 503 },
    );
  }
}
