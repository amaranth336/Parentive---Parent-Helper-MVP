import {
  EARLY_ACCESS_HEADING,
  EARLY_ACCESS_SUCCESS_MESSAGE,
  EARLY_ACCESS_SUPPORTING,
  FREQUENCY_OPTIONS,
  MARKETING_CONSENT_LABEL,
  PILOT_CONTACT_CONSENT_LABEL,
  POSTAL_PLACEHOLDER,
  PRIVACY_POLICY_VERSION,
  SERVICE_INTEREST_OPTIONS,
} from "./copy";

describe("early-access copy", () => {
  it("keeps the exact heading, supporting copy, and success message", () => {
    expect(EARLY_ACCESS_HEADING).toBe("Make a little more room for life.");
    expect(EARLY_ACCESS_SUPPORTING).toBe(
      "Join our early-access list and hear when Parentive is coming to your community.",
    );
    expect(EARLY_ACCESS_SUCCESS_MESSAGE).toBe(
      "Thank you for your interest in Parentive! We will contact you once details of our services launching in your area become available.",
    );
  });

  it("keeps the exact consent labels", () => {
    expect(PILOT_CONTACT_CONSENT_LABEL).toBe(
      "I agree to be contacted by Parentive about pilot-launch opportunities and service availability in my area.",
    );
    expect(MARKETING_CONSENT_LABEL).toBe(
      "I'd also like occasional Parentive news, updates and offers.",
    );
  });

  it("keeps the exact service-interest and frequency labels", () => {
    expect(SERVICE_INTEREST_OPTIONS.map((option) => option.label)).toEqual([
      "Home & laundry support",
      "Kitchen & meal support",
      "Family support",
      "Flexible support",
      "Other support",
    ]);
    expect(FREQUENCY_OPTIONS.map((option) => option.label)).toEqual([
      "One time",
      "Recurring weekly",
      "Recurring biweekly",
      "Recurring monthly",
      "Other",
    ]);
  });

  it("uses A1A 1A1 as the postal placeholder and the stored privacy version", () => {
    expect(POSTAL_PLACEHOLDER).toBe("A1A 1A1");
    expect(PRIVACY_POLICY_VERSION).toBe("2026-09-22");
  });
});
