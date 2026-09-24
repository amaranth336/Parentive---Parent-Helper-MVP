import {
  HELPERS_RATE_LIMIT_MAX_REQUESTS,
  HELPERS_RATE_LIMIT_WINDOW_MS,
} from "@/lib/helpers/copy";
import { createSlidingWindowLimiter } from "@/lib/early-access/rate-limit";
import type { ServiceRoleClient } from "@/lib/helpers/submit";

export type SlidingWindowRateLimiter = {
  isLimited: (key: string, now?: number) => boolean | Promise<boolean>;
};

type RateLimitRow = {
  rate_key: string;
  window_started_at: string;
  hit_count: number;
};

/**
 * Durable helper-application rate limiting.
 *
 * Uses a service-role Supabase table shared across instances when a client is
 * available. Falls back to an in-memory limiter only when persistence is
 * unavailable (misconfiguration / local without credentials).
 *
 * Pair with resolveClientIp() so keys are not taken from spoofable XFF heads.
 */
export function createHelpersRateLimiter(options?: {
  maxRequests?: number;
  windowMs?: number;
  getClient?: () => ServiceRoleClient | null;
  memoryFallback?: SlidingWindowRateLimiter;
}): SlidingWindowRateLimiter {
  const maxRequests = options?.maxRequests ?? HELPERS_RATE_LIMIT_MAX_REQUESTS;
  const windowMs = options?.windowMs ?? HELPERS_RATE_LIMIT_WINDOW_MS;
  const memoryFallback =
    options?.memoryFallback ??
    createSlidingWindowLimiter({ maxRequests, windowMs });

  return {
    async isLimited(key: string, now = Date.now()): Promise<boolean> {
      const rateKey = (key || "unknown").slice(0, 200);
      const client = options?.getClient?.() ?? null;

      if (!client) {
        return memoryFallback.isLimited(rateKey, now);
      }

      try {
        const existing = await client
          .from("helper_application_rate_limits")
          .select("rate_key,window_started_at,hit_count")
          .eq("rate_key", rateKey)
          .maybeSingle();

        if (existing.error) {
          return memoryFallback.isLimited(rateKey, now);
        }

        const row = existing.data as RateLimitRow | null;
        const windowStarted = row
          ? Date.parse(row.window_started_at)
          : Number.NaN;
        const windowFresh =
          !row ||
          !Number.isFinite(windowStarted) ||
          now - windowStarted >= windowMs;

        if (windowFresh) {
          const written = await client.from("helper_application_rate_limits").upsert(
            {
              rate_key: rateKey,
              window_started_at: new Date(now).toISOString(),
              hit_count: 1,
              updated_at: new Date(now).toISOString(),
            },
            { onConflict: "rate_key" },
          );

          if (written.error) {
            return memoryFallback.isLimited(rateKey, now);
          }

          return false;
        }

        if (row.hit_count >= maxRequests) {
          return true;
        }

        const updated = await client
          .from("helper_application_rate_limits")
          .update({
            hit_count: row.hit_count + 1,
            updated_at: new Date(now).toISOString(),
          })
          .eq("rate_key", rateKey)
          .eq("hit_count", row.hit_count);

        if (updated.error) {
          return memoryFallback.isLimited(rateKey, now);
        }

        return false;
      } catch {
        return memoryFallback.isLimited(rateKey, now);
      }
    },
  };
}

export const helpersRateLimiter = createHelpersRateLimiter();

export function createSlidingWindowHelpersLimiter(options?: {
  maxRequests?: number;
  windowMs?: number;
}): SlidingWindowRateLimiter {
  return createSlidingWindowLimiter({
    maxRequests: options?.maxRequests ?? HELPERS_RATE_LIMIT_MAX_REQUESTS,
    windowMs: options?.windowMs ?? HELPERS_RATE_LIMIT_WINDOW_MS,
  });
}

export { createSlidingWindowLimiter };
