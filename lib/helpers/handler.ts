import { HELPERS_ERRORS, MAX_DOCUMENT_BYTES } from "@/lib/helpers/copy";
import {
  notifyHelperApplication,
  type HelperNotificationApplication,
  type HelperNotificationResult,
} from "@/lib/helpers/notify";
import {
  validateHelperDocument,
  type DocumentValidationResult,
} from "@/lib/helpers/document";
import {
  createSlidingWindowHelpersLimiter,
  type SlidingWindowRateLimiter,
} from "@/lib/helpers/rate-limit";
import type { HelpersApiResponse } from "@/lib/helpers/response";
import {
  recordHelperNotification,
  submitHelperApplication,
  type HelpersDocumentBytes,
  type RecordHelperNotificationResult,
  type ServiceRoleClient,
  type SubmitHelpersResult,
} from "@/lib/helpers/submit";
import {
  validateHelpersInput,
  type ValidatedHelpersApplication,
} from "@/lib/helpers/validation";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export type {
  HelpersApiError,
  HelpersApiResponse,
  HelpersApiSuccess,
} from "@/lib/helpers/response";
export { isVerifiedHelpersSuccess } from "@/lib/helpers/response";

export type HelpersHandlerResult = {
  status: number;
  body: HelpersApiResponse;
};

export type HelpersHandlerDeps = {
  /**
   * Optional limiter for isolated/unit tests.
   * Production route owns rate limiting and uses handleHelpersSubmission
   * without a limiter to avoid double-counting.
   */
  limiter?: SlidingWindowRateLimiter;
  getAdminClient?: () => ServiceRoleClient | null;
  submit?: (
    value: ValidatedHelpersApplication,
    document: HelpersDocumentBytes,
    options?: {
      client?: ServiceRoleClient | null;
      now?: Date;
      id?: string;
    },
  ) => Promise<SubmitHelpersResult>;
  validateDocument?: (input: {
    filename?: string | null;
    contentType?: string | null;
    byteSize?: number | null;
    bytes?: Uint8Array | null;
  }) => DocumentValidationResult;
  notify?: (
    application: HelperNotificationApplication,
  ) => Promise<HelperNotificationResult>;
  recordNotification?: (
    client: ServiceRoleClient,
    id: string,
    notification: HelperNotificationResult,
  ) => Promise<RecordHelperNotificationResult>;
};

function readFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function readFormStrings(formData: FormData, key: string): string[] {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string");
}

function readFormBoolean(formData: FormData, key: string): boolean {
  const value = formData.get(key);
  return value === "true" || value === "on" || value === "1";
}

