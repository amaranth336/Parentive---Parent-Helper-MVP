const RESEND_EMAILS_URL = "https://api.resend.com/emails";
const DEFAULT_NOTIFICATION_TO = "admin@parentive.ca";

export type AdminNotificationResult = {
  notification_status: "sent" | "failed";
  notification_error: string | null;
  notification_sent_at: string | null;
};

export type AdminNotificationMessage = {
  subject: string;
  text: string;
  replyTo: string;
  referenceId: string;
  logLabel: string;
};

export function adminNotificationRecipient(): string {
  const configured = process.env.CONTACT_NOTIFICATION_TO?.trim();
  return configured || DEFAULT_NOTIFICATION_TO;
}

export function notificationStatusPatch(notification: AdminNotificationResult): {
  notification_status: "sent" | "failed";
  notification_error: string | null;
  notification_sent_at: string | null;
} {
  if (notification.notification_status === "sent") {
    return {
      notification_status: "sent",
      notification_error: null,
      notification_sent_at:
        notification.notification_sent_at ?? new Date().toISOString(),
    };
  }

  return {
    notification_status: "failed",
    notification_error: (
      notification.notification_error ?? "resend_request_failed"
    ).slice(0, 500),
    notification_sent_at: null,
  };
}

function failed(error: string): AdminNotificationResult {
  return {
    notification_status: "failed",
    notification_error: error.slice(0, 500),
    notification_sent_at: null,
  };
}

export async function sendAdminNotification(
  message: AdminNotificationMessage,
  options: {
    fetchImpl?: typeof fetch;
    now?: Date;
  } = {},
): Promise<AdminNotificationResult> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_NOTIFICATION_FROM?.trim();

  if (!apiKey || !from) {
    console.error(`${message.logLabel} failed`, message.referenceId);
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
        to: [adminNotificationRecipient()],
        reply_to: message.replyTo,
        subject: message.subject,
        text: message.text,
      }),
    });

    if (!response.ok) {
      console.error(
        `${message.logLabel} failed`,
        message.referenceId,
        response.status,
      );
      return failed(`resend_http_${response.status}`);
    }
  } catch {
    console.error(`${message.logLabel} failed`, message.referenceId);
    return failed("resend_request_failed");
  }

  return {
    notification_status: "sent",
    notification_error: null,
    notification_sent_at: (options.now ?? new Date()).toISOString(),
  };
}
