import { PRIVACY_POLICY_VERSION } from "@/lib/early-access/copy";

export const OUR_SUPPORT_PATH = "/our-support";
export const PRIVACY_PATH = "/privacy/notice";

export const OUR_SUPPORT_TITLE = "Our Support — Parentive";
export const OUR_SUPPORT_DESCRIPTION =
  "Choose a few everyday tasks and send a pilot visit request. Parentive confirms the details, price and scheduling by email. No payment is collected on this website at this time.";

export const HERO_HEADLINE = "A little less on your list.";
export const HERO_DECK =
  "Laundry put away. Dinner prepared. A room that feels settled again.";
export const HERO_BODY =
  "Let us take a few everyday tasks off your plate. Your Helper brings a thoughtful eye and a practical hand, leaving you more room for the rest of life.";

export const EXPLORE_SUPPORT_LABEL = "Explore our support";

export const VISIT_HEADING = "Your Helper visit";
export const VISIT_STEPS = [
  {
    title: "Choose & submit.",
    body: "Check the services you’d like, add your notes and send your request. No payment is taken here.",
  },
  {
    title: "We work out the details.",
    body: "Parentive reviews your request and confirms the details, price and scheduling by email. Once accepted, you’ll provide an e-transfer then receive your booking confirmation.",
  },
  {
    title: "Exhale — we’ve got this.",
    body: "Your Helper arrives ready to take care of the tasks you’ve chosen, with a thoughtful eye for the little things. You can count on us to lighten the load and leave more room for living.",
  },
] as const;

export const PREFERENCES_HEADING = "Your preferences. Our to-do list.";
export const PREFERENCES_BODY =
  "Tell us what matters to you—how you like things folded, where the lunch containers live, or what needs a little extra attention. Your Helper will follow your lead, figure out the everyday details and follow the flow of your home. Just have your usual supplies ready; we’ll take it from there.";

export const REQUEST_EYEBROW = "Let’s Shorten your list";
export const REQUEST_TITLE = "What are we helping with?";
export const REQUEST_INTRO =
  "A few tasks this week, or support you can count on as part of your routine. Tell us what would help.";

export const VISIT_TYPE_LABEL = "How should we plan this visit?";
export const VISIT_TYPE_OPTIONS = [
  { value: "one-time", label: "One-time visit" },
  { value: "recurring", label: "Recurring scheduled visits" },
] as const;

export const RECURRING_LABEL = "What would you like your regular visits to look like?";
export const RECURRING_PLACEHOLDER =
  "How often, which days, and what you’d like a hand with…";
export const RECURRING_NOTE =
  "Recurring help is a commitment of at least three visits. We’ll confirm the rhythm with you before anything is booked.";

export const NAME_LABEL = "Your name";
export const EMAIL_LABEL = "Email";
export const POSTAL_LABEL = "Postal code";
export const POSTAL_PLACEHOLDER = "A1A 1A1";
export const TIMES_LABEL = "Which days and times work best?";
export const NOTES_LABEL =
  "What information would you like to share with your Helper to better prepare for your visit?";
export const FLEXIBLE_LABEL = "Tell us what you’d like help with";
export const FLEXIBLE_PLACEHOLDER =
  "Describe the task, and anything we should know before we review it.";

export const ADD_LABEL = "Add to your request";
export const BOOKING_NOTES_LABEL = "Booking notes";
export const REMOVE_LABEL = "Remove";
export const SUBMIT_LABEL = "Submit request";
export const SUBMIT_PENDING_LABEL = "Sending request…";

export const SUBTOTAL_LABEL = "Service subtotal per visit";
export const QUOTE_SEPARATE_LABEL =
  "Flexible Support is quoted separately. It isn’t included in the subtotal, and it isn’t free.";
export const QUOTE_ONLY_LABEL =
  "Flexible Support is quoted separately. We’ll confirm the price with you before any payment.";

