import { defineConfig } from "drizzle-kit";

/**
 * Migrations are generated to ./drizzle and applied with `npm run db:migrate`.
 * They are committed, so the schema history is reviewable rather than being
 * pushed straight at the database.
 */
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
});
