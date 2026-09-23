import { createSlidingWindowLimiter } from "@/lib/early-access/rate-limit";

/**
 * In-memory sliding-window limiter for helper-application POSTs.
 *
 * Default: 3 requests / 10 minutes / key (typically client IP).
 * Separate bucket from early-access; not shared across isolates.
 */
export const helpersRateLimiter = createSlidingWindowLimiter({
  maxRequests: 3,
  windowMs: 10 * 60 * 1000,
});

export { createSlidingWindowLimiter };
export type { SlidingWindowRateLimiter } from "@/lib/early-access/rate-limit";
