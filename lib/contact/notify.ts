const RESEND_EMAILS_URL = "https://api.resend.com/emails";
const DEFAULT_NOTIFICATION_TO = "admin@parentive.ca";
const SUBJECT = "New Parentive contact form submission";

export type ContactNotificationInquiry = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
};

export type ContactNotificationResult = {
  notification_status: "sent" | "failed";
  notification_error: string | null;
  notification_sent_at: string | null;
};

export function contactNotificationRecipient(): string {
  const configured = process.env.CONTACT_NOTIFICATION_TO?.trim();
  return configured || DEFAULT_NOTIFICATION_TO;
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

function failed(error: string): ContactNotificationResult {
  return {
    notification_status: "failed",
    notification_error: error.slice(0, 500),
    notification_sent_at: null,
  };
}

export async function notifyContactInquiry(
  inquiry: ContactNotificationInquiry,
  options: {
    fetchImpl?: typeof fetch;
    now?: Date;
  } = {},
): Promise<ContactNotificationResult> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_NOTIFICATION_FROM?.trim();

  if (!apiKey || !from) {
    console.error("contact notification failed", inquiry.id);
    return failed("missing_email_config");
  }

  try {
    const response = await fetchImpl(RESEND_EMAILS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [contactNotificationRecipient()],
        reply_to: inquiry.email,
        subject: SUBJECT,
        text: buildContactNotificationText(inquiry),
      }),
    });

    if (!response.ok) {
      console.error("contact notification failed", inquiry.id, response.status);
      return failed(`resend_http_${response.status}`);
    }
  } catch {
    console.error("contact notification failed", inquiry.id);
    return failed("resend_request_failed");
  }

  return {
    notification_status: "sent",
    notification_error: null,
    notification_sent_at: (options.now ?? new Date()).toISOString(),
  };
}
