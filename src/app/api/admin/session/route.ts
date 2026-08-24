import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { adminUsers, auditLog } from "@/db/schema";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/auth";

const credentials = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
});

/** Sign in. */
export async function POST(request: Request) {
  const parsed = credentials.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email));

  /**
   * Same answer whether the address is unknown or the password is wrong, and
   * the hash comparison runs either way so a missing user does not return
   * measurably faster than a bad password.
   */
  const hash =
    user?.passwordHash ??
    "$2b$12$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const ok = await verifyPassword(parsed.data.password, hash);

  if (!user || !ok) {
    return NextResponse.json({ error: "bad_credentials" }, { status: 401 });
  }

  await db
    .update(adminUsers)
    .set({ lastLoginAt: new Date() })
    .where(eq(adminUsers.id, user.id));
  await db.insert(auditLog).values({
    actorEmail: user.email,
    action: "login",
    entity: "admin_users",
    entityId: String(user.id),
    summary: "Signed in",
  });

  const token = await createSessionToken({ email: user.email, name: user.name });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}

/** Sign out. */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", {
    ...sessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}
