/**
 * Fixed-window attempt counter, used to slow down password guessing.
 *
 * Held in memory rather than in Postgres or Redis. That is a deliberate choice
 * for this deployment, and it has one real limitation worth stating plainly:
 * the counters reset when the process restarts, and a second instance would
 * keep its own. Both are acceptable here because the service runs as a single
 * Railway instance, and because bcrypt at cost 12 already caps guessing at
 * roughly four attempts a second per instance - about 250 ms of CPU each. The
 * limiter turns that into a hard stop rather than a slow grind.
 *
 * If the service is ever scaled past one instance, this has to move to a shared
 * store, otherwise the effective limit multiplies by the instance count.
 *
 * No dependency on the database on purpose: a limiter that fails when Postgres
 * is unreachable would either lock everyone out or let everyone through, and
 * both are worse than a counter that is merely per-instance.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/**
 * Ceiling on tracked keys, so that an attacker rotating addresses cannot grow
 * this map without bound. Well above any legitimate volume for a dashboard with
 * a handful of users.
 */
const MAX_KEYS = 10_000;

function sweep(now: number) {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export type RateLimitResult = {
  /** True when the caller is over the limit and should be refused. */
  limited: boolean;
  /** Whole seconds until the window resets. Feeds the Retry-After header. */
  retryAfter: number;
  /** Attempts still available in this window. */
  remaining: number;
};

/**
 * Count one attempt against `key` and report whether it is over `limit`.
 *
 * Call this only for attempts that failed. A correct password should not spend
 * anyone's budget, otherwise normal use during a busy day starts returning 429.
 */
export function hit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();

  if (windows.size > MAX_KEYS) sweep(now);

  const existing = windows.get(key);
  const window =
    existing && existing.resetAt > now
      ? existing
      : { count: 0, resetAt: now + windowMs };

  window.count += 1;
  windows.set(key, window);

  return {
    limited: window.count > limit,
    retryAfter: Math.max(1, Math.ceil((window.resetAt - now) / 1000)),
    remaining: Math.max(0, limit - window.count),
  };
}

/**
 * Report on `key` without counting an attempt against it.
 *
 * Used to refuse a caller who is already over the limit before doing the
 * expensive work, so that a flood of requests cannot buy CPU time by being
 * rejected slowly.
 */
export function peek(key: string, limit: number): RateLimitResult {
  const now = Date.now();
  const window = windows.get(key);

  if (!window || window.resetAt <= now) {
    return { limited: false, retryAfter: 0, remaining: limit };
  }

  return {
    limited: window.count > limit,
    retryAfter: Math.max(1, Math.ceil((window.resetAt - now) / 1000)),
    remaining: Math.max(0, limit - window.count),
  };
}

/** Clear a key's window. Called after a successful sign in. */
export function reset(key: string) {
  windows.delete(key);
}

/**
 * The address this request came from.
 *
 * Railway terminates TLS at its edge and forwards with X-Forwarded-For, so
 * there is no direct socket address to read. A client can send its own
 * X-Forwarded-For and the proxy appends to it, which means the leftmost entry
 * is attacker-controlled and the rightmost is the address the proxy actually
 * observed. So the rightmost is used.
 *
 * This is a best effort and is treated as such: the per-address limit is a
 * courtesy brake, and the limit that actually matters is the one keyed by the
 * email being attacked, which the attacker cannot rotate while still attacking
 * the same account.
 */
export function clientAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const hops = forwarded
      .split(",")
      .map((hop) => hop.trim())
      .filter(Boolean);
    if (hops.length > 0) return hops[hops.length - 1];
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
