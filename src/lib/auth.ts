import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

/**
 * Admin session.
 *
 * One shared login, so there is no user table to join and no roles to check.
 * The session is a signed JWT in an httpOnly cookie rather than a database
 * row: nothing here needs server-side revocation beyond changing AUTH_SECRET,
 * and a stateless cookie keeps the middleware edge-safe.
 *
 * bcrypt for the password, jose for the signature. Neither is hand-rolled.
 */

export const SESSION_COOKIE = "akd_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8; // a working day

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 16) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Generate one with: openssl rand -base64 32",
    );
  }
  return new TextEncoder().encode(value);
}

export type Session = { email: string; name: string };

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function createSessionToken(session: Session) {
  return new SignJWT({ email: session.email, name: session.name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());
}

export async function readSessionToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.email !== "string" || typeof payload.name !== "string") {
      return null;
    }
    return { email: payload.email, name: payload.name };
  } catch {
    // Expired, tampered with, or signed under a previous AUTH_SECRET.
    return null;
  }
}

/** The signed-in admin, or null. For use in server components and actions. */
export async function currentSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return readSessionToken(token);
}

/**
 * Throws if there is no session. Route handlers and server actions call this
 * rather than trusting that middleware ran - middleware guards navigation, not
 * every possible entry point.
 */
export async function requireSession(): Promise<Session> {
  const session = await currentSession();
  if (!session) throw new Error("unauthorised");
  return session;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}
