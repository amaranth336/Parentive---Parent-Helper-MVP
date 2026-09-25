import { randomUUID } from "node:crypto";
import {
  APPLICATION_CONSENT_PURPOSE,
  DOCUMENT_BUCKET,
  FUTURE_OPPORTUNITIES_CONSENT_PURPOSE,
  HELPERS_ERRORS,
  HELPERS_PRIVACY_POLICY_VERSION,
  HELPERS_SOURCE_PATH,
} from "@/lib/helpers/copy";
import type { ValidatedHelpersApplication } from "@/lib/helpers/validation";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { HelperApplicationInsert } from "@/lib/supabase/types";

export type ServiceRoleClient = NonNullable<
  ReturnType<typeof createServiceRoleClient>
>;

export type SubmitHelpersResult =
  | { ok: true }
  | { ok: false; error: string };

export type HelpersDocumentBytes = {
  bytes: Uint8Array;
  contentType: string;
  originalFilename: string;
  byteSize: number;
  extension: "pdf" | "docx";
};

export function buildHelperApplicationRow(
  value: ValidatedHelpersApplication,
  options: {
    id: string;
    documentStoragePath: string;
    now?: Date;
  },
): HelperApplicationInsert {
  const timestamp = (options.now ?? new Date()).toISOString();

  return {
    id: options.id,
    first_name: value.firstName,
    last_name: value.lastName,
    email: value.email,
    telephone: value.telephone,
    postal_code: value.postalCode,
    postal_fsa: value.postalFsa,
    interest_keys: [...value.interestKeys],
    interested_in_child_support: value.interestedInChildSupport,
    garden_capability: value.gardenCapability,
    experience_text: value.experienceText,
    motivation_text: value.motivationText,
    available_days: [...value.availableDays],
    preferred_time_blocks: [...value.preferredTimeBlocks],
    preferred_weekly_hours: value.preferredWeeklyHours,
    age_18_confirmed: true,
    work_eligible_canada: true,
    has_own_vehicle: true,
    screening_acknowledgement: true,
    document_original_filename: value.documentOriginalFilename,
    document_content_type: value.documentContentType,
    document_byte_size: value.documentByteSize,
    document_storage_path: options.documentStoragePath,
    application_consent: true,
    application_consented_at: timestamp,
    application_consent_purpose: APPLICATION_CONSENT_PURPOSE,
    future_opportunities_consent: value.futureOpportunitiesConsent,
    future_opportunities_consented_at: value.futureOpportunitiesConsent
      ? timestamp
      : null,
    future_opportunities_consent_purpose: value.futureOpportunitiesConsent
      ? FUTURE_OPPORTUNITIES_CONSENT_PURPOSE
      : null,
    privacy_policy_version: HELPERS_PRIVACY_POLICY_VERSION,
    status: "submitted",
    source_path: HELPERS_SOURCE_PATH,
  };
}

function storagePathFor(id: string, extension: "pdf" | "docx"): string {
  return `${id}/experience.${extension}`;
}

function truncateErrorExcerpt(message: string): string {
  return message.slice(0, 160);
}

function recordCleanupFailure(path: string, message: string): void {
  // Path is a generated UUID folder — do not log applicant PII.
  console.error(
    JSON.stringify({
      scope: "helpers.submit",
      event: "storage_cleanup_failed",
      path,
      message: truncateErrorExcerpt(message),
    }),
  );
}

async function recordStorageOrphanEvent(
  client: ServiceRoleClient,
  path: string,
  errorExcerpt: string,
): Promise<void> {
  try {
    const inserted = await client
      .from("helper_application_storage_orphan_events")
      .insert({
        bucket: DOCUMENT_BUCKET,
        storage_path: path,
        reason: "cleanup_failed_after_insert",
        attempt_count: 2,
        error_excerpt: truncateErrorExcerpt(errorExcerpt),
        status: "pending",
      });

    if (inserted.error) {
      console.error(
        JSON.stringify({
          scope: "helpers.submit",
          event: "orphan_event_insert_failed",
          path,
        }),
      );
    }
  } catch {
    console.error(
      JSON.stringify({
        scope: "helpers.submit",
        event: "orphan_event_insert_failed",
        path,
      }),
    );
  }
}

async function deleteStorageObject(
  client: ServiceRoleClient,
  path: string,
): Promise<{ cleaned: boolean; lastMessage: string }> {
  let lastMessage = "unknown cleanup error";

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const removed = await client.storage.from(DOCUMENT_BUCKET).remove([path]);
    if (!removed.error) {
      return { cleaned: true, lastMessage: "" };
    }

    lastMessage = removed.error.message || lastMessage;
  }

  recordCleanupFailure(path, lastMessage);
  return { cleaned: false, lastMessage };
}

export async function submitHelperApplication(
  value: ValidatedHelpersApplication,
  document: HelpersDocumentBytes,
  options: {
    client?: ServiceRoleClient | null;
    now?: Date;
    id?: string;
  } = {},
): Promise<SubmitHelpersResult> {
  const client =
    options.client === undefined ? createServiceRoleClient() : options.client;

  if (!client) {
    return { ok: false, error: HELPERS_ERRORS.unavailable };
  }

  const id = options.id ?? randomUUID();
  const documentStoragePath = storagePathFor(id, document.extension);

  const uploaded = await client.storage
    .from(DOCUMENT_BUCKET)
    .upload(documentStoragePath, document.bytes, {
      contentType: document.contentType,
      upsert: false,
    });

  if (uploaded.error) {
    return { ok: false, error: HELPERS_ERRORS.unexpected };
  }

  const row = buildHelperApplicationRow(value, {
    id,
    documentStoragePath,
    now: options.now,
  });

  const inserted = await client
    .from("helper_applications")
    .insert(row)
    .select("id")
    .single();

  if (!inserted.error && inserted.data?.id) {
    return { ok: true };
  }

  const cleanup = await deleteStorageObject(client, documentStoragePath);
  if (!cleanup.cleaned) {
    await recordStorageOrphanEvent(
      client,
      documentStoragePath,
      cleanup.lastMessage,
    );
  }

  // Never treat a failed insert as success, even if cleanup/orphan logging fails.
  return { ok: false, error: HELPERS_ERRORS.unexpected };
}
