import { VISIT_ERRORS } from "@/lib/our-support/copy";
import {
  notifyVisitRequest,
  type VisitNotificationRequest,
  type VisitNotificationResult,
} from "@/lib/our-support/notify";
import type { VisitRequestApiResponse } from "@/lib/our-support/response";
import {
  recordVisitNotification,
  submitVisitRequest,
  type RecordVisitNotificationResult,
  type ServiceRoleClient,
  type SubmitVisitRequestResult,
} from "@/lib/our-support/submit";
import {
  isVisitHoneypotTripped,
  validateVisitRequestInput,
  type ValidatedVisitRequest,
} from "@/lib/our-support/validation";
import {
  createSlidingWindowLimiter,
  type SlidingWindowRateLimiter,
} from "@/lib/early-access/rate-limit";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export type VisitHandlerResult = {
  status: number;
  body: VisitRequestApiResponse;
};

export type VisitHandlerDeps = {
  limiter?: SlidingWindowRateLimiter;
  getAdminClient?: () => ServiceRoleClient | null;
  submit?: (
    value: ValidatedVisitRequest,
    options?: { client?: ServiceRoleClient | null },
  ) => Promise<SubmitVisitRequestResult>;
  notify?: (
    notice: VisitNotificationRequest,
  ) => Promise<VisitNotificationResult>;
  recordNotification?: (
    client: ServiceRoleClient,
    id: string,
    notification: VisitNotificationResult,
  ) => Promise<RecordVisitNotificationResult>;
};

/**
 * Visit-request-only in-memory window. Do not reuse other form limiters.
 * Default: 5 requests / 10 minutes / key.
 */
export const visitRequestRateLimiter = createSlidingWindowLimiter();

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function createVisitRequestHandler(deps: VisitHandlerDeps = {}) {
  const limiter = deps.limiter;
  const getAdminClient = deps.getAdminClient ?? createServiceRoleClient;
  const submit = deps.submit ?? submitVisitRequest;
  const notify = deps.notify ?? notifyVisitRequest;
  const recordNotification = deps.recordNotification ?? recordVisitNotification;

  return async function handleVisitRequest(
    rawBody: unknown,
    context: { ip: string },
  ): Promise<VisitHandlerResult> {
    if (limiter?.isLimited(context.ip || "unknown")) {
      return {
        status: 429,
        body: { ok: false, error: VISIT_ERRORS.rateLimit },
      };
    }

    if (!isPlainObject(rawBody)) {
      return {
        status: 400,
        body: { ok: false, error: VISIT_ERRORS.validation },
      };
    }

    if (isVisitHoneypotTripped(rawBody)) {
      return {
        status: 400,
        body: { ok: false, error: VISIT_ERRORS.validation },
      };
    }

    const validated = validateVisitRequestInput(rawBody);
    if (!validated.ok) {
      return {
        status: 400,
        body: {
          ok: false,
          error: VISIT_ERRORS.validation,
          fieldErrors: validated.fieldErrors,
        },
      };
    }

    const client = getAdminClient();
    if (!client) {
      return {
        status: 503,
        body: { ok: false, error: VISIT_ERRORS.unavailable },
      };
    }

    let stored: SubmitVisitRequestResult;
    try {
      stored = await submit(validated.value, { client });
    } catch {
      console.error("pilot visit request insert failed");
      return {
        status: 500,
        body: { ok: false, error: VISIT_ERRORS.unexpected },
      };
    }

    if (!stored.ok) {
      return {
        status: 500,
        body: { ok: false, error: VISIT_ERRORS.unexpected },
      };
    }

    let notification: VisitNotificationResult;
    try {
      notification = await notify({
        id: stored.id,
        createdAt: stored.createdAt,
        request: validated.value,
      });
    } catch {
      notification = {
        notification_status: "failed",
        notification_error: "resend_request_failed",
        notification_sent_at: null,
      };
    }

    try {
      const recorded = await recordNotification(client, stored.id, notification);
      if (!recorded.ok) {
        console.error(
          "pilot visit notification update failed",
          stored.id,
          notification.notification_status,
        );
      }
    } catch {
      console.error(
        "pilot visit notification update failed",
        stored.id,
        notification.notification_status,
      );
    }

    return { status: 200, body: { ok: true } };
  };
}

export const handleVisitRequest = createVisitRequestHandler();

export function createIsolatedVisitRequestHandler(
  deps: Omit<VisitHandlerDeps, "limiter"> & {
    limiter?: SlidingWindowRateLimiter;
  } = {},
) {
  return createVisitRequestHandler({
    ...deps,
    limiter: deps.limiter ?? createSlidingWindowLimiter(),
  });
}
