export const MEASUREMENT_PRIVACY_HREF = "/privacy/notice#website-measurement";

export const MEASUREMENT_PRIVACY = {
  id: "website-measurement",
  heading: "Website measurement",
  effectiveDate: "Effective date: November 10, 2026",
  intro:
    "On Parentive's public household-service pages, you can choose two optional measurement tools. Nothing is sent to them until you allow it, and the site works the same with both turned off.",
  paragraphs: [
    "Analytics uses Google Analytics 4. With your permission, it receives the page you are visiting and a lead event after a support request is saved. That shows which public pages are used. It does not receive your name, email, phone number, postal code, or the notes you write.",
    "Advertising measurement uses the Meta Pixel. With your permission, it receives a page visit and a lead event after a support request is saved, so we can understand visits that start from an ad or a printed flyer. It does not receive your form entries or contact details.",
    "Printed flyers link to our homepage with a source, a medium and a campaign name. Those names distinguish shop placements from door-to-door distribution. They are not connected to your identity.",
    "You can accept both tools, reject both, or allow only one. Privacy choices in the footer let you change this later. If you withdraw a choice, we stop new measurements for that tool. Declining or withdrawing does not change your ability to send a support request, join early access, or apply to join the team.",
    "We do not use these tools on hiring, early access, privacy, account, search, admin, or health and fertility pages, or when a page address contains personal information.",
  ],
} as const;

export const MEASUREMENT_UI = {
  heading: "Optional site measurement",
  body: "Analytics tells us which public pages are visited. Advertising measurement tells us when a visit starts from an ad or a printed flyer. Both are optional.",
  analyticsLabel: "Analytics",
  analyticsHint:
    "Page visits on public service pages, and a lead event after a support request is saved.",
  advertisingLabel: "Advertising",
  advertisingHint:
    "Page visits and saved support requests for ads and printed flyers.",
  acceptAll: "Accept all",
  rejectOptional: "Reject optional",
  saveChoices: "Save choices",
  footerLabel: "Privacy choices",
  privacyLink: "Read the privacy notice",
  dialogLabel: "Privacy choices",
  closeLabel: "Close",
} as const;
