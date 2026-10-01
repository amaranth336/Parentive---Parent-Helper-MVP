import { isValidEmail, normalizeEmail } from "@/lib/early-access/validation";
import { FIELD_ERROR_MESSAGES } from "@/lib/contact/copy";

export const CONTACT_LIMITS = {
  name: 80,
  email: 254,
  phone: 30,
  message: 5000,
} as const;

export type ContactFormInput = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
  companyWebsite?: unknown;
};

export type ValidatedContact = {
  name: string;
  email: string;
  phone: string | null;
  message: string;
};

export type ContactValidationSuccess = {
  ok: true;
  value: ValidatedContact;
};

export type ContactValidationFailure = {
  ok: false;
  fieldErrors: Record<string, string>;
};

export type ContactValidationResult =
  | ContactValidationSuccess
  | ContactValidationFailure;

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asObject(value: unknown): ContactFormInput | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as ContactFormInput;
}

/**
 * Whitespace-only companyWebsite is empty. Any other present value trips
 * the honeypot. Missing, null, and blank values do not.
 */
export function isContactHoneypotTripped(raw: unknown): boolean {
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

export function validateContactInput(raw: unknown): ContactValidationResult {
  const input = asObject(raw);
  const fieldErrors: Record<string, string> = {};

  const name = readString(input?.name).trim();
  if (!input || name.length === 0) {
    fieldErrors.name = FIELD_ERROR_MESSAGES.nameRequired;
  } else if (name.length > CONTACT_LIMITS.name) {
    fieldErrors.name = FIELD_ERROR_MESSAGES.nameLength;
  }

  const email = normalizeEmail(readString(input?.email));
  if (!input || email.length === 0) {
    fieldErrors.email = FIELD_ERROR_MESSAGES.emailRequired;
  } else if (!isValidEmail(email)) {
    fieldErrors.email = FIELD_ERROR_MESSAGES.emailInvalid;
  }

  const phoneResult = normalizeOptionalPhone(input?.phone);
  if (!phoneResult.ok) {
    fieldErrors.phone = FIELD_ERROR_MESSAGES.phoneInvalid;
  }

  const message = readString(input?.message).trim();
  if (!input || message.length === 0) {
    fieldErrors.message = FIELD_ERROR_MESSAGES.messageRequired;
  } else if (message.length > CONTACT_LIMITS.message) {
    fieldErrors.message = FIELD_ERROR_MESSAGES.messageLength;
  }

  if (Object.keys(fieldErrors).length > 0 || !phoneResult.ok) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    value: {
      name,
      email,
      phone: phoneResult.phone,
      message,
    },
  };
}

function normalizeOptionalPhone(
  value: unknown,
): { ok: true; phone: string | null } | { ok: false; phone?: undefined } {
  if (value === undefined || value === null) {
    return { ok: true, phone: null };
  }

  if (typeof value !== "string") {
    return { ok: false };
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return { ok: true, phone: null };
  }

  if (trimmed.length > CONTACT_LIMITS.phone) {
    return { ok: false };
  }

  return { ok: true, phone: trimmed };
}
