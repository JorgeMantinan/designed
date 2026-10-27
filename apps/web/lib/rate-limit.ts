/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Single-instance by design (the MVP has no Redis): enough to blunt naive
 * abuse of expensive endpoints. Replace with a shared store when scaling out.
 */

export interface RateLimitOptions {
  /** Window length in milliseconds. */
  windowMs: number;
  /** Maximum hits per window per key. */
  max: number;
}

const hits = new Map<string, number[]>();

/** Extracts the client IP, preferring the proxy chain set by the platform. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'local';
}

/**
 * Returns true when the key is still allowed, registering this hit.
 * Expired timestamps are pruned lazily and the map is swept to stay bounded.
 */
export function rateLimit(key: string, options: RateLimitOptions, now = Date.now()): boolean {
  const windowStart = now - options.windowMs;
  const timestamps = (hits.get(key) ?? []).filter((stamp) => stamp > windowStart);

  if (timestamps.length >= options.max) {
    hits.set(key, timestamps);
    return false;
  }

  timestamps.push(now);
  hits.set(key, timestamps);

  // Bounded sweep: forget keys without recent activity.
  if (hits.size > 5_000) {
    for (const [mapKey, values] of hits) {
      if (values.every((stamp) => stamp <= windowStart)) hits.delete(mapKey);
    }
  }

  return true;
}

/** Test hook: clears all counters. */
export function resetRateLimits(): void {
  hits.clear();
}
