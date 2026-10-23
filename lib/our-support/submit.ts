import { notificationStatusPatch } from "@/lib/email/admin-notification";
import type { VisitNotificationResult } from "@/lib/our-support/notify";
import {
  REQUEST_CONTACT_PURPOSE,
  REQUEST_PRIVACY_POLICY_VERSION,
  REQUEST_SOURCE_PATH,
} from "@/lib/our-support/copy";
import type { ValidatedVisitRequest } from "@/lib/our-support/validation";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/types";

export type ServiceRoleClient = NonNullable<
  ReturnType<typeof createServiceRoleClient>
>;

export type SubmitVisitRequestResult =
  | { ok: true; id: string; createdAt: string }
  | { ok: false };

export type RecordVisitNotificationResult = { ok: true } | { ok: false };

type InsertedRequest = {
  id?: string;
  created_at?: string;
};

export async function submitVisitRequest(
  value: ValidatedVisitRequest,
  options: {
    client?: ServiceRoleClient | null;
  } = {},
): Promise<SubmitVisitRequestResult> {
  const client =
    options.client === undefined ? createServiceRoleClient() : options.client;

  if (!client) {
    return { ok: false };
  }

  const serviceLines: Json = value.lines.map((line) => ({
    id: line.id,
    name: line.name,
    price_cents: line.priceCents,
  }));

  const inserted = await client
    .from("pilot_visit_requests")
    .insert({
      name: value.name,
      email: value.email,
      postal_code: value.postalCode,
      postal_fsa: value.postalFsa,
      preferred_times: value.preferredTimes,
      helper_notes: value.helperNotes,
      visit_type: value.visitType,
      recurring_preferences: value.recurringPreferences,
      service_ids: value.serviceIds,
      service_lines: serviceLines,
      subtotal_cents: value.subtotalCents,
      quote_required: value.quoteRequired,
      flexible_description: value.flexibleDescription,
      minimum_cents: value.minimumCents,
      fixed_below_minimum: value.fixedBelowMinimum,
      currency: "CAD",
      marketing_consent: false,
      request_contact_purpose: REQUEST_CONTACT_PURPOSE,
      privacy_policy_version: REQUEST_PRIVACY_POLICY_VERSION,
      source_path: REQUEST_SOURCE_PATH,
    })
    .select("id, created_at")
    .single();

  const row = inserted.data as InsertedRequest | null;
  if (inserted.error || !row?.id || !row.created_at) {
    console.error("pilot visit request insert failed");
    return { ok: false };
  }

  return { ok: true, id: row.id, createdAt: row.created_at };
}

export async function recordVisitNotification(
  client: ServiceRoleClient,
  id: string,
  notification: VisitNotificationResult,
): Promise<RecordVisitNotificationResult> {
  const patch = notificationStatusPatch(notification);
  const updated = await client
    .from("pilot_visit_requests")
    .update(patch)
    .eq("id", id);

  if (updated.error) {
    return { ok: false };
  }

  return { ok: true };
}
