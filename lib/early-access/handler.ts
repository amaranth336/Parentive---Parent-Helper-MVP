import { classifyPostalFsa } from "@/lib/early-access/classification";
import { EARLY_ACCESS_ERRORS } from "@/lib/early-access/copy";
import {
  notifyEarlyAccessRegistration,
  type EarlyAccessNotificationRegistration,
  type EarlyAccessNotificationResult,
} from "@/lib/early-access/notify";
import {
  createSlidingWindowLimiter,
  earlyAccessRateLimiter,
  type SlidingWindowRateLimiter,
} from "@/lib/early-access/rate-limit";
import {
  recordEarlyAccessNotification,
  submitEarlyAccessRegistration,
  type RecordEarlyAccessNotificationResult,
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
  notify?: (
    registration: EarlyAccessNotificationRegistration,
  ) => Promise<EarlyAccessNotificationResult>;
  recordNotification?: (
    client: ServiceRoleClient,
    id: string,
    notification: EarlyAccessNotificationResult,
  ) => Promise<RecordEarlyAccessNotificationResult>;
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
  const notify = deps.notify ?? notifyEarlyAccessRegistration;
  const recordNotification =
    deps.recordNotification ?? recordEarlyAccessNotification;

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

    if (!submitted.duplicate) {
      const area = classifyPostalFsa(validated.value.postalFsa);
      let notification: EarlyAccessNotificationResult;
      try {
        notification = await notify({
          id: submitted.id,
          createdAt: submitted.createdAt,
          firstName: validated.value.firstName,
          email: validated.value.email,
          postalCode: validated.value.postalCode,
          serviceAreaStatus: area.status,
          serviceAreaCommunity: area.community,
          serviceInterests: validated.value.serviceInterests,
          serviceInterestOther: validated.value.serviceInterestOther,
          frequency: validated.value.frequency,
          frequencyOther: validated.value.frequencyOther,
          marketingConsent: validated.value.marketingConsent,
        });
      } catch {
        notification = {
          notification_status: "failed",
          notification_error: "resend_request_failed",
          notification_sent_at: null,
        };
      }

      try {
        const recorded = await recordNotification(
          client,
          submitted.id,
          notification,
        );
        if (!recorded.ok) {
          console.error(
            "early-access notification update failed",
            submitted.id,
            notification.notification_status,
          );
        }
      } catch {
        console.error(
          "early-access notification update failed",
          submitted.id,
          notification.notification_status,
        );
      }
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
