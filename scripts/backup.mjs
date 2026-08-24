/**
 * Take a logical backup of the database that DATABASE_URL points at.
 *
 *   npm run db:backup                      # whatever .env.local points at
 *   ENV_FILE=prod.env npm run db:backup    # production, through the TCP proxy
 *
 * Why this exists alongside Railway's own volume backups: those restore only
 * into the same project and environment, and they are deleted with the volume.
 * This file is a portable copy that survives the project itself, which is not
 * a hypothetical concern on this deployment - the project has been deleted and
 * rebuilt once already.
 *
 * Custom format rather than plain SQL, so pg_restore can do selective and
 * parallel restores.
 *
 * Restoring is the other half, and an unrestored backup is unverified. Drill it
 * against a scratch database, never the live one:
 *
 *   psql "<url>/postgres" -c 'CREATE DATABASE restore_drill;'
 *   pg_restore --dbname="<url>/restore_drill" --no-owner --exit-on-error <file>
 *   psql "<url>/restore_drill" -c 'select count(*) from documents;'
 *   psql "<url>/postgres" -c 'DROP DATABASE restore_drill;'
 */

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "DATABASE_URL is not set. Run through npm run db:backup, which loads the env file.",
  );
  process.exit(1);
}

/**
 * pg_dump has to match the server's major version or it refuses to run, and on
 * Windows the Postgres bin directory is not on PATH by default. So: honour an
 * explicit override, then try PATH, then look where the installer puts it.
 */
function findPgDump() {
  if (process.env.PG_DUMP) return process.env.PG_DUMP;

  const onPath = spawnSync("pg_dump", ["--version"], { shell: true });
  if (onPath.status === 0) return "pg_dump";

  for (const major of [18, 17, 16, 15]) {
    const guess = `C:/Program Files/PostgreSQL/${major}/bin/pg_dump.exe`;
    if (existsSync(guess)) return guess;
  }

  return null;
}

const pgDump = findPgDump();
if (!pgDump) {
  console.error(
    "pg_dump not found. Install the Postgres client tools, or set PG_DUMP to its full path.",
  );
  process.exit(1);
}

const dir = process.env.BACKUP_DIR ?? "backups";
mkdirSync(dir, { recursive: true });

// Sortable, filename-safe, and no colons: 20260825-004512.
const stamp = new Date()
  .toISOString()
  .replace(/[:T]/g, "-")
  .replace(/\..+$/, "")
  .replace(/-(\d\d)-(\d\d)-(\d\d)$/, "-$1$2$3");
const file = join(dir, `akdhl-${stamp}.dump`);

const result = spawnSync(
  pgDump,
  [
    url,
    "--format=custom",
    // The restore target owns its own roles; carrying ours over makes the dump
    // refuse to restore anywhere else, which defeats the point of having it.
    "--no-owner",
    "--no-privileges",
    `--file=${file}`,
  ],
  { stdio: ["ignore", "inherit", "inherit"] },
);

if (result.status !== 0) {
  console.error("\npg_dump failed.");
  process.exit(result.status ?? 1);
}

console.log(`\nWrote ${file}`);
console.log(
  "Keep a copy somewhere that is not Railway. A backup stored beside the thing it protects is not a backup.",
);
