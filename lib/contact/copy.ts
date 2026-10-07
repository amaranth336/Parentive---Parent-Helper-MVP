export const CONTACT_PATH = "/contact";
export const HELPERS_PATH = "/helpers";
export const PRIVACY_PATH = "/privacy/notice";

export const CONTACT_HEADING = "We'd love to hear from you.";
export const CONTACT_SUPPORTING =
  "Questions, ideas, or just curious? Send us a note and we'll get back to you.";

export const CONTACT_HELPERS_NOTE_LEAD =
  "Interested in joining our team? We'd love to hear from you. Visit";
export const CONTACT_HELPERS_LINK_LABEL = "Join Our Team";

export const CONTACT_PRIVACY_NOTE =
  "We use your name, email, phone if you share one, and message so we can reply.";
export const CONTACT_PRIVACY_LINK_LABEL = "Read the privacy notice";

export const SUBMIT_IDLE_LABEL = "Send message";
export const SUBMIT_PENDING_LABEL = "Submitting…";

export const SUCCESS_HEADING = "Message received";
export const SUCCESS_MESSAGE =
  "Thanks. We received your message and will be in touch.";

export const MAX_CONTACT_REQUEST_BYTES = 32768;

export const CONTACT_ERRORS = {
  validation: "Almost there. Just a few things to take another look at.",
  rateLimit: "Too many attempts. Please try again in a few minutes.",
  unavailable:
    "The contact form is temporarily unavailable. Please try again later.",
  unexpected: "Something went wrong. Please try again.",
  payloadTooLarge:
    "That message is too large to send. Please shorten it and try again.",
} as const;

export const FIELD_ERROR_MESSAGES = {
  nameRequired: "Could you add your name?",
  nameLength: "Name must be 1 to 80 characters.",
  emailRequired: "Could you add your email?",
  emailInvalid: "Enter a valid email address.",
  phoneInvalid: "Phone must be 1 to 30 characters.",
  messageRequired: "Enter a message.",
  messageLength: "Message must be 1 to 5000 characters.",
} as const;
