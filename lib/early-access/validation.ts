import {
  FREQUENCY_KEYS,
  SERVICE_INTEREST_KEYS,
  type FrequencyKey,
  type ServiceInterestKey,
} from "./copy";

export const CANADIAN_POSTAL_REGEX =
  /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z] \d[ABCEGHJ-NPRSTV-Z]\d$/;

export const FIELD_ERROR_MESSAGES = {
  firstNameRequired: "Enter your first name.",
  firstNameLength: "First name must be 1 to 80 characters.",
  emailRequired: "Enter your email address.",
  emailInvalid: "Enter a valid email address.",
  postalRequired: "Enter your postal code.",
  postalInvalid: "Enter a Canadian postal code like A1A 1A1.",
  interestInvalid: "Choose only the listed kinds of support.",
  interestOtherLength: "Keep this under 500 characters.",
  frequencyInvalid: "Choose one frequency, or leave it blank.",
  frequencyOtherLength: "Keep this under 120 characters.",
  pilotConsentRequired:
    "Agree to be contacted about pilot-launch opportunities to continue.",
} as const;

export type EarlyAccessFormInput = {
  firstName?: unknown;
  email?: unknown;
  postalCode?: unknown;
  serviceInterests?: unknown;
  serviceInterestOther?: unknown;
  frequency?: unknown;
  frequencyOther?: unknown;
  pilotContactConsent?: unknown;
  marketingConsent?: unknown;
};

export type ValidatedEarlyAccess = {
  firstName: string;
  email: string;
  postalCode: string;
  postalFsa: string;
  serviceInterests: ServiceInterestKey[];
  serviceInterestOther: string | null;
  frequency: FrequencyKey | null;
  frequencyOther: string | null;
  pilotContactConsent: true;
  marketingConsent: boolean;
};

export type EarlyAccessValidationSuccess = {
  ok: true;
  value: ValidatedEarlyAccess;
};

export type EarlyAccessValidationFailure = {
  ok: false;
  fieldErrors: Record<string, string>;
};

export type EarlyAccessValidationResult =
  | EarlyAccessValidationSuccess
  | EarlyAccessValidationFailure;

const SERVICE_INTEREST_KEY_SET = new Set<string>(SERVICE_INTEREST_KEYS);
const FREQUENCY_KEY_SET = new Set<string>(FREQUENCY_KEYS);

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function maskPostalCode(raw: string): string {
  const compact = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  if (compact.length <= 3) {
    return compact;
  }

  return `${compact.slice(0, 3)} ${compact.slice(3)}`;
}

export function isValidEmail(email: string): boolean {
  if (email.length < 5 || email.length > 254) {
    return false;
  }

  if (email.includes(" ")) {
    return false;
  }

  const separatorIndex = email.indexOf("@");
  if (separatorIndex <= 0 || separatorIndex !== email.lastIndexOf("@")) {
    return false;
  }

  const local = email.slice(0, separatorIndex);
  const domain = email.slice(separatorIndex + 1);

  if (!local || !domain || !domain.includes(".")) {
    return false;
  }

  return true;
}

export function isValidCanadianPostalCode(postalCode: string): boolean {
  return CANADIAN_POSTAL_REGEX.test(postalCode);
}

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function readBoolean(value: unknown): boolean {
  return value === true;
}

function asObject(value: unknown): EarlyAccessFormInput | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as EarlyAccessFormInput;
}

export function validateEarlyAccessInput(
  raw: unknown,
): EarlyAccessValidationResult {
  const input = asObject(raw);
  const fieldErrors: Record<string, string> = {};

  const firstName = readString(input?.firstName).trim();
  if (!input || firstName.length === 0) {
    fieldErrors.firstName = FIELD_ERROR_MESSAGES.firstNameRequired;
  } else if (firstName.length > 80) {
    fieldErrors.firstName = FIELD_ERROR_MESSAGES.firstNameLength;
  }

  const email = normalizeEmail(readString(input?.email));
  if (!input || email.length === 0) {
    fieldErrors.email = FIELD_ERROR_MESSAGES.emailRequired;
  } else if (!isValidEmail(email)) {
    fieldErrors.email = FIELD_ERROR_MESSAGES.emailInvalid;
  }

  const postalCode = maskPostalCode(readString(input?.postalCode));
  if (!input || postalCode.length === 0) {
    fieldErrors.postalCode = FIELD_ERROR_MESSAGES.postalRequired;
  } else if (!isValidCanadianPostalCode(postalCode)) {
    fieldErrors.postalCode = FIELD_ERROR_MESSAGES.postalInvalid;
  }

  const rawInterests = input?.serviceInterests;
  let serviceInterests: ServiceInterestKey[] = [];
  if (rawInterests === undefined || rawInterests === null) {
    serviceInterests = [];
  } else if (
    !Array.isArray(rawInterests) ||
    rawInterests.some(
      (item) =>
        typeof item !== "string" || !SERVICE_INTEREST_KEY_SET.has(item),
    )
  ) {
    fieldErrors.serviceInterests = FIELD_ERROR_MESSAGES.interestInvalid;
  } else {
    serviceInterests = [
      ...new Set(rawInterests as ServiceInterestKey[]),
    ];
  }

  const otherSelected = serviceInterests.includes("other_support");
  const serviceInterestOtherRaw = readString(input?.serviceInterestOther).trim();
  if (otherSelected && serviceInterestOtherRaw.length > 500) {
    fieldErrors.serviceInterestOther = FIELD_ERROR_MESSAGES.interestOtherLength;
  }

  const rawFrequency = input?.frequency;
  let frequency: FrequencyKey | null = null;
  if (rawFrequency === undefined || rawFrequency === null || rawFrequency === "") {
    frequency = null;
  } else if (
    typeof rawFrequency !== "string" ||
    !FREQUENCY_KEY_SET.has(rawFrequency)
  ) {
    fieldErrors.frequency = FIELD_ERROR_MESSAGES.frequencyInvalid;
  } else {
    frequency = rawFrequency as FrequencyKey;
  }

  const frequencyOtherRaw = readString(input?.frequencyOther).trim();
  if (frequency === "other" && frequencyOtherRaw.length > 120) {
    fieldErrors.frequencyOther = FIELD_ERROR_MESSAGES.frequencyOtherLength;
  }

  const pilotContactConsent = readBoolean(input?.pilotContactConsent);
  if (!pilotContactConsent) {
    fieldErrors.pilotContactConsent = FIELD_ERROR_MESSAGES.pilotConsentRequired;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    value: {
      firstName,
      email,
      postalCode,
      postalFsa: postalCode.slice(0, 3),
      serviceInterests,
      serviceInterestOther: otherSelected ? serviceInterestOtherRaw || null : null,
      frequency,
      frequencyOther:
        frequency === "other" ? frequencyOtherRaw || null : null,
      pilotContactConsent: true,
      marketingConsent: readBoolean(input?.marketingConsent),
    },
  };
}
