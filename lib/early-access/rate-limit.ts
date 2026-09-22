/**
 * In-memory sliding-window limiter for early-access POSTs.
 *
 * Default: 5 requests / 10 minutes / key (typically client IP).
 * This is per Node isolate only. It is not a durable anti-abuse fabric
 * and will not be shared across Vercel instances or survive restarts.
 */

export type SlidingWindowRateLimiter = {
  isLimited: (key: string, now?: number) => boolean;
};

export function createSlidingWindowLimiter(options?: {
  maxRequests?: number;
  windowMs?: number;
}): SlidingWindowRateLimiter {
  const maxRequests = options?.maxRequests ?? 5;
  const windowMs = options?.windowMs ?? 10 * 60 * 1000;
  const hits = new Map<string, number[]>();

  return {
    isLimited(key: string, now = Date.now()): boolean {
      const windowStart = now - windowMs;
      const recent = (hits.get(key) ?? []).filter((stamp) => stamp > windowStart);

      if (recent.length >= maxRequests) {
        hits.set(key, recent);
        return true;
      }

      recent.push(now);
      hits.set(key, recent);
      return false;
    },
  };
}

export const earlyAccessRateLimiter = createSlidingWindowLimiter();
