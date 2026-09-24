export const HELPERS_PRIVACY_POLICY_VERSION = "2026-09-22-helpers";

export const HELPERS_PATH = "/helpers";
export const PRIVACY_PATH = "/privacy";
export const HELPERS_PRIVACY_ANCHOR = "/privacy#founding-helper-applications";

export const HELPERS_EYEBROW = "JOIN OUR FOUNDING TEAM";
export const HELPERS_HEADING = "Help shape Parentive from the beginning.";
export const HELPERS_INTRO =
  "We're looking for compassionate, dependable and detail-oriented people who enjoy working with families to make everyday life just a little bit easier. As a Founding Helper, you'll be an integral member of the team establishing how Parentive works; from the quality of our services to the experience we create for households we support - one task at a time.";

export const COMPENSATION_LINE =
  "Flexible Hours - $20–$23/hr Compensation";

export const COMPENSATION_SUPPORT_PRIMARY =
  "You tell us when you're available · Pilot-phase compensation, subject to review after the pilot";

export const COMPENSATION_SUPPORT_SECONDARY =
  "Employee positions · No guaranteed pilot hours · Preference for 6+ hours of weekly availability";

export const DOCUMENT_ATTACH_COPY =
  "Attach a résumé if you have one. Or, alternatively, a document outlining relevant experience to the services Parentive provides.";

export const EXPERIENCE_SUPPORTING =
  "Formal professional experience is not required for every task. We value experience acquired from everyday life and lived experiences where relevant to the services we provide.";

export const INTEREST_QUESTION =
  "Which types of support would you enjoy providing?";

export const INTEREST_HELPER_TEXT =
  "These selections indicate interests and skills for screening. They do not guarantee task-specific employment or add new public services. Garden and light outdoor work is recorded as a candidate capability, not a customer-facing service.";

export const WEEKLY_HOURS_HELPER_TEXT =
  "Six or more hours per week is preferred, but hours and schedules are not guaranteed during the pilot.";

export const SCREENING_ACK_HELPER_TEXT =
  "References are requested during subsequent screening. A criminal-record check is arranged later, ordinarily after a conditional offer. Do not upload criminal-record documents with this application.";

export const VEHICLE_REQUIREMENT_TEXT =
  "This role requires a valid driver's licence and appropriate vehicle insurance for lawful travel between assignments.";

export const APPLICATION_CONSENT_LABEL =
  "I consent to Parentive collecting and using the information in this application, including my uploaded experience document, to assess my qualifications for a Founding Helper role and to contact me about this application.";

export const FUTURE_OPPORTUNITIES_CONSENT_LABEL =
  "I consent to Parentive retaining my application for consideration for future Parentive opportunities.";

export const APPLICATION_CONSENT_PURPOSE =
  "Assess Founding Helper qualifications and contact the candidate about this application.";

export const FUTURE_OPPORTUNITIES_CONSENT_PURPOSE =
  "Retain the application for consideration for future Parentive opportunities.";

export const POSTAL_PLACEHOLDER = "A1A 1A1";

export const HELPERS_SOURCE_PATH = "/helpers";

export const DOCUMENT_BUCKET = "helper-application-documents";

export const MAX_DOCUMENT_BYTES = 5_242_880;

/** Multipart overhead allowance beyond the document itself (fields + boundaries). */
export const MAX_HELPERS_REQUEST_BYTES = MAX_DOCUMENT_BYTES + 512_000;

export const HELPERS_RATE_LIMIT_MAX_REQUESTS = 3;
export const HELPERS_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

export const INTEREST_OPTIONS = [
  {
    key: "laundry_household_resets",
    label: "Laundry, folding and household resets",
  },
  {
    key: "tidying_organizing",
    label: "Tidying and organizing family spaces",
  },
  {
    key: "food_kitchen",
    label: "Food preparation and kitchen support",
  },
  {
    key: "parent_present_childcare",
    label: "Parent-present childcare and child engagement",
  },
  {
    key: "flexible_household",
    label: "Flexible household support",
  },
  {
    key: "garden_outdoor",
    label: "Garden and light outdoor/landscape duties",
  },
] as const;

