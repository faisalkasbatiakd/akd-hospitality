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
import { clientAddress, hit, peek, reset } from "@/lib/rate-limit";

const credentials = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
});

/**
 * Failed sign-in budgets, per fifteen minutes.
 *
 * Two limits, because they stop different things. The per-address limit stops
 * one machine working through a password list. The per-email limit stops a
 * distributed attempt on one account, and it is the limit that cannot be
 * evaded: an attacker can move between addresses, but not away from the
 * account they are trying to open.
 *
 * The account budget is the looser of the two on purpose. It is shared by
 * everyone attacking that address, so setting it tight would let an attacker
 * lock the real user out by failing on their behalf - turning a brute-force
 * defence into a denial-of-service tool. Ten attempts a quarter hour is far
 * below what guessing needs and far above what a person mistyping needs.
 */
const WINDOW_MS = 15 * 60 * 1000;
const PER_ADDRESS = 10;
const PER_EMAIL = 10;

function tooMany(retryAfter: number) {
  return NextResponse.json(
    { error: "too_many_attempts" },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}

/** Sign in. */
export async function POST(request: Request) {
  const address = clientAddress(request);
  const addressKey = `login:ip:${address}`;

  /*
   * Refuse an address that is already over its budget before parsing or
   * hashing anything. Otherwise every rejected request still buys 250 ms of
   * bcrypt, and the limiter becomes a way to spend the server's CPU rather
   * than a way to protect it.
   */
  const addressState = peek(addressKey, PER_ADDRESS);
  if (addressState.limited) return tooMany(addressState.retryAfter);

  const parsed = credentials.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    /*
     * A malformed body counts as a failed attempt. It is not a mistake a real
     * form makes - the client sends the same shape every time - so leaving it
     * uncounted would leave a free channel for probing.
     */
    hit(addressKey, PER_ADDRESS, WINDOW_MS);
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const emailKey = `login:email:${email}`;

  const emailState = peek(emailKey, PER_EMAIL);
  if (emailState.limited) return tooMany(emailState.retryAfter);

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
    /*
     * Both budgets are charged, and the response is the same 401 either way.
     * Answering 429 only once the budget is spent would tell an attacker which
     * addresses exist, since a nonexistent account would never be worth
     * limiting; here the two are indistinguishable.
     */
    const byAddress = hit(addressKey, PER_ADDRESS, WINDOW_MS);
    const byEmail = hit(emailKey, PER_EMAIL, WINDOW_MS);

    if (byAddress.limited || byEmail.limited) {
      /*
       * Recorded so a real lockout is visible to whoever looks afterwards. The
       * address is stored, the attempted password never is.
       */
      await db
        .insert(auditLog)
        .values({
          actorEmail: email,
          action: "login_blocked",
          entity: "admin_users",
          entityId: "-",
          summary: `Sign-in attempts throttled from ${address}`,
        })
        .catch(() => {
          // An unreachable audit table must not turn a throttled attempt into
          // a 500, which would read as "keep trying".
        });
    }

    return NextResponse.json({ error: "bad_credentials" }, { status: 401 });
  }

  /*
   * A correct password clears both budgets. Without this, a user who mistyped
   * several times and then got it right would still be near the limit for the
   * rest of the window.
   */
  reset(addressKey);
  reset(emailKey);

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
