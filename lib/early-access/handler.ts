import { EARLY_ACCESS_ERRORS } from "@/lib/early-access/copy";
import {
  createSlidingWindowLimiter,
  earlyAccessRateLimiter,
  type SlidingWindowRateLimiter,
} from "@/lib/early-access/rate-limit";
import {
  submitEarlyAccessRegistration,
  type ServiceRoleClient,
  type SubmitEarlyAccessResult,
} from "@/lib/early-access/submit";
import { validateEarlyAccessInput } from "@/lib/early-access/validation";
import type { EarlyAccessApiResponse } from "@/lib/early-access/response";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export type {
  EarlyAccessApiError,
  EarlyAccessApiResponse,
  EarlyAccessApiSuccess,
} from "@/lib/early-access/response";
export { isVerifiedEarlyAccessSuccess } from "@/lib/early-access/response";

export type EarlyAccessHandlerResult = {
  status: number;
  body: EarlyAccessApiResponse;
};

export type EarlyAccessHandlerDeps = {
  limiter?: SlidingWindowRateLimiter;
  getAdminClient?: () => ServiceRoleClient | null;
  submit?: (
    value: Parameters<typeof submitEarlyAccessRegistration>[0],
    options?: Parameters<typeof submitEarlyAccessRegistration>[1],
  ) => Promise<SubmitEarlyAccessResult>;
};

export function createEarlyAccessHandler(
  deps: EarlyAccessHandlerDeps = {},
): (
  rawBody: unknown,
  context: { ip: string },
) => Promise<EarlyAccessHandlerResult> {
  const limiter = deps.limiter ?? earlyAccessRateLimiter;
  const getAdminClient = deps.getAdminClient ?? createServiceRoleClient;
  const submit = deps.submit ?? submitEarlyAccessRegistration;

  return async function handleEarlyAccessSubmission(
    rawBody: unknown,
    context: { ip: string },
  ): Promise<EarlyAccessHandlerResult> {
    if (limiter.isLimited(context.ip || "unknown")) {
      return {
        status: 429,
        body: { ok: false, error: EARLY_ACCESS_ERRORS.rateLimit },
      };
    }

    const validated = validateEarlyAccessInput(rawBody);
    if (!validated.ok) {
      return {
        status: 400,
        body: {
          ok: false,
          error: EARLY_ACCESS_ERRORS.validation,
          fieldErrors: validated.fieldErrors,
        },
      };
    }

    const client = getAdminClient();
    if (!client) {
      return {
        status: 503,
        body: { ok: false, error: EARLY_ACCESS_ERRORS.unavailable },
      };
    }

    const submitted = await submit(validated.value, { client });
    if (!submitted.ok) {
      return {
        status: 500,
        body: { ok: false, error: EARLY_ACCESS_ERRORS.unexpected },
      };
    }

    return { status: 200, body: { ok: true } };
  };
}

export const handleEarlyAccessSubmission = createEarlyAccessHandler();

export function createIsolatedEarlyAccessHandler(
  deps: Omit<EarlyAccessHandlerDeps, "limiter"> & {
    limiter?: SlidingWindowRateLimiter;
  } = {},
) {
  return createEarlyAccessHandler({
    ...deps,
    limiter: deps.limiter ?? createSlidingWindowLimiter(),
  });
}
