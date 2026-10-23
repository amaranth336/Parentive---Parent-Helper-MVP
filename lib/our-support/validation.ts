import {
  isValidCanadianPostalCode,
  isValidEmail,
  maskPostalCode,
  normalizeEmail,
} from "@/lib/early-access/validation";
import {
  FLEXIBLE_SERVICE_ID,
  isServiceId,
  type ServiceId,
} from "@/lib/our-support/catalogue";
import { FIELD_ERRORS } from "@/lib/our-support/copy";
import {
  summarizeSelection,
  type SelectionSummary,
  type ServiceLine,
  type VisitType,
} from "@/lib/our-support/selection";

export const VISIT_LIMITS = {
  name: 80,
  email: 254,
  preferredTimes: 500,
  helperNotes: 5000,
  recurringPreferences: 2000,
  flexibleDescription: 2000,
} as const;

export type ValidatedVisitRequest = {
  name: string;
  email: string;
  postalCode: string;
  postalFsa: string;
  preferredTimes: string;
  helperNotes: string | null;
  visitType: VisitType;
  recurringPreferences: string | null;
  serviceIds: ServiceId[];
  lines: ServiceLine[];
  subtotalCents: number;
  quoteRequired: boolean;
  flexibleDescription: string | null;
  minimumCents: number;
  fixedBelowMinimum: boolean;
};

export type VisitValidationResult =
  | { ok: true; value: ValidatedVisitRequest }
  | { ok: false; fieldErrors: Record<string, string> };

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

/**
 * Whitespace-only companyWebsite is empty. Any other present value trips
 * the honeypot. Missing, null, and blank values do not.
 */
export function isVisitHoneypotTripped(raw: unknown): boolean {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return false;
  }
  if (!Object.prototype.hasOwnProperty.call(raw, "companyWebsite")) {
    return false;
  }
  const value = (raw as { companyWebsite?: unknown }).companyWebsite;
  if (value === undefined || value === null) {
    return false;
  }
  if (typeof value !== "string") {
    return true;
  }
  return value.trim().length > 0;
}

function readServiceIds(value: unknown): ServiceId[] | null {
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }
  const ids: ServiceId[] = [];
  for (const item of value) {
    if (typeof item !== "string" || !isServiceId(item) || ids.includes(item)) {
      return null;
    }
    ids.push(item);
  }
  return ids;
}

export function selectionBlockers(
  summary: SelectionSummary,
  visitType: VisitType,
  flexibleDescription: string,
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  if (summary.count === 0) {
    fieldErrors.services = FIELD_ERRORS.servicesRequired;
    return fieldErrors;
  }
  if (summary.washingOnly) {
    fieldErrors.services = FIELD_ERRORS.washingOnly;
  }
  if (
    !summary.quoteRequired &&
    summary.fixedBelowMinimum &&
    !fieldErrors.services
  ) {
    fieldErrors.services =
      visitType === "recurring"
        ? FIELD_ERRORS.belowMinimumRecurring
        : FIELD_ERRORS.belowMinimumOneTime;
  }
  if (summary.quoteRequired && flexibleDescription.trim().length === 0) {
    fieldErrors.flexibleDescription = FIELD_ERRORS.flexibleRequired;
  }
  return fieldErrors;
}

