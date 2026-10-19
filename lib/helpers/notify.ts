import {
  AVAILABLE_DAY_OPTIONS,
  INTEREST_OPTIONS,
  PREFERRED_TIME_OPTIONS,
  WEEKLY_HOURS_OPTIONS,
} from "@/lib/helpers/copy";
import {
  sendAdminNotification,
  type AdminNotificationResult,
} from "@/lib/email/admin-notification";

const SUBJECT = "New Parentive helper application";

export type HelperNotificationApplication = {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  postalCode: string;
  interestKeys: readonly string[];
  interestedInChildSupport: boolean;
  gardenCapability: boolean;
  experienceText: string;
  motivationText: string;
  availableDays: readonly string[];
  preferredTimeBlocks: readonly string[];
  preferredWeeklyHours: string;
  documentOriginalFilename: string;
  futureOpportunitiesConsent: boolean;
};

export type HelperNotificationResult = AdminNotificationResult;

function labelFor(
  options: readonly { key: string; label: string }[],
  key: string,
): string {
  return options.find((option) => option.key === key)?.label ?? key;
}

function listLabels(
  options: readonly { key: string; label: string }[],
  keys: readonly string[],
): string {
  if (keys.length === 0) {
    return "Not provided";
  }

  return keys.map((key) => labelFor(options, key)).join(", ");
}

export function buildHelperNotificationText(
  application: HelperNotificationApplication,
): string {
  return [
    "New Parentive helper application",
    "",
    "Name:",
    `${application.firstName} ${application.lastName}`,
    "",
    "Email:",
    application.email,
    "",
    "Telephone:",
    application.telephone,
    "",
    "Postal code:",
    application.postalCode,
    "",
    "Interests:",
    listLabels(INTEREST_OPTIONS, application.interestKeys),
    "",
    "Parent-present childcare interest:",
    application.interestedInChildSupport ? "Yes" : "No",
    "",
    "Garden interest:",
    application.gardenCapability ? "Yes" : "No",
    "",
    "Experience:",
    application.experienceText,
    "",
    "Motivation:",
    application.motivationText,
    "",
    "Days:",
    listLabels(AVAILABLE_DAY_OPTIONS, application.availableDays),
    "",
    "Preferred times:",
    listLabels(PREFERRED_TIME_OPTIONS, application.preferredTimeBlocks),
    "",
    "Weekly hours:",
    labelFor(WEEKLY_HOURS_OPTIONS, application.preferredWeeklyHours),
    "",
    "Document:",
    application.documentOriginalFilename,
    "",
    "Future opportunities consent:",
    application.futureOpportunitiesConsent ? "Yes" : "No",
    "",
    "Submitted:",
    application.createdAt,
    "",
    "Reference:",
    application.id,
  ].join("\n");
}

export async function notifyHelperApplication(
  application: HelperNotificationApplication,
  options: {
    fetchImpl?: typeof fetch;
    now?: Date;
  } = {},
): Promise<HelperNotificationResult> {
  return sendAdminNotification(
    {
      subject: SUBJECT,
      text: buildHelperNotificationText(application),
      replyTo: application.email,
      referenceId: application.id,
      logLabel: "helper notification",
    },
    options,
  );
}
