import {
  adminNotificationRecipient,
  sendAdminNotification,
  type AdminNotificationResult,
} from "@/lib/email/admin-notification";

const SUBJECT = "New Parentive contact form submission";

export type ContactNotificationInquiry = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
};

export type ContactNotificationResult = AdminNotificationResult;

export function contactNotificationRecipient(): string {
  return adminNotificationRecipient();
}

export function buildContactNotificationText(
  inquiry: ContactNotificationInquiry,
): string {
  const phone =
    inquiry.phone && inquiry.phone.trim().length > 0
      ? inquiry.phone
      : "Not provided";

  return [
    "New Parentive contact form submission",
    "",
    "Name:",
    inquiry.name,
    "",
    "Email:",
    inquiry.email,
    "",
    "Phone:",
    phone,
    "",
    "Message:",
    inquiry.message,
    "",
    "Submitted:",
    inquiry.createdAt,
    "",
    "Reference:",
    inquiry.id,
  ].join("\n");
}

export async function notifyContactInquiry(
  inquiry: ContactNotificationInquiry,
  options: {
    fetchImpl?: typeof fetch;
    now?: Date;
  } = {},
): Promise<ContactNotificationResult> {
  return sendAdminNotification(
    {
      subject: SUBJECT,
      text: buildContactNotificationText(inquiry),
      replyTo: inquiry.email,
      referenceId: inquiry.id,
      logLabel: "contact notification",
    },
    options,
  );
}
