import {
  COMPENSATION_LINE,
  DOCUMENT_ATTACH_COPY,
  EXPERIENCE_SUPPORTING,
  HELPERS_EYEBROW,
  HELPERS_HEADING,
  HELPERS_INTRO,
  HELPERS_PRIVACY_POLICY_VERSION,
  INTEREST_OPTIONS,
  POSTAL_PLACEHOLDER,
  SUCCESS_HEADING,
  WEEKLY_HOURS_OPTIONS,
} from "./copy";

describe("helpers copy", () => {
  it("keeps the exact eyebrow, heading, and intro", () => {
    expect(HELPERS_EYEBROW).toBe("JOIN OUR FOUNDING TEAM");
    expect(HELPERS_HEADING).toBe("Help shape Parentive from the beginning.");
    expect(HELPERS_INTRO).toBe(
      "We're looking for compassionate, dependable and detail-oriented people who enjoy working with families to make everyday life just a little bit easier. As a Founding Helper, you'll be an integral member of the team establishing how Parentive works; from the quality of our services to the experience we create for households we support - one task at a time.",
    );
  });

  it("keeps the exact compensation and document sentences", () => {
    expect(COMPENSATION_LINE).toBe(
      "Flexible Hours - $20–$23/hr Compensation",
    );
    expect(COMPENSATION_LINE).toContain("$20–$23");
    expect(DOCUMENT_ATTACH_COPY).toBe(
      "Attach a résumé if you have one. Or, alternatively, a document outlining relevant experience to the services Parentive provides.",
    );
    expect(EXPERIENCE_SUPPORTING).toBe(
      "Formal professional experience is not required for every task. We value experience acquired from everyday life and lived experiences where relevant to the services we provide.",
    );
    expect(SUCCESS_HEADING).toBe("Application received.");
  });

  it("keeps the exact interest labels and weekly-hour keys", () => {
    expect(INTEREST_OPTIONS.map((option) => option.label)).toEqual([
      "Laundry, folding and household resets",
      "Tidying and organizing family spaces",
      "Food preparation and kitchen support",
      "Parent-present childcare and child engagement",
      "Flexible household support",
      "Garden and light outdoor/landscape duties",
    ]);
    expect(WEEKLY_HOURS_OPTIONS.map((option) => option.key)).toEqual([
      "under_6",
      "6_to_10",
      "11_to_20",
      "21_plus",
    ]);
  });

  it("uses A1A 1A1 as the postal placeholder and a helpers privacy version", () => {
    expect(POSTAL_PLACEHOLDER).toBe("A1A 1A1");
    expect(HELPERS_PRIVACY_POLICY_VERSION).toBe("2026-09-22-helpers");
  });
});
