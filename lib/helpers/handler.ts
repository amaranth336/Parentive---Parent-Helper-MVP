import { HELPERS_ERRORS } from "@/lib/helpers/copy";
import {
  validateHelperDocument,
  type DocumentValidationResult,
} from "@/lib/helpers/document";
import {
  createSlidingWindowLimiter,
  helpersRateLimiter,
  type SlidingWindowRateLimiter,
} from "@/lib/helpers/rate-limit";
import type { HelpersApiResponse } from "@/lib/helpers/response";
import {
  submitHelperApplication,
  type HelpersDocumentBytes,
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
  const limiter = deps.limiter ?? helpersRateLimiter;
  const getAdminClient = deps.getAdminClient ?? createServiceRoleClient;
  const submit = deps.submit ?? submitHelperApplication;
  const validateDocument = deps.validateDocument ?? validateHelperDocument;

  return async function handleHelpersSubmission(
    formData: FormData,
    context: { ip: string },
  ): Promise<HelpersHandlerResult> {
    if (limiter.isLimited(context.ip || "unknown")) {
      return {
        status: 429,
        body: { ok: false, error: HELPERS_ERRORS.rateLimit },
      };
    }

    const { fields, file } = parseHelpersFormData(formData);
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

    const submitted = await submit(
      {
        ...validated.value,
        documentOriginalFilename: documentResult.filename,
        documentContentType: documentResult.contentType,
        documentByteSize: documentResult.byteSize,
      },
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

    return { status: 200, body: { ok: true } };
  };
}

export const handleHelpersSubmission = createHelpersHandler();

export function createIsolatedHelpersHandler(
  deps: Omit<HelpersHandlerDeps, "limiter"> & {
    limiter?: SlidingWindowRateLimiter;
  } = {},
) {
  return createHelpersHandler({
    ...deps,
    limiter: deps.limiter ?? createSlidingWindowLimiter({ maxRequests: 3 }),
  });
}