function inferDocumentContentType(
  filename: string,
  browserType: string,
): string {
  if (browserType.trim()) {
    return browserType.trim();
  }

  const lower = filename.toLowerCase();
  if (lower.endsWith(".pdf")) {
    return "application/pdf";
  }
  if (lower.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  return "";
}

export function parseHelpersFormData(formData: FormData): {
  fields: Record<string, unknown>;
  file: File | null;
} {
  const fileValue = formData.get("document");
  const file = fileValue instanceof File ? fileValue : null;
  const filename = file?.name ?? "";

  return {
    fields: {
      firstName: readFormString(formData, "firstName"),
      lastName: readFormString(formData, "lastName"),
      email: readFormString(formData, "email"),
      telephone: readFormString(formData, "telephone"),
      postalCode: readFormString(formData, "postalCode"),
      interestKeys: readFormStrings(formData, "interestKeys"),
      experienceText: readFormString(formData, "experienceText"),
      motivationText: readFormString(formData, "motivationText"),
      availableDays: readFormStrings(formData, "availableDays"),
      preferredTimeBlocks: readFormStrings(formData, "preferredTimeBlocks"),
      preferredWeeklyHours: readFormString(formData, "preferredWeeklyHours"),
      age18Confirmed: readFormBoolean(formData, "age18Confirmed"),
      workEligibleCanada: readFormBoolean(formData, "workEligibleCanada"),
      hasOwnVehicle: readFormBoolean(formData, "hasOwnVehicle"),
      screeningAcknowledgement: readFormBoolean(
        formData,
        "screeningAcknowledgement",
      ),
      applicationConsent: readFormBoolean(formData, "applicationConsent"),
      futureOpportunitiesConsent: readFormBoolean(
        formData,
        "futureOpportunitiesConsent",
      ),
      documentOriginalFilename: filename,
      documentContentType: inferDocumentContentType(filename, file?.type ?? ""),
      documentByteSize: file?.size ?? 0,
    },
    file,
  };
}

export function createHelpersHandler(
  deps: HelpersHandlerDeps = {},
): (
  formData: FormData,
  context: { ip: string },
) => Promise<HelpersHandlerResult> {
  const getAdminClient = deps.getAdminClient ?? createServiceRoleClient;
  const limiter = deps.limiter;
  const submit = deps.submit ?? submitHelperApplication;
  const validateDocument = deps.validateDocument ?? validateHelperDocument;
  const notify = deps.notify ?? notifyHelperApplication;
  const recordNotification = deps.recordNotification ?? recordHelperNotification;

  return async function handleHelpersSubmission(
    formData: FormData,
    context: { ip: string },
  ): Promise<HelpersHandlerResult> {
    if (limiter && (await limiter.isLimited(context.ip || "unknown"))) {
      return {
        status: 429,
        body: { ok: false, error: HELPERS_ERRORS.rateLimit },
      };
    }

    const { fields, file } = parseHelpersFormData(formData);

    if (file && file.size > MAX_DOCUMENT_BYTES) {
      return {
        status: 400,
        body: {
          ok: false,
          error: HELPERS_ERRORS.validation,
          fieldErrors: {
            document: "Documents must be 5 MB or smaller.",
          },
        },
      };
    }

    const validated = validateHelpersInput(fields);
    if (!validated.ok) {
      return {
        status: 400,
        body: {
          ok: false,
          error: HELPERS_ERRORS.validation,
          fieldErrors: validated.fieldErrors,
        },
      };
    }

    const bytes = file
      ? new Uint8Array(await file.arrayBuffer())
      : new Uint8Array();

    const documentResult = validateDocument({
      filename: file?.name ?? validated.value.documentOriginalFilename,
      contentType: validated.value.documentContentType,
      byteSize: file?.size ?? validated.value.documentByteSize,
      bytes,
    });

    if (!documentResult.ok) {
      return {
        status: 400,
        body: {
          ok: false,
          error: HELPERS_ERRORS.validation,
          fieldErrors: { document: documentResult.error },
        },
      };
    }

    const client = getAdminClient();
    if (!client) {
      return {
        status: 503,
        body: { ok: false, error: HELPERS_ERRORS.unavailable },
      };
    }

    const application = {
      ...validated.value,
      documentOriginalFilename: documentResult.filename,
      documentContentType: documentResult.contentType,
      documentByteSize: documentResult.byteSize,
    };
    const submitted = await submit(
      application,
      {
        bytes,
        contentType: documentResult.contentType,
        originalFilename: documentResult.filename,
        byteSize: documentResult.byteSize,
        extension: documentResult.extension,
      },
      { client },
    );

    if (!submitted.ok) {
      return {
        status: 500,
        body: { ok: false, error: HELPERS_ERRORS.unexpected },
      };
    }

    let notification: HelperNotificationResult;
    try {
      notification = await notify({
        id: submitted.id,
        createdAt: submitted.createdAt,
        firstName: application.firstName,
        lastName: application.lastName,
        email: application.email,
        telephone: application.telephone,
        postalCode: application.postalCode,
        interestKeys: application.interestKeys,
        interestedInChildSupport: application.interestedInChildSupport,
        gardenCapability: application.gardenCapability,
        experienceText: application.experienceText,
        motivationText: application.motivationText,
        availableDays: application.availableDays,
        preferredTimeBlocks: application.preferredTimeBlocks,
        preferredWeeklyHours: application.preferredWeeklyHours,
        documentOriginalFilename: application.documentOriginalFilename,
        futureOpportunitiesConsent: application.futureOpportunitiesConsent,
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
          "helper notification update failed",
          submitted.id,
          notification.notification_status,
        );
      }
    } catch {
      console.error(
        "helper notification update failed",
        submitted.id,
        notification.notification_status,
      );
    }

    return { status: 200, body: { ok: true } };
  };
}

/** Production route path: no limiter (route owns rate limiting). */
export const handleHelpersSubmission = createHelpersHandler();

/** Unit-test helper: attaches an in-memory limiter by default. */
export function createIsolatedHelpersHandler(
  deps: Omit<HelpersHandlerDeps, "limiter"> & {
    limiter?: SlidingWindowRateLimiter;
  } = {},
) {
  return createHelpersHandler({
    ...deps,
    limiter: deps.limiter ?? createSlidingWindowHelpersLimiter(),
  });
}
