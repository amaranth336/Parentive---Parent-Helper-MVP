import {
  adminNotificationRecipient,
  sendAdminNotification,
  type AdminNotificationResult,
} from "@/lib/email/admin-notification";
import {
  WASHING_ELAPSED_PLANNING_MINUTES,
  WASHING_SERVICE_IDS,
  formatServiceDollars,
} from "@/lib/our-support/catalogue";
import type { ValidatedVisitRequest } from "@/lib/our-support/validation";

const SUBJECT = "New Parentive pilot visit request";

export type VisitNotificationRequest = {
  id: string;
  createdAt: string;
  request: ValidatedVisitRequest;
};

export type VisitNotificationResult = AdminNotificationResult;

function linePrice(cents: number | null): string {
  if (cents === null) {
    return "Quoted separately (not free)";
  }
  return formatServiceDollars(cents);
}

export function buildVisitNotificationText(
  notice: VisitNotificationRequest,
): string {
  const { request } = notice;
  const includesWashing = request.serviceIds.some((id) =>
    (WASHING_SERVICE_IDS as readonly string[]).includes(id),
  );
  const lines = [
    "New Parentive pilot visit request",
    "",
    "This is a request, not a confirmed booking. No payment was collected.",
    "",
    "Name:",
    request.name,
    "",
    "Email:",
    request.email,
    "",
    "Postal code:",
    request.postalCode,
    "",
    "Preferred days and times:",
    request.preferredTimes,
    "",
    "Visit type:",
    request.visitType === "recurring"
      ? "Recurring scheduled visits"
      : "One-time visit",
    "",
    "Regular visit details:",
    request.recurringPreferences ?? "Not applicable",
    "",
    "Services:",
    ...request.lines.map(
      (line) => `${line.id} — ${line.name} — ${linePrice(line.priceCents)}`,
    ),
    "",
    "Priced service subtotal (CAD, before tax):",
    formatServiceDollars(request.subtotalCents),
    "",
    "Quote required:",
    request.quoteRequired ? "Yes. Flexible Support is quoted separately and is not free." : "No",
    "",
    "Flexible Support details:",
    request.flexibleDescription ?? "Not applicable",
    "",
    "Visit minimum (CAD cents):",
    String(request.minimumCents),
    "",
    "Priced services below that minimum:",
    request.fixedBelowMinimum ? "Yes. Confirm the minimum and final price before payment. Do not add a silent top-up." : "No",
    "",
    "Helper notes:",
    request.helperNotes ?? "Not provided",
    "",
    "Marketing consent:",
    "No",
  ];

  if (includesWashing) {
    lines.push(
      "",
      "Washing services need other work in the same visit. Each washing service has a",
      `${WASHING_ELAPSED_PLANNING_MINUTES}-minute elapsed planning allowance, including the dry-cycle allowance.`,
      "That allowance is not hands-on time. Do not add overlapping cycles together.",
      "Confirm the visit length manually.",
    );
  }

  lines.push("", "Submitted:", notice.createdAt, "", "Reference:", notice.id);
  return lines.join("\n");
}

export async function notifyVisitRequest(
  notice: VisitNotificationRequest,
  options: {
    fetchImpl?: typeof fetch;
    now?: Date;
  } = {},
): Promise<VisitNotificationResult> {
  return sendAdminNotification(
    {
      subject: SUBJECT,
      text: buildVisitNotificationText(notice),
      replyTo: notice.request.email,
      referenceId: notice.id,
      logLabel: "pilot visit notification",
    },
    options,
  );
}

export function visitNotificationRecipient(): string {
  return adminNotificationRecipient();
}