export const REQUEST_CART_NOTE =
  "Early booking requests are being accepted. Service anticipated launch date: January 4, 2027.";

export const PRICING_NOTE =
  "Prices are in CAD, before applicable tax. One-time visits have an $80 minimum. Recurring visits are $60 minimum per visit, with a commitment of at least three visits.";

export const REQUEST_NOTICE =
  "This is a request, not a confirmed booking. We’ll review the request and respond by email within 24 hours. No payment is collected on this website at this time.";

export const PORTAL_HEADING = "Simpler booking is on its way.";
export const PORTAL_NOTE =
  "Our online booking and payment portal is coming soon. For now, we’ll arrange your visit together by email.";

export const PRIVACY_NOTE =
  "We use your name, email, postal code, availability and notes so we can review this request and reply. We won’t add you to a marketing list.";
export const PRIVACY_LINK_LABEL = "Read the privacy notice";

export const SUCCESS_HEADING = "Request received";
export const SUCCESS_MESSAGE =
  "Thanks. We’ll review your request and respond by email within 24 hours. This is a request, not a confirmed booking, and no payment has been collected.";

export const REQUEST_CONTACT_PURPOSE =
  "Review and reply about this pilot visit request, including details, price and scheduling. This does not confirm a booking and does not enroll the sender in marketing.";

export const REQUEST_PRIVACY_POLICY_VERSION = PRIVACY_POLICY_VERSION;
export const REQUEST_SOURCE_PATH = OUR_SUPPORT_PATH;

export const MAX_VISIT_REQUEST_BYTES = 32768;

export const VISIT_ERRORS = {
  validation: "Almost there. Just a few things to take another look at.",
  rateLimit: "Too many attempts. Please try again in a few minutes.",
  unavailable:
    "Visit requests are temporarily unavailable. Please try again later.",
  unexpected: "Something went wrong. Please try again.",
  payloadTooLarge:
    "That request is too large to send. Please shorten the notes and try again.",
} as const;

export const FIELD_ERRORS = {
  nameRequired: "Could you add your name?",
  nameLength: "Name must be 1 to 80 characters.",
  emailRequired: "Could you add your email?",
  emailInvalid: "Enter a valid email address.",
  postalRequired: "Could you add your postal code?",
  postalInvalid: "Enter a Canadian postal code like A1A 1A1.",
  timesRequired: "Which days and times work best?",
  timesLength: "Days and times must be 1 to 500 characters.",
  notesLength: "Those notes must be 5000 characters or fewer.",
  visitTypeInvalid: "Choose a one-time visit or recurring scheduled visits.",
  recurringRequired: "Tell us what you’d like your regular visits to look like.",
  recurringLength: "Those visit details must be 2000 characters or fewer.",
  recurringHidden:
    "Regular-visit details are only used for recurring scheduled visits.",
  servicesRequired: "Choose at least one service to include in your request.",
  servicesInvalid: "Choose services from the current catalogue.",
  washingOnly:
    "Laundry that includes washing needs to be booked alongside other work, so your Helper can keep going while the machines run. Add another service, or describe the extra work in a Flexible Support Request.",
  belowMinimumOneTime:
    "Add a few more services to reach the $80 minimum for a one-time visit. We won’t add a top-up for you.",
  belowMinimumRecurring:
    "Add a few more services to reach the $60 minimum for each recurring visit. We won’t add a top-up for you.",
  flexibleRequired:
    "Tell us what you’d like help with so we can quote Flexible Support. It isn’t included in the subtotal.",
  flexibleLength: "Those details must be 2000 characters or fewer.",
  flexibleHidden:
    "Flexible Support details are only used when that request is selected.",
  subtotalMismatch:
    "The service total didn’t match our catalogue. Please try again.",
} as const;

export const BELOW_MINIMUM_QUOTE_NOTE =
  "The priced services are under the visit minimum. Because Flexible Support is quoted separately, we’ll confirm the minimum and the final price before any payment.";