export function validateVisitRequestInput(raw: unknown): VisitValidationResult {
  const input = asObject(raw);
  const fieldErrors: Record<string, string> = {};

  const name = readString(input?.name).trim();
  if (!input || name.length === 0) {
    fieldErrors.name = FIELD_ERRORS.nameRequired;
  } else if (name.length > VISIT_LIMITS.name) {
    fieldErrors.name = FIELD_ERRORS.nameLength;
  }

  const email = normalizeEmail(readString(input?.email));
  if (!input || email.length === 0) {
    fieldErrors.email = FIELD_ERRORS.emailRequired;
  } else if (!isValidEmail(email)) {
    fieldErrors.email = FIELD_ERRORS.emailInvalid;
  }

  const postalCode = maskPostalCode(readString(input?.postalCode));
  if (!input || postalCode.length === 0) {
    fieldErrors.postalCode = FIELD_ERRORS.postalRequired;
  } else if (!isValidCanadianPostalCode(postalCode)) {
    fieldErrors.postalCode = FIELD_ERRORS.postalInvalid;
  }

  const preferredTimes = readString(input?.preferredTimes).trim();
  if (!input || preferredTimes.length === 0) {
    fieldErrors.preferredTimes = FIELD_ERRORS.timesRequired;
  } else if (preferredTimes.length > VISIT_LIMITS.preferredTimes) {
    fieldErrors.preferredTimes = FIELD_ERRORS.timesLength;
  }

  const helperNotesRaw = readString(input?.helperNotes).trim();
  if (helperNotesRaw.length > VISIT_LIMITS.helperNotes) {
    fieldErrors.helperNotes = FIELD_ERRORS.notesLength;
  }

  const visitTypeRaw = readString(input?.visitType);
  const visitType: VisitType | null =
    visitTypeRaw === "one-time" || visitTypeRaw === "recurring"
      ? visitTypeRaw
      : null;
  if (!visitType) {
    fieldErrors.visitType = FIELD_ERRORS.visitTypeInvalid;
  }

  const recurringRaw = readString(input?.recurringPreferences).trim();
  if (visitType === "one-time" && recurringRaw.length > 0) {
    fieldErrors.recurringPreferences = FIELD_ERRORS.recurringHidden;
  } else if (visitType === "recurring" && recurringRaw.length === 0) {
    fieldErrors.recurringPreferences = FIELD_ERRORS.recurringRequired;
  } else if (recurringRaw.length > VISIT_LIMITS.recurringPreferences) {
    fieldErrors.recurringPreferences = FIELD_ERRORS.recurringLength;
  }

  let serviceIds: ServiceId[] | null = null;
  if (!Array.isArray(input?.serviceIds) || input.serviceIds.length === 0) {
    fieldErrors.services = FIELD_ERRORS.servicesRequired;
  } else {
    serviceIds = readServiceIds(input.serviceIds);
    if (!serviceIds) {
      fieldErrors.services = FIELD_ERRORS.servicesInvalid;
    }
  }

  const flexibleRaw = readString(input?.flexibleDescription).trim();
  const quoteSelected = serviceIds?.includes(FLEXIBLE_SERVICE_ID) ?? false;
  if (!quoteSelected && flexibleRaw.length > 0) {
    fieldErrors.flexibleDescription = FIELD_ERRORS.flexibleHidden;
  } else if (flexibleRaw.length > VISIT_LIMITS.flexibleDescription) {
    fieldErrors.flexibleDescription = FIELD_ERRORS.flexibleLength;
  }

  const summary =
    serviceIds && visitType
      ? summarizeSelection(serviceIds, visitType)
      : null;
  if (summary && visitType) {
    Object.assign(
      fieldErrors,
      selectionBlockers(summary, visitType, flexibleRaw),
    );
  }

  if (
    summary &&
    Object.prototype.hasOwnProperty.call(input, "subtotalCents") &&
    input?.subtotalCents !== summary.subtotalCents
  ) {
    fieldErrors.subtotalCents = FIELD_ERRORS.subtotalMismatch;
  }

  if (Object.keys(fieldErrors).length > 0 || !visitType || !serviceIds || !summary) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    value: {
      name,
      email,
      postalCode,
      postalFsa: postalCode.slice(0, 3),
      preferredTimes,
      helperNotes: helperNotesRaw.length > 0 ? helperNotesRaw : null,
      visitType,
      recurringPreferences: visitType === "recurring" ? recurringRaw : null,
      serviceIds,
      lines: summary.lines,
      subtotalCents: summary.subtotalCents,
      quoteRequired: summary.quoteRequired,
      flexibleDescription: summary.quoteRequired ? flexibleRaw : null,
      minimumCents: summary.minimumCents,
      fixedBelowMinimum: summary.fixedBelowMinimum,
    },
  };
}
