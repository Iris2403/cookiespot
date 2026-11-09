/**
 * Fixed-window in-memory rate limiter.
 * Good enough for a single server / per-instance protection. On multi-instance serverless
 * hosting, put the platform's rate limiting (e.g. Vercel Firewall / Cloudflare rules) in front
 * of /api/contact as well — see README.
 */
const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()) {
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.reset <= now) buckets.delete(k);
  }
  const b = buckets.get(key);
  if (!b || b.reset <= now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1, reset: now + windowMs };
  }
  b.count += 1;
  return { ok: b.count <= limit, remaining: Math.max(0, limit - b.count), reset: b.reset };
}

export function __resetRateLimit() {
  buckets.clear();
}
