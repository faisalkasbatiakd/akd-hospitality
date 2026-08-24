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
  return url;
}

const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: connectionString(),
    max: 10,
    idleTimeoutMillis: 30_000,
  });

if (process.env.NODE_ENV !== "production") globalForDb.pool = pool;

export const db = drizzle(pool, { schema });
export { schema };
