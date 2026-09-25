/**
 * Durable helper-application rate limiting via Supabase RPC.
 *
 * RPC polarity (must match migration):
 *   check_helper_application_rate_limit → true  = LIMITED (deny)
 *                                       → false = ALLOWED
 *
 * Fail-closed: missing service-role client or RPC errors return
 * `{ unavailable: true }` unless both local-dev gates are set:
 *   NODE_ENV === "development"
 *   HELPERS_ALLOW_MEMORY_RATE_LIMIT === "1"
 *
 * Memory fallback is intentionally unavailable in production/test by default.
 */

import {
  HELPERS_RATE_LIMIT_MAX_REQUESTS,
  HELPERS_RATE_LIMIT_WINDOW_MS,
} from "@/lib/helpers/copy";
import { createSlidingWindowLimiter } from "@/lib/early-access/rate-limit";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { ServiceRoleClient } from "@/lib/helpers/submit";

export type SlidingWindowRateLimiter = {
  isLimited: (key: string, now?: number) => boolean | Promise<boolean>;
};

/**
 * Rich rate-limit outcome for the helpers POST path.
 * - `{ limited: true }` → 429
 * - `{ limited: false }` → allow
 * - `{ unavailable: true }` → 503 (fail closed)
 */
export type HelpersRateLimitResult =
  | { limited: boolean; unavailable?: never }
  | { unavailable: true; limited?: never };

export type HelpersRateLimitOptions = {
  maxRequests?: number;
  windowMs?: number;
  getClient?: () => ServiceRoleClient | null;
  memoryFallback?: SlidingWindowRateLimiter;
  now?: number;
};

function normalizeRateKey(key: string): string {
  const trimmed = (key || "unknown").trim() || "unknown";
  return trimmed.slice(0, 200);
}

export function isHelpersMemoryRateLimitAllowed(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return (
    env.NODE_ENV === "development" &&
    env.HELPERS_ALLOW_MEMORY_RATE_LIMIT === "1"
  );
}

function memoryLimited(
  rateKey: string,
  options: HelpersRateLimitOptions,
): HelpersRateLimitResult {
  const maxRequests = options.maxRequests ?? HELPERS_RATE_LIMIT_MAX_REQUESTS;
  const windowMs = options.windowMs ?? HELPERS_RATE_LIMIT_WINDOW_MS;
  const memoryFallback =
    options.memoryFallback ??
    createSlidingWindowLimiter({ maxRequests, windowMs });
  return { limited: Boolean(memoryFallback.isLimited(rateKey, options.now)) };
}

/**
 * Check whether a helpers POST should be denied for this rate key.
 * Prefer calling this once from the API route (before buffering the body).
 */
export async function checkHelpersApplicationRateLimit(
  key: string,
  options: HelpersRateLimitOptions = {},
): Promise<HelpersRateLimitResult> {
  const rateKey = normalizeRateKey(key);
  const maxRequests = options.maxRequests ?? HELPERS_RATE_LIMIT_MAX_REQUESTS;
  const windowMs = options.windowMs ?? HELPERS_RATE_LIMIT_WINDOW_MS;
  const getClient = options.getClient ?? createServiceRoleClient;
  const client = getClient();

  if (!client) {
    if (isHelpersMemoryRateLimitAllowed()) {
      return memoryLimited(rateKey, options);
    }
    return { unavailable: true };
  }

  try {
    const { data, error } = await client.rpc(
      "check_helper_application_rate_limit",
      {
        p_rate_key: rateKey,
        p_max_requests: maxRequests,
        p_window_ms: windowMs,
      },
    );

    if (error || typeof data !== "boolean") {
      if (isHelpersMemoryRateLimitAllowed()) {
        return memoryLimited(rateKey, options);
      }
      return { unavailable: true };
    }

    // true from RPC = LIMITED
    return { limited: data };
  } catch {
    if (isHelpersMemoryRateLimitAllowed()) {
      return memoryLimited(rateKey, options);
    }
    return { unavailable: true };
  }
}

/**
 * Factory used by isolated handler tests (boolean sliding-window limiter).
 * Production route uses checkHelpersApplicationRateLimit instead.
 */
export function createSlidingWindowHelpersLimiter(options?: {
  maxRequests?: number;
  windowMs?: number;
}): SlidingWindowRateLimiter {
  return createSlidingWindowLimiter({
    maxRequests: options?.maxRequests ?? HELPERS_RATE_LIMIT_MAX_REQUESTS,
    windowMs: options?.windowMs ?? HELPERS_RATE_LIMIT_WINDOW_MS,
  });
}

/**
 * @deprecated Prefer checkHelpersApplicationRateLimit. Kept for test helpers
 * that need a SlidingWindowRateLimiter-shaped adapter around the RPC.
 */
export function createHelpersRateLimiter(options?: HelpersRateLimitOptions): {
  isLimited: (key: string, now?: number) => Promise<boolean>;
  check: (key: string, now?: number) => Promise<HelpersRateLimitResult>;
} {
  return {
    async check(key: string, now?: number): Promise<HelpersRateLimitResult> {
      return checkHelpersApplicationRateLimit(key, { ...options, now });
    },
    async isLimited(key: string, now?: number): Promise<boolean> {
      const result = await checkHelpersApplicationRateLimit(key, {
        ...options,
        now,
      });
      if ("unavailable" in result && result.unavailable) {
        // Adapter callers historically treated errors as limited when fail-closed.
        return true;
      }
      return result.limited;
    },
  };
}

export const helpersRateLimiter = {
  check: (key: string, now?: number) =>
    checkHelpersApplicationRateLimit(key, { now }),
};

export { createSlidingWindowLimiter };
