export const HELPERS_PRIVACY_POLICY_VERSION = "2026-10-02-helpers";

export const HELPERS_PATH = "/helpers";
export const PRIVACY_PATH = "/privacy";
export const HELPERS_PRIVACY_ANCHOR = "/privacy#founding-helper-applications";

export const HELPERS_EYEBROW = "JOIN OUR FOUNDING TEAM";
export const HELPERS_HEADING = "Help shape Parentive from the beginning.";
export const HELPERS_INTRO =
  "We're looking for compassionate, dependable, detail-oriented people who enjoy working with families and want to make everyday life a little easier. As a Founding Helper, you'll be an integral part of the team shaping how Parentive works, from the quality of our services to the experience we create for the households we support, one task at a time.";

export const COMPENSATION_LINE = "Flexible hours, $20–$23 per hour.";

export const COMPENSATION_SUPPORT_PRIMARY =
  "Pay is for the pilot phase and will be reviewed after the pilot. These are employee positions. Hours aren't guaranteed during the pilot, and we're hoping to hear from people with 6 or more hours of weekly availability.";

export const DOCUMENT_ATTACH_COPY =
  "Please upload one document: your résumé, or anything that outlines your experience relevant to the services Parentive provides.";

export const EXPERIENCE_SUPPORTING =
  "Formal work experience isn't needed for every task. We value what you've learned from everyday life and lived experience too, wherever it's relevant to the work.";

export const INTEREST_QUESTION =
  "Which types of support best match your skills and experience?";

export const INTEREST_HELPER_TEXT =
  "These selections indicate interests and skills for screening. They do not guarantee task-specific employment.";

export const WEEKLY_HOURS_HELPER_TEXT =
  "A quick note: hours and schedules aren't guaranteed during the pilot.";

export const SCREENING_ACK_HELPER_TEXT =
  "We'll ask for references later in the process, and a criminal-record check is arranged afterward, usually after a conditional offer.";

export const VEHICLE_REQUIREMENT_TEXT =
  "This role requires a valid driver's licence and appropriate vehicle insurance so you can travel lawfully between assignments.";

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
    label: "Laundry, including putting items away",
  },
  {
    key: "tidying_organizing",
    label: "Tidying, light cleaning and organizing family spaces",
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
    label: "Additional household support as Parentive services evolve",
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
  motivationText: "What draws you to becoming a Parentive Helper?",
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
  validation: "Almost there. Just a few things to take another look at.",
  rateLimit: "Too many attempts. Please try again in a few minutes.",
  unavailable:
    "Helper applications are temporarily unavailable. Please try again later.",
  unexpected: "Something went wrong. Please try again.",
  payloadTooLarge:
    "The application upload is too large. Use a PDF or DOCX of 5 MB or smaller.",
  documentRequired: "Please attach your experience document (PDF or DOCX).",
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
