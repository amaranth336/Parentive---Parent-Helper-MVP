import {
  AVAILABLE_DAY_KEYS,
  INTEREST_KEYS,
  PREFERRED_TIME_KEYS,
  WEEKLY_HOURS_KEYS,
  type AvailableDayKey,
  type InterestKey,
  type PreferredTimeKey,
  type WeeklyHoursKey,
} from "./copy";

export const CANADIAN_POSTAL_REGEX =
  /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z] \d[ABCEGHJ-NPRSTV-Z]\d$/;

export const FIELD_ERROR_MESSAGES = {
  firstNameRequired: "Enter your first name.",
  firstNameLength: "First name must be 1 to 80 characters.",
  lastNameRequired: "Enter your last name.",
  lastNameLength: "Last name must be 1 to 80 characters.",
  emailRequired: "Enter your email address.",
  emailInvalid: "Enter a valid email address.",
  telephoneRequired: "Enter your telephone number.",
  telephoneLength: "Telephone must be 7 to 30 characters.",
  postalRequired: "Enter your postal code.",
  postalInvalid: "Enter a Canadian postal code like A1A 1A1.",
  interestsRequired: "Select at least one type of support.",
  interestsInvalid: "Choose only the listed kinds of support.",
  experienceRequired: "Tell us about your relevant experience.",
  experienceLength: "Keep this under 5000 characters.",
  motivationRequired: "Tell us why you are interested.",
  motivationLength: "Keep this under 5000 characters.",
  daysRequired: "Select at least one day.",
  daysInvalid: "Choose only the listed days.",
  timesRequired: "Select at least one preferred time.",
  timesInvalid: "Choose only the listed preferred times.",
  hoursRequired: "Choose a preferred weekly hours range.",
  hoursInvalid: "Choose one of the listed weekly hours ranges.",
  age18Required: "Confirm that you are at least 18 years old.",
  workEligibleRequired: "Confirm that you are legally eligible to work in Canada.",
  vehicleRequired:
    "Confirm that you have your own vehicle with adequate insurance for travel.",
  screeningRequired:
    "Confirm that you consent to participating in reference and criminal background checks if selected for further screening.",
  documentRequired: "Attach a PDF or DOCX experience document.",
  applicationConsentRequired:
    "Agree to the application information consent to continue.",
} as const;

export type HelpersFormInput = {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  telephone?: unknown;
  postalCode?: unknown;
  interestKeys?: unknown;
  experienceText?: unknown;
  motivationText?: unknown;
  availableDays?: unknown;
  preferredTimeBlocks?: unknown;
  preferredWeeklyHours?: unknown;
  age18Confirmed?: unknown;
  workEligibleCanada?: unknown;
  hasOwnVehicle?: unknown;
  screeningAcknowledgement?: unknown;
  applicationConsent?: unknown;
  futureOpportunitiesConsent?: unknown;
  documentOriginalFilename?: unknown;
  documentContentType?: unknown;
  documentByteSize?: unknown;
};

export type ValidatedHelpersApplication = {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  postalCode: string;
  postalFsa: string;
  interestKeys: InterestKey[];
  interestedInChildSupport: boolean;
  gardenCapability: boolean;
  experienceText: string;
  motivationText: string;
  availableDays: AvailableDayKey[];
  preferredTimeBlocks: PreferredTimeKey[];
  preferredWeeklyHours: WeeklyHoursKey;
  age18Confirmed: true;
  workEligibleCanada: true;
  hasOwnVehicle: true;
  screeningAcknowledgement: true;
  applicationConsent: true;
  futureOpportunitiesConsent: boolean;
  documentOriginalFilename: string;
  documentContentType: string;
  documentByteSize: number;
};

export type HelpersValidationSuccess = {
  ok: true;
  value: ValidatedHelpersApplication;
};

export type HelpersValidationFailure = {
  ok: false;
  fieldErrors: Record<string, string>;
};

export type HelpersValidationResult =
  | HelpersValidationSuccess
  | HelpersValidationFailure;