export const AVAILABLE_DAY_OPTIONS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
] as const;

export const PREFERRED_TIME_OPTIONS = [
  { key: "mornings", label: "Mornings" },
  { key: "afternoons", label: "Afternoons" },
  { key: "evenings", label: "Evenings" },
  { key: "flexible", label: "Flexible / varies" },
] as const;

export const WEEKLY_HOURS_OPTIONS = [
  { key: "under_6", label: "Under 6 hours" },
  { key: "6_to_10", label: "6–10 hours" },
  { key: "11_to_20", label: "11–20 hours" },
  { key: "21_plus", label: "21+ hours" },
] as const;

export type InterestKey = (typeof INTEREST_OPTIONS)[number]["key"];
export type AvailableDayKey = (typeof AVAILABLE_DAY_OPTIONS)[number]["key"];
export type PreferredTimeKey = (typeof PREFERRED_TIME_OPTIONS)[number]["key"];
export type WeeklyHoursKey = (typeof WEEKLY_HOURS_OPTIONS)[number]["key"];

export const INTEREST_KEYS = INTEREST_OPTIONS.map(
  (option) => option.key,
) as readonly InterestKey[];

export const AVAILABLE_DAY_KEYS = AVAILABLE_DAY_OPTIONS.map(
  (option) => option.key,
) as readonly AvailableDayKey[];

export const PREFERRED_TIME_KEYS = PREFERRED_TIME_OPTIONS.map(
  (option) => option.key,
) as readonly PreferredTimeKey[];

export const WEEKLY_HOURS_KEYS = WEEKLY_HOURS_OPTIONS.map(
  (option) => option.key,
) as readonly WeeklyHoursKey[];

export const FIELD_LABELS = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  telephone: "Telephone",
  postalCode: "Postal code",
  interestKeys: INTEREST_QUESTION,
  experienceText: "Tell us about your relevant experience.",
  motivationText: "Why are you interested in becoming a Founding Helper?",
  availableDays: "What days are you generally available?",
  preferredTimeBlocks: "Preferred times",
  preferredWeeklyHours: "Preferred weekly hours",
  age18Confirmed: "I am at least 18 years old.",
  workEligibleCanada: "I am legally eligible to work in Canada.",
  hasOwnVehicle:
    "I have my own vehicle with adequate insurance and can travel to customer homes.",
  screeningAcknowledgement:
    "I consent to participating in reference and criminal background checks should I be selected for further candidate screening.",
  document: "Experience document",
  applicationConsent: APPLICATION_CONSENT_LABEL,
  futureOpportunitiesConsent: FUTURE_OPPORTUNITIES_CONSENT_LABEL,
} as const;

export const SUBMIT_IDLE_LABEL = "Submit application";
export const SUBMIT_PENDING_LABEL = "Submitting…";

export const SUCCESS_HEADING = "Application received.";
export const SUCCESS_MESSAGE =
  "Parentive has received your application and will review it while assembling the initial Founding Helper team.";

export const HELPERS_ERRORS = {
  validation: "Please correct the highlighted fields.",
  rateLimit: "Too many attempts. Please try again in a few minutes.",
  unavailable:
    "Helper applications are temporarily unavailable. Please try again later.",
  unexpected: "Something went wrong. Please try again.",
  payloadTooLarge:
    "The application upload is too large. Use a PDF or DOCX of 5 MB or smaller.",
  documentRequired: "Attach a PDF or DOCX experience document to continue.",
  documentReselect:
    "Your experience document must be selected again before submitting.",
} as const;

export const HELPERS_COPY = {
  eyebrow: HELPERS_EYEBROW,
  heading: HELPERS_HEADING,
  intro: HELPERS_INTRO,
  compensationLine: COMPENSATION_LINE,
  documentAttach: DOCUMENT_ATTACH_COPY,
  experienceSupporting: EXPERIENCE_SUPPORTING,
  privacyPolicyVersion: HELPERS_PRIVACY_POLICY_VERSION,
  privacyPath: HELPERS_PRIVACY_ANCHOR,
  helpersPath: HELPERS_PATH,
  successHeading: SUCCESS_HEADING,
  successMessage: SUCCESS_MESSAGE,
} as const;
