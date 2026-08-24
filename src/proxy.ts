import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, readSessionToken } from "@/lib/auth";

/**
 * Guards the dashboard.
 *
 * Named proxy.ts: Next 16 renamed the middleware convention and warns on the
 * old name at build time. Same behaviour, same matcher.
 *
 * This only gates navigation. Route handlers and server actions call
 * requireSession() themselves, because middleware is not a security boundary
 * you can rely on alone - a matcher change or a direct fetch bypasses it.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await readSessionToken(token) : null;

  if (pathname === "/admin/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const login = new URL("/admin/login", request.url);
    // Come back to the page that was asked for after signing in.
    if (pathname !== "/admin") login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