const INTEREST_KEY_SET = new Set<string>(INTEREST_KEYS);
const DAY_KEY_SET = new Set<string>(AVAILABLE_DAY_KEYS);
const TIME_KEY_SET = new Set<string>(PREFERRED_TIME_KEYS);
const HOURS_KEY_SET = new Set<string>(WEEKLY_HOURS_KEYS);

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
  return value === true || value === "true" || value === "on" || value === "1";
}

function asObject(value: unknown): HelpersFormInput | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as HelpersFormInput;
}

function parseKeyArray<T extends string>(
  raw: unknown,
  allowed: Set<string>,
): { ok: true; values: T[] } | { ok: false } {
  if (raw === undefined || raw === null) {
    return { ok: true, values: [] };
  }

  const list = Array.isArray(raw) ? raw : [raw];
  if (
    list.some(
      (item) => typeof item !== "string" || !allowed.has(item),
    )
  ) {
    return { ok: false };
  }

  return { ok: true, values: [...new Set(list as T[])] };
}

export function validateHelpersInput(raw: unknown): HelpersValidationResult {
  const input = asObject(raw);
  const fieldErrors: Record<string, string> = {};

  const firstName = readString(input?.firstName).trim();
  if (!input || firstName.length === 0) {
    fieldErrors.firstName = FIELD_ERROR_MESSAGES.firstNameRequired;
  } else if (firstName.length > 80) {
    fieldErrors.firstName = FIELD_ERROR_MESSAGES.firstNameLength;
  }

  const lastName = readString(input?.lastName).trim();
  if (!input || lastName.length === 0) {
    fieldErrors.lastName = FIELD_ERROR_MESSAGES.lastNameRequired;
  } else if (lastName.length > 80) {
    fieldErrors.lastName = FIELD_ERROR_MESSAGES.lastNameLength;
  }

  const email = normalizeEmail(readString(input?.email));
  if (!input || email.length === 0) {
    fieldErrors.email = FIELD_ERROR_MESSAGES.emailRequired;
  } else if (!isValidEmail(email)) {
    fieldErrors.email = FIELD_ERROR_MESSAGES.emailInvalid;
  }

  const telephone = readString(input?.telephone).trim();
  if (!input || telephone.length === 0) {
    fieldErrors.telephone = FIELD_ERROR_MESSAGES.telephoneRequired;
  } else if (telephone.length < 7 || telephone.length > 30) {
    fieldErrors.telephone = FIELD_ERROR_MESSAGES.telephoneLength;
  }

  const postalCode = maskPostalCode(readString(input?.postalCode));
  if (!input || postalCode.length === 0) {
    fieldErrors.postalCode = FIELD_ERROR_MESSAGES.postalRequired;
  } else if (!isValidCanadianPostalCode(postalCode)) {
    fieldErrors.postalCode = FIELD_ERROR_MESSAGES.postalInvalid;
  }

  const interestsParsed = parseKeyArray<InterestKey>(
    input?.interestKeys,
    INTEREST_KEY_SET,
  );
  let interestKeys: InterestKey[] = [];
  if (!interestsParsed.ok) {
    fieldErrors.interestKeys = FIELD_ERROR_MESSAGES.interestsInvalid;
  } else {
    interestKeys = interestsParsed.values;
    if (interestKeys.length === 0) {
      fieldErrors.interestKeys = FIELD_ERROR_MESSAGES.interestsRequired;
    }
  }

  const experienceText = readString(input?.experienceText).trim();
  if (!input || experienceText.length === 0) {
    fieldErrors.experienceText = FIELD_ERROR_MESSAGES.experienceRequired;
  } else if (experienceText.length > 5000) {
    fieldErrors.experienceText = FIELD_ERROR_MESSAGES.experienceLength;
  }

  const motivationText = readString(input?.motivationText).trim();
  if (!input || motivationText.length === 0) {
    fieldErrors.motivationText = FIELD_ERROR_MESSAGES.motivationRequired;
  } else if (motivationText.length > 5000) {
    fieldErrors.motivationText = FIELD_ERROR_MESSAGES.motivationLength;
  }

  const daysParsed = parseKeyArray<AvailableDayKey>(
    input?.availableDays,
    DAY_KEY_SET,
  );
  let availableDays: AvailableDayKey[] = [];
  if (!daysParsed.ok) {
    fieldErrors.availableDays = FIELD_ERROR_MESSAGES.daysInvalid;
  } else {
    availableDays = daysParsed.values;
    if (availableDays.length === 0) {
      fieldErrors.availableDays = FIELD_ERROR_MESSAGES.daysRequired;
    }
  }

  const timesParsed = parseKeyArray<PreferredTimeKey>(
    input?.preferredTimeBlocks,
    TIME_KEY_SET,
  );
  let preferredTimeBlocks: PreferredTimeKey[] = [];
  if (!timesParsed.ok) {
    fieldErrors.preferredTimeBlocks = FIELD_ERROR_MESSAGES.timesInvalid;
  } else {
    preferredTimeBlocks = timesParsed.values;
    if (preferredTimeBlocks.length === 0) {
      fieldErrors.preferredTimeBlocks = FIELD_ERROR_MESSAGES.timesRequired;
    }
  }

  const rawHours = input?.preferredWeeklyHours;
  let preferredWeeklyHours: WeeklyHoursKey | null = null;
  if (rawHours === undefined || rawHours === null || rawHours === "") {
    fieldErrors.preferredWeeklyHours = FIELD_ERROR_MESSAGES.hoursRequired;
  } else if (
    typeof rawHours !== "string" ||
    !HOURS_KEY_SET.has(rawHours)
  ) {
    fieldErrors.preferredWeeklyHours = FIELD_ERROR_MESSAGES.hoursInvalid;
  } else {
    preferredWeeklyHours = rawHours as WeeklyHoursKey;
  }

  if (!readBoolean(input?.age18Confirmed)) {
    fieldErrors.age18Confirmed = FIELD_ERROR_MESSAGES.age18Required;
  }
  if (!readBoolean(input?.workEligibleCanada)) {
    fieldErrors.workEligibleCanada = FIELD_ERROR_MESSAGES.workEligibleRequired;
  }
  if (!readBoolean(input?.hasOwnVehicle)) {
    fieldErrors.hasOwnVehicle = FIELD_ERROR_MESSAGES.vehicleRequired;
  }
  if (!readBoolean(input?.screeningAcknowledgement)) {
    fieldErrors.screeningAcknowledgement = FIELD_ERROR_MESSAGES.screeningRequired;
  }
  if (!readBoolean(input?.applicationConsent)) {
    fieldErrors.applicationConsent =
      FIELD_ERROR_MESSAGES.applicationConsentRequired;
  }

  const documentOriginalFilename = readString(
    input?.documentOriginalFilename,
  ).trim();
  const documentContentType = readString(input?.documentContentType).trim();
  const documentByteSizeRaw = input?.documentByteSize;
  const documentByteSize =
    typeof documentByteSizeRaw === "number"
      ? documentByteSizeRaw
      : typeof documentByteSizeRaw === "string"
        ? Number(documentByteSizeRaw)
        : NaN;

  if (
    !documentOriginalFilename ||
    !documentContentType ||
    !Number.isFinite(documentByteSize) ||
    documentByteSize <= 0
  ) {
    fieldErrors.document = FIELD_ERROR_MESSAGES.documentRequired;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    value: {
      firstName,
      lastName,
      email,
      telephone,
      postalCode,
      postalFsa: postalCode.slice(0, 3),
      interestKeys,
      interestedInChildSupport: interestKeys.includes(
        "parent_present_childcare",
      ),
      gardenCapability: interestKeys.includes("garden_outdoor"),
      experienceText,
      motivationText,
      availableDays,
      preferredTimeBlocks,
      preferredWeeklyHours: preferredWeeklyHours as WeeklyHoursKey,
      age18Confirmed: true,
      workEligibleCanada: true,
      hasOwnVehicle: true,
      screeningAcknowledgement: true,
      applicationConsent: true,
      futureOpportunitiesConsent: readBoolean(
        input?.futureOpportunitiesConsent,
      ),
      documentOriginalFilename,
      documentContentType,
      documentByteSize,
    },
  };
}
