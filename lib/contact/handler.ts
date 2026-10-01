import { CONTACT_ERRORS } from "@/lib/contact/copy";
import {
  notifyContactInquiry,
  type ContactNotificationInquiry,
  type ContactNotificationResult,
} from "@/lib/contact/notify";
import type { ContactApiResponse } from "@/lib/contact/response";
import {
  recordContactNotification,
  submitContactInquiry,
  type RecordContactNotificationResult,
  type ServiceRoleClient,
  type SubmitContactResult,
} from "@/lib/contact/submit";
import {
  isContactHoneypotTripped,
  validateContactInput,
  type ValidatedContact,
} from "@/lib/contact/validation";
import {
  createSlidingWindowLimiter,
  type SlidingWindowRateLimiter,
} from "@/lib/early-access/rate-limit";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export type ContactHandlerResult = {
  status: number;
  body: ContactApiResponse;
};

export type ContactHandlerDeps = {
  /**
   * Optional limiter for isolated tests.
   * The production route owns rate limiting via contactRateLimiter so a
   * request is not counted twice.
   */
  limiter?: SlidingWindowRateLimiter;
  getAdminClient?: () => ServiceRoleClient | null;
  submit?: (
    value: ValidatedContact,
    options?: { client?: ServiceRoleClient | null },
  ) => Promise<SubmitContactResult>;
  notify?: (
    inquiry: ContactNotificationInquiry,
  ) => Promise<ContactNotificationResult>;
  recordNotification?: (
    client: ServiceRoleClient,
    id: string,
    notification: ContactNotificationResult,
  ) => Promise<RecordContactNotificationResult>;
};

/**
 * Contact-only in-memory window. Do not reuse earlyAccessRateLimiter.
 * Default from createSlidingWindowLimiter: 5 requests / 10 minutes / key.
 */
export const contactRateLimiter = createSlidingWindowLimiter();

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function createContactHandler(deps: ContactHandlerDeps = {}) {
  const limiter = deps.limiter;
  const getAdminClient = deps.getAdminClient ?? createServiceRoleClient;
  const submit = deps.submit ?? submitContactInquiry;
  const notify = deps.notify ?? notifyContactInquiry;
  const recordNotification =
    deps.recordNotification ?? recordContactNotification;

  return async function handleContactSubmission(
    rawBody: unknown,
    context: { ip: string },
  ): Promise<ContactHandlerResult> {
    if (limiter?.isLimited(context.ip || "unknown")) {
      return {
        status: 429,
        body: { ok: false, error: CONTACT_ERRORS.rateLimit },
      };
    }

    if (!isPlainObject(rawBody)) {
      return {
        status: 400,
        body: { ok: false, error: CONTACT_ERRORS.validation },
      };
    }

    if (isContactHoneypotTripped(rawBody)) {
      return {
        status: 400,
        body: { ok: false, error: CONTACT_ERRORS.validation },
      };
    }

    const validated = validateContactInput(rawBody);
    if (!validated.ok) {
      return {
        status: 400,
        body: {
          ok: false,
          error: CONTACT_ERRORS.validation,
          fieldErrors: validated.fieldErrors,
        },
      };
    }

    const client = getAdminClient();
    if (!client) {
      return {
        status: 503,
        body: { ok: false, error: CONTACT_ERRORS.unavailable },
      };
    }

    let stored: SubmitContactResult;
    try {
      stored = await submit(validated.value, { client });
    } catch {
      console.error("contact inquiry insert failed");
      return {
        status: 500,
        body: { ok: false, error: CONTACT_ERRORS.unexpected },
      };
    }

    if (!stored.ok) {
      return {
        status: 500,
        body: { ok: false, error: CONTACT_ERRORS.unexpected },
      };
    }

    let notification: ContactNotificationResult;
    try {
      notification = await notify({
        id: stored.id,
        createdAt: stored.createdAt,
        name: validated.value.name,
        email: validated.value.email,
        phone: validated.value.phone,
        message: validated.value.message,
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
        stored.id,
        notification,
      );
      if (!recorded.ok) {
        console.error(
          "contact notification update failed",
          stored.id,
          notification.notification_status,
        );
      }
    } catch {
      console.error(
        "contact notification update failed",
        stored.id,
        notification.notification_status,
      );
    }

    return { status: 200, body: { ok: true } };
  };
}

/** Production route path: no limiter (route owns rate limiting). */
export const handleContactSubmission = createContactHandler();

/** Unit-test helper: attaches an in-memory limiter by default. */
export function createIsolatedContactHandler(
  deps: Omit<ContactHandlerDeps, "limiter"> & {
    limiter?: SlidingWindowRateLimiter;
  } = {},
) {
  return createContactHandler({
    ...deps,
    limiter: deps.limiter ?? createSlidingWindowLimiter(),
  });
}
