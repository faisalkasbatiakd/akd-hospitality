import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

/**
 * One pool per process. Next.js reloads modules on every edit in development,
 * so without the global the dev server opens a new pool per save and Postgres
 * runs out of connections within a few minutes.
 */
const globalForDb = globalThis as unknown as { pool?: Pool };

function connectionString() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.",
    );
  }
  // pg v8 treats sslmode=require as verify-full, which rejects Railway's
  // proxy certificate. TLS is enabled via `ssl` on the pool instead.
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("sslmode");
    parsed.searchParams.delete("uselibpqcompat");
    return parsed.toString();
  } catch {
    return url;
  }
}

function sslFor(url: string) {
  try {
    const { hostname } = new URL(url);
    if (hostname.endsWith(".rlwy.net")) {
      return { rejectUnauthorized: false };
    }
  } catch {
    return undefined;
  }
  return undefined;
}

const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: connectionString(),
    max: 10,
    idleTimeoutMillis: 30_000,
    ssl: sslFor(connectionString()),
  });

if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;

export const db = drizzle(pool, { schema });
export { schema };
