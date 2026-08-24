/**
 * Creates or updates the admin login.
 *
 *   npm run db:admin -- --email you@example.com --name "Your Name" --password "..."
 *
 * With no --password a random one is generated and printed once. It is stored
 * only as a bcrypt hash, so a lost password is reset by running this again
 * rather than recovered.
 */
import { randomBytes } from "node:crypto";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { hashPassword } from "@/lib/auth";

function arg(name: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

async function main() {
  const email = (arg("email") ?? "admin@akdhospitality.com").toLowerCase().trim();
  const name = arg("name") ?? "Administrator";
  const generated = !arg("password");
  const password = arg("password") ?? randomBytes(9).toString("base64url");

  if (password.length < 10) {
    console.error("Password must be at least 10 characters.");
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  const [existing] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.email, email));

  if (existing) {
    await db
      .update(adminUsers)
      .set({ name, passwordHash })
      .where(eq(adminUsers.id, existing.id));
    console.log(`\nUpdated the login for ${email}`);
  } else {
    await db.insert(adminUsers).values({ email, name, passwordHash });
    console.log(`\nCreated the login for ${email}`);
  }

  console.log(`  email     ${email}`);
  if (generated) {
    console.log(`  password  ${password}`);
    console.log("\nThis is the only time the password is shown. Store it now.\n");
  } else {
    console.log("  password  (as supplied)\n");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\nFailed:\n", error);
    process.exit(1);
  });
