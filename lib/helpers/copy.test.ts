import {
  COMPENSATION_LINE,
  DOCUMENT_ATTACH_COPY,
  EXPERIENCE_SUPPORTING,
  FIELD_LABELS,
  HELPERS_EYEBROW,
  HELPERS_HEADING,
  HELPERS_INTRO,
  HELPERS_PRIVACY_POLICY_VERSION,
  INTEREST_OPTIONS,
  POSTAL_PLACEHOLDER,
  SCREENING_ACK_HELPER_TEXT,
  SUCCESS_HEADING,
  WEEKLY_HOURS_OPTIONS,
} from "./copy";

describe("helpers copy", () => {
  it("keeps the exact eyebrow, heading, and intro", () => {
    expect(HELPERS_EYEBROW).toBe("JOIN OUR FOUNDING TEAM");
    expect(HELPERS_HEADING).toBe("Help shape Parentive from the beginning.");
    expect(HELPERS_INTRO).toBe(
      "We're looking for compassionate, dependable, detail-oriented people who enjoy working with families and want to make everyday life a little easier. As a Founding Helper, you'll be an integral part of the team shaping how Parentive works, from the quality of our services to the experience we create for the households we support, one task at a time.",
    );
  });

  it("keeps the exact compensation and document sentences", () => {
    expect(COMPENSATION_LINE).toBe("Flexible hours, $20–$23 per hour.");
    expect(COMPENSATION_LINE).toContain("$20–$23");
    expect(DOCUMENT_ATTACH_COPY).toBe(
      "Please upload one document: your résumé, or anything that outlines your experience relevant to the services Parentive provides.",
    );
    expect(EXPERIENCE_SUPPORTING).toBe(
      "Formal work experience isn't needed for every task. We value what you've learned from everyday life and lived experience too, wherever it's relevant to the work.",
    );
    expect(SUCCESS_HEADING).toBe("Application received.");
  });

  it("keeps the exact interest labels and weekly-hour keys", () => {
    expect(INTEREST_OPTIONS.map((option) => option.label)).toEqual([
      "Laundry, including putting items away",
      "Tidying, light cleaning and organizing family spaces",
      "Food preparation and kitchen support",
      "Parent-present childcare and child engagement",
      "Additional household support as Parentive services evolve",
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
    expect(HELPERS_PRIVACY_POLICY_VERSION).toBe("2026-10-02-helpers");
  });

  it("uses the owner-approved vehicle and screening helper wording", () => {
    expect(FIELD_LABELS.hasOwnVehicle).toBe(
      "I have my own vehicle with adequate insurance and can travel to customer homes.",
    );
    expect(SCREENING_ACK_HELPER_TEXT).toBe(
      "We'll ask for references later in the process, and a criminal-record check is arranged afterward, usually after a conditional offer.",
    );
    expect(SCREENING_ACK_HELPER_TEXT).not.toContain(
      "This acknowledgement is not a substitute for later specific informed authorization.",
    );
  });
});
