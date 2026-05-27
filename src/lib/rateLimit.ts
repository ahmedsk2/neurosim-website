/**
 * Minimal in-memory, fixed-window rate limiter. The Review Console runs as a single server
 * process, so a module-level Map is sufficient (no cross-instance coordination needed). Used to
 * throttle the public token-acceptance endpoints (accept-invite / reset-password) by client IP.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfterMs: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterMs: 0 };
  }
  if (b.count >= limit) return { ok: false, retryAfterMs: b.resetAt - now };
  b.count += 1;
  return { ok: true, retryAfterMs: 0 };
}

/** Test/maintenance helper: clear all buckets. */
export function __resetRateLimit(): void {
  buckets.clear();
}

/** Best-effort client IP from proxy headers (the Cloudflare Tunnel sets x-forwarded-for). */
export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]?.trim() || 'unknown';
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}
