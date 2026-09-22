import { classifyPostalFsa } from "@/lib/early-access/classification";
import {
  EARLY_ACCESS_ERRORS,
  EARLY_ACCESS_SOURCE_PATH,
  MARKETING_CONSENT_PURPOSE,
  PILOT_CONTACT_PURPOSE,
  PRIVACY_POLICY_VERSION,
} from "@/lib/early-access/copy";
import type { ValidatedEarlyAccess } from "@/lib/early-access/validation";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { EarlyAccessRegistrationInsert } from "@/lib/supabase/types";

export type ServiceRoleClient = NonNullable<
  ReturnType<typeof createServiceRoleClient>
>;

export type SubmitEarlyAccessResult =
  | { ok: true }
  | { ok: false; error: string };

type EmailLookup = {
  data: { id: string } | null;
  error: { code?: string; message?: string } | null;
};

function isUniqueViolation(error: { code?: string; message?: string } | null): boolean {
  if (!error) {
    return false;
  }

  return error.code === "23505" || /duplicate key|unique/i.test(error.message ?? "");
}

export function buildEarlyAccessRow(
  value: ValidatedEarlyAccess,
  now: Date = new Date(),
): EarlyAccessRegistrationInsert {
  const classification = classifyPostalFsa(value.postalFsa);
  const timestamp = now.toISOString();

  return {
    first_name: value.firstName,
    email: value.email,
    postal_code: value.postalCode,
    postal_fsa: value.postalFsa,
    service_interests: [...value.serviceInterests],
    service_interest_other: value.serviceInterestOther,
    frequency: value.frequency,
    frequency_other: value.frequencyOther,
    service_area_status: classification.status,
    service_area_community: classification.community,
    pilot_contact_consent: true,
    pilot_contact_consented_at: timestamp,
    pilot_contact_purpose: PILOT_CONTACT_PURPOSE,
    marketing_consent: value.marketingConsent,
    marketing_consented_at: value.marketingConsent ? timestamp : null,
    marketing_consent_purpose: value.marketingConsent
      ? MARKETING_CONSENT_PURPOSE
      : null,
    privacy_policy_version: PRIVACY_POLICY_VERSION,
    source_path: EARLY_ACCESS_SOURCE_PATH,
  };
}

async function selectExistingId(
  client: ServiceRoleClient,
  email: string,
): Promise<EmailLookup> {
  return client
    .from("early_access_registrations")
    .select("id")
    .eq("email", email)
    .maybeSingle();
}

export async function submitEarlyAccessRegistration(
  value: ValidatedEarlyAccess,
  options: {
    client?: ServiceRoleClient | null;
    now?: Date;
  } = {},
): Promise<SubmitEarlyAccessResult> {
  const client =
    options.client === undefined ? createServiceRoleClient() : options.client;

  if (!client) {
    return { ok: false, error: EARLY_ACCESS_ERRORS.unavailable };
  }

  const existing = await selectExistingId(client, value.email);
  if (existing.error) {
    return { ok: false, error: EARLY_ACCESS_ERRORS.unexpected };
  }

  if (existing.data?.id) {
    return { ok: true };
  }

  const row = buildEarlyAccessRow(value, options.now ?? new Date());
  const inserted = await client
    .from("early_access_registrations")
    .insert(row)
    .select("id")
    .single();

  if (!inserted.error && inserted.data?.id) {
    return { ok: true };
  }

  if (isUniqueViolation(inserted.error)) {
    const retry = await selectExistingId(client, value.email);
    if (retry.data?.id) {
      return { ok: true };
    }

    return { ok: false, error: EARLY_ACCESS_ERRORS.unexpected };
  }

  return { ok: false, error: EARLY_ACCESS_ERRORS.unexpected };
}
