export const PRIVACY_POLICY_VERSION = "2026-09-22";

export const EARLY_ACCESS_PATH = "/early-access";
export const PRIVACY_PATH = "/privacy";

export const EARLY_ACCESS_HEADING = "Make a little more room for life.";
export const EARLY_ACCESS_SUPPORTING =
  "Join our early-access list and hear when Parentive is coming to your community.";

export const EARLY_ACCESS_SUCCESS_MESSAGE =
  "Thank you for your interest in Parentive! We will contact you once details of our services launching in your area become available.";

export const SERVICE_INTEREST_QUESTION =
  "What can Parentive take off your plate?";

export const FREQUENCY_QUESTION = "How often might you use Parentive?";

export const FREQUENCY_PLANNING_NOTE =
  "This helps us plan supply and availability by region. It does not reserve hours.";

export const SERVICE_INTEREST_OTHER_LABEL =
  "If Other, tell us what would help to lighten your load.";

export const FREQUENCY_OTHER_LABEL = "If Other, tell us how often.";

export const PILOT_CONTACT_CONSENT_LABEL =
  "I agree to be contacted by Parentive about pilot-launch opportunities and service availability in my area.";

export const MARKETING_CONSENT_LABEL =
  "I'd also like occasional Parentive news, updates and offers.";

export const PILOT_CONTACT_PURPOSE =
  "Contact about pilot-launch opportunities and service availability in the applicant's area.";

export const MARKETING_CONSENT_PURPOSE =
  "Occasional Parentive news, updates and offers.";

export const POSTAL_PLACEHOLDER = "A1A 1A1";

export const EARLY_ACCESS_SOURCE_PATH = "/early-access";

export const SERVICE_INTEREST_OPTIONS = [
  { key: "home_laundry", label: "Home & laundry support" },
  { key: "kitchen_meal", label: "Kitchen & meal support" },
  { key: "family", label: "Family support" },
  { key: "flexible", label: "Flexible support" },
  { key: "other_support", label: "Other support" },
] as const;

export const FREQUENCY_OPTIONS = [
  { key: "one_time", label: "One time" },
  { key: "weekly", label: "Recurring weekly" },
  { key: "biweekly", label: "Recurring biweekly" },
  { key: "monthly", label: "Recurring monthly" },
  { key: "other", label: "Other" },
] as const;

export type ServiceInterestKey = (typeof SERVICE_INTEREST_OPTIONS)[number]["key"];
export type FrequencyKey = (typeof FREQUENCY_OPTIONS)[number]["key"];

export const SERVICE_INTEREST_KEYS = SERVICE_INTEREST_OPTIONS.map(
  (option) => option.key,
) as readonly ServiceInterestKey[];

export const FREQUENCY_KEYS = FREQUENCY_OPTIONS.map(
  (option) => option.key,
) as readonly FrequencyKey[];

export const FIELD_LABELS = {
  firstName: "First name",
  email: "Email",
  postalCode: "Postal code",
  serviceInterestOther: SERVICE_INTEREST_OTHER_LABEL,
  frequencyOther: FREQUENCY_OTHER_LABEL,
  pilotContactConsent: PILOT_CONTACT_CONSENT_LABEL,
  marketingConsent: MARKETING_CONSENT_LABEL,
} as const;

export const SUBMIT_IDLE_LABEL = "Join early access";
export const SUBMIT_PENDING_LABEL = "Submitting…";

export const PRIVACY_NOTICE =
  "We store privacy notice version 2026-09-22 with this early-access submission. Pilot contact is separate from optional news and offers.";

export const PRIVACY_NOTICE_LINK_LABEL = "Read the privacy notice";

export const PRIVACY_PAGE = {
  heading: "Privacy notice",
  versionLabel: `Version ${PRIVACY_POLICY_VERSION}`,
  backHref: EARLY_ACCESS_PATH,
  backLabel: "Back to early access",
  paragraphs: [
    "This notice is the version stored with early-access waitlist consent. It describes this form, not a full legal policy for every Parentive activity.",
    "When you join early access we collect your first name, email address, and postal code. You may also share optional service interests, optional frequency, and a short note when you choose Other.",
    "We use that information to contact you about pilot-launch opportunities and service availability in your area, and to understand demand by region. A formatted Canadian postal code does not prove your address exists, and living outside the pilot communities does not block sign-up.",
    "Required pilot-contact consent is separate from optional marketing consent. We do not treat launch-contact permission as permission for news, updates, or offers.",
    "If you choose optional marketing, we may send occasional Parentive news, updates and offers.",
  ],
} as const;

export const EARLY_ACCESS_ERRORS = {
  validation: "Please correct the highlighted fields.",
  rateLimit: "Too many attempts. Please try again in a few minutes.",
  unavailable:
    "Early access sign-up is temporarily unavailable. Please try again later.",
  unexpected: "Something went wrong. Please try again.",
} as const;

export const EARLY_ACCESS_COPY = {
  heading: EARLY_ACCESS_HEADING,
  supporting: EARLY_ACCESS_SUPPORTING,
  success: EARLY_ACCESS_SUCCESS_MESSAGE,
  serviceInterestQuestion: SERVICE_INTEREST_QUESTION,
  frequencyQuestion: FREQUENCY_QUESTION,
  frequencyPlanningNote: FREQUENCY_PLANNING_NOTE,
  postalPlaceholder: POSTAL_PLACEHOLDER,
  privacyPolicyVersion: PRIVACY_POLICY_VERSION,
  privacyPath: PRIVACY_PATH,
  earlyAccessPath: EARLY_ACCESS_PATH,
} as const;
