import {
  FREQUENCY_OPTIONS,
  SERVICE_INTEREST_OPTIONS,
} from "@/lib/early-access/copy";
import {
  sendAdminNotification,
  type AdminNotificationResult,
} from "@/lib/email/admin-notification";

const SUBJECT = "New Parentive early-access registration";

export type EarlyAccessNotificationRegistration = {
  id: string;
  createdAt: string;
  firstName: string;
  email: string;
  postalCode: string;
  serviceAreaStatus: string;
  serviceAreaCommunity: string | null;
  serviceInterests: readonly string[];
  serviceInterestOther: string | null;
  frequency: string | null;
  frequencyOther: string | null;
  marketingConsent: boolean;
};

export type EarlyAccessNotificationResult = AdminNotificationResult;

function labelFor(
  options: readonly { key: string; label: string }[],
  key: string,
): string {
  return options.find((option) => option.key === key)?.label ?? key;
}

function areaLabel(status: string, community: string | null): string {
  const statusLabel =
    status === "in_pilot"
      ? "In pilot"
      : status === "outside_pilot"
        ? "Outside pilot"
        : status === "unknown"
          ? "Unknown"
          : status;

  return community ? `${statusLabel} (${community})` : statusLabel;
}

export function buildEarlyAccessNotificationText(
  registration: EarlyAccessNotificationRegistration,
): string {
  const interests =
    registration.serviceInterests.length > 0
      ? registration.serviceInterests
          .map((key) => labelFor(SERVICE_INTEREST_OPTIONS, key))
          .join(", ")
      : "Not provided";

  return [
    "New Parentive early-access registration",
    "",
    "Name:",
    registration.firstName,
    "",
    "Email:",
    registration.email,
    "",
    "Postal code:",
    registration.postalCode,
    "",
    "Area:",
    areaLabel(registration.serviceAreaStatus, registration.serviceAreaCommunity),
    "",
    "Interests:",
    interests,
    "",
    "Other interest:",
    registration.serviceInterestOther?.trim() || "Not provided",
    "",
    "Frequency:",
    registration.frequency
      ? labelFor(FREQUENCY_OPTIONS, registration.frequency)
      : "Not provided",
    "",
    "Frequency detail:",
    registration.frequencyOther?.trim() || "Not provided",
    "",
    "Marketing consent:",
    registration.marketingConsent ? "Yes" : "No",
    "",
    "Submitted:",
    registration.createdAt,
    "",
    "Reference:",
    registration.id,
  ].join("\n");
}

export async function notifyEarlyAccessRegistration(
  registration: EarlyAccessNotificationRegistration,
  options: {
    fetchImpl?: typeof fetch;
    now?: Date;
  } = {},
): Promise<EarlyAccessNotificationResult> {
  return sendAdminNotification(
    {
      subject: SUBJECT,
      text: buildEarlyAccessNotificationText(registration),
      replyTo: registration.email,
      referenceId: registration.id,
      logLabel: "early-access notification",
    },
    options,
  );
}
