import type { ContactNotificationResult } from "@/lib/contact/notify";
import type { ValidatedContact } from "@/lib/contact/validation";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export type ServiceRoleClient = NonNullable<
  ReturnType<typeof createServiceRoleClient>
>;

export type SubmitContactResult =
  | { ok: true; id: string; createdAt: string }
  | { ok: false };

export type RecordContactNotificationResult = { ok: true } | { ok: false };

type InsertedInquiry = {
  id?: string;
  created_at?: string;
};

export async function submitContactInquiry(
  value: ValidatedContact,
  options: {
    client?: ServiceRoleClient | null;
  } = {},
): Promise<SubmitContactResult> {
  const client =
    options.client === undefined ? createServiceRoleClient() : options.client;

  if (!client) {
    return { ok: false };
  }

  const inserted = await client
    .from("contact_inquiries")
    .insert({
      name: value.name,
      email: value.email,
      phone: value.phone,
      message: value.message,
    })
    .select("id, created_at")
    .single();

  const row = inserted.data as InsertedInquiry | null;
  if (inserted.error || !row?.id || !row.created_at) {
    console.error("contact inquiry insert failed");
    return { ok: false };
  }

  return { ok: true, id: row.id, createdAt: row.created_at };
}

export async function recordContactNotification(
  client: ServiceRoleClient,
  id: string,
  notification: ContactNotificationResult,
): Promise<RecordContactNotificationResult> {
  const patch =
    notification.notification_status === "sent"
      ? {
          notification_status: "sent" as const,
          notification_error: null,
          notification_sent_at:
            notification.notification_sent_at ?? new Date().toISOString(),
        }
      : {
          notification_status: "failed" as const,
          notification_error: (
            notification.notification_error ?? "resend_request_failed"
          ).slice(0, 500),
          notification_sent_at: null,
        };

  const updated = await client
    .from("contact_inquiries")
    .update(patch)
    .eq("id", id);

  if (updated.error) {
    return { ok: false };
  }

  return { ok: true };
}
