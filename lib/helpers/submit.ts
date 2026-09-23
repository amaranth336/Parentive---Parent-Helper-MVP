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

async function deleteStorageObject(
  client: ServiceRoleClient,
  path: string,
): Promise<void> {
  await client.storage.from(DOCUMENT_BUCKET).remove([path]);
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

  await deleteStorageObject(client, documentStoragePath);
  return { ok: false, error: HELPERS_ERRORS.unexpected };
}
