export const MEASUREMENT_PRIVACY_HREF = "/privacy/notice#website-measurement";

export const MEASUREMENT_PRIVACY = {
  id: "website-measurement",
  heading: "Website measurement",
  effectiveDate: "Effective date: November 10, 2026",
  intro:
    "On Parentive's public household-service pages, optional analytics and advertising cookies stay off until you accept them. The site works the same if you reject them.",
  paragraphs: [
    "Analytics uses an outside analytics provider. With your permission, it receives the page you are visiting and a lead event after a support request is saved. That shows which public pages are used. It does not receive your name, email, phone number, postal code, or the notes you write.",
    "Advertising measurement uses an outside advertising provider. With your permission, it receives a page visit and a lead event after a support request is saved, so we can understand visits that start from an ad or a printed flyer. It does not receive your form entries or contact details.",
    "You can accept or reject these cookies. Privacy choices in the footer let you change this later. If you reject them, we stop new measurements. Declining does not change your ability to send a support request, join early access, or apply to join the team.",
  ],
} as const;

export const MEASUREMENT_UI = {
  heading: "Cookies",
  body: "We use optional cookies.",
  acceptCookies: "Accept cookies",
  rejectCookies: "Reject cookies",
  footerLabel: "Privacy Choices",
  privacyLink: "Read the privacy notice",
  dialogLabel: "Privacy choices",
  closeLabel: "Close",
} as const;
