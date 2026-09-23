import { POSTAL_PLACEHOLDER } from "./copy";
import {
  FIELD_ERROR_MESSAGES,
  maskPostalCode,
  validateHelpersInput,
} from "./validation";

const validInput = {
  firstName: "Alex",
  lastName: "Rivera",
  email: "alex@example.com",
  telephone: "416-555-0100",
  postalCode: "L3Y 4S2",
  interestKeys: ["laundry_household_resets", "flexible_household"],
  experienceText: "Helped neighbours with laundry and meal prep.",
  motivationText: "I want to support families in practical ways.",
  availableDays: ["monday", "wednesday"],
  preferredTimeBlocks: ["mornings", "flexible"],
  preferredWeeklyHours: "6_to_10",
  age18Confirmed: true,
  workEligibleCanada: true,
  hasOwnVehicle: true,
  screeningAcknowledgement: true,
  applicationConsent: true,
  futureOpportunitiesConsent: false,
  documentOriginalFilename: "experience.pdf",
  documentContentType: "application/pdf",
  documentByteSize: 1200,
};

describe("helpers validation", () => {
  it("requires core identity, interests, availability, consents, and document metadata", () => {
    const result = validateHelpersInput({});

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    expect(result.fieldErrors.firstName).toBe(
      FIELD_ERROR_MESSAGES.firstNameRequired,
    );
    expect(result.fieldErrors.lastName).toBe(
      FIELD_ERROR_MESSAGES.lastNameRequired,
    );
    expect(result.fieldErrors.email).toBe(FIELD_ERROR_MESSAGES.emailRequired);
    expect(result.fieldErrors.telephone).toBe(
      FIELD_ERROR_MESSAGES.telephoneRequired,
    );
    expect(result.fieldErrors.postalCode).toBe(
      FIELD_ERROR_MESSAGES.postalRequired,
    );
    expect(result.fieldErrors.interestKeys).toBe(
      FIELD_ERROR_MESSAGES.interestsRequired,
    );
    expect(result.fieldErrors.experienceText).toBe(
      FIELD_ERROR_MESSAGES.experienceRequired,
    );
    expect(result.fieldErrors.motivationText).toBe(
      FIELD_ERROR_MESSAGES.motivationRequired,
    );
    expect(result.fieldErrors.availableDays).toBe(
      FIELD_ERROR_MESSAGES.daysRequired,
    );
    expect(result.fieldErrors.preferredTimeBlocks).toBe(
      FIELD_ERROR_MESSAGES.timesRequired,
    );
    expect(result.fieldErrors.preferredWeeklyHours).toBe(
      FIELD_ERROR_MESSAGES.hoursRequired,
    );
    expect(result.fieldErrors.age18Confirmed).toBe(
      FIELD_ERROR_MESSAGES.age18Required,
    );
    expect(result.fieldErrors.applicationConsent).toBe(
      FIELD_ERROR_MESSAGES.applicationConsentRequired,
    );
    expect(result.fieldErrors.document).toBe(
      FIELD_ERROR_MESSAGES.documentRequired,
    );
  });

  it("masks postal codes and does not treat the placeholder as a default", () => {
    expect(maskPostalCode("l3y4s2")).toBe("L3Y 4S2");
    expect(maskPostalCode("a1a1a1")).toBe("A1A 1A1");
    expect(maskPostalCode("")).toBe("");
    expect(POSTAL_PLACEHOLDER).toBe("A1A 1A1");
    expect(validInput.postalCode).not.toBe(POSTAL_PLACEHOLDER);
  });

  it("trims and lowercases email and rejects invalid values", () => {
    const normalized = validateHelpersInput({
      ...validInput,
      email: "  Alex@Example.COM ",
    });
    expect(normalized.ok).toBe(true);
    if (normalized.ok) {
      expect(normalized.value.email).toBe("alex@example.com");
    }

    expect(validateHelpersInput({ ...validInput, email: "" }).ok).toBe(false);
    expect(
      validateHelpersInput({ ...validInput, email: "alexexample.com" }).ok,
    ).toBe(false);
  });

  it("rejects invalid Canadian postal sequences", () => {
    expect(
      validateHelpersInput({ ...validInput, postalCode: "D1D 1D1" }).ok,
    ).toBe(false);
    expect(
      validateHelpersInput({ ...validInput, postalCode: "12345" }).ok,
    ).toBe(false);
  });

  it("derives child-support and garden flags from interest keys", () => {
    const withBoth = validateHelpersInput({
      ...validInput,
      interestKeys: ["parent_present_childcare", "garden_outdoor"],
    });

    expect(withBoth.ok).toBe(true);
    if (withBoth.ok) {
      expect(withBoth.value.interestedInChildSupport).toBe(true);
      expect(withBoth.value.gardenCapability).toBe(true);
    }

    const without = validateHelpersInput(validInput);
    expect(without.ok).toBe(true);
    if (without.ok) {
      expect(without.value.interestedInChildSupport).toBe(false);
      expect(without.value.gardenCapability).toBe(false);
    }
  });

  it("rejects unknown interest, day, time, and hours keys", () => {
    expect(
      validateHelpersInput({
        ...validInput,
        interestKeys: ["not_a_real_interest"],
      }).ok,
    ).toBe(false);
    expect(
      validateHelpersInput({
        ...validInput,
        availableDays: ["monday", "funday"],
      }).ok,
    ).toBe(false);
    expect(
      validateHelpersInput({
        ...validInput,
        preferredTimeBlocks: ["midnight"],
      }).ok,
    ).toBe(false);
    expect(
      validateHelpersInput({
        ...validInput,
        preferredWeeklyHours: "all_day",
      }).ok,
    ).toBe(false);
  });

  it("accepts a complete valid payload", () => {
    const result = validateHelpersInput(validInput);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.preferredWeeklyHours).toBe("6_to_10");
      expect(result.value.futureOpportunitiesConsent).toBe(false);
      expect(result.value.documentOriginalFilename).toBe("experience.pdf");
    }
  });
});
