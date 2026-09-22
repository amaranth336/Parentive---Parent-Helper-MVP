import { POSTAL_PLACEHOLDER } from "./copy";
import {
  FIELD_ERROR_MESSAGES,
  maskPostalCode,
  validateEarlyAccessInput,
} from "./validation";

const validInput = {
  firstName: "Alex",
  email: "alex@example.com",
  postalCode: "L3Y 4S2",
  serviceInterests: [] as string[],
  serviceInterestOther: "",
  frequency: "",
  frequencyOther: "",
  pilotContactConsent: true,
  marketingConsent: false,
};

describe("early-access validation", () => {
  it("requires first name, email, postal code, and pilot consent", () => {
    const result = validateEarlyAccessInput({});

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    expect(result.fieldErrors.firstName).toBe(FIELD_ERROR_MESSAGES.firstNameRequired);
    expect(result.fieldErrors.email).toBe(FIELD_ERROR_MESSAGES.emailRequired);
    expect(result.fieldErrors.postalCode).toBe(FIELD_ERROR_MESSAGES.postalRequired);
    expect(result.fieldErrors.pilotContactConsent).toBe(
      FIELD_ERROR_MESSAGES.pilotConsentRequired,
    );
  });

  it("rejects whitespace-only first names", () => {
    const result = validateEarlyAccessInput({
      ...validInput,
      firstName: "   ",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.firstName).toBe(FIELD_ERROR_MESSAGES.firstNameRequired);
    }
  });

  it("trims and lowercases email and rejects missing or malformed values", () => {
    const normalized = validateEarlyAccessInput({
      ...validInput,
      email: "  Alex@Example.COM ",
    });
    expect(normalized.ok).toBe(true);
    if (normalized.ok) {
      expect(normalized.value.email).toBe("alex@example.com");
    }

    expect(validateEarlyAccessInput({ ...validInput, email: "" }).ok).toBe(false);
    expect(validateEarlyAccessInput({ ...validInput, email: "alexexample.com" }).ok).toBe(
      false,
    );
    expect(validateEarlyAccessInput({ ...validInput, email: "alex@example@com" }).ok).toBe(
      false,
    );
    expect(validateEarlyAccessInput({ ...validInput, email: "alex example@x.com" }).ok).toBe(
      false,
    );
  });

  it("masks postal codes and does not treat the placeholder as a default", () => {
    expect(maskPostalCode("l3y4s2")).toBe("L3Y 4S2");
    expect(maskPostalCode("a1a1a1")).toBe("A1A 1A1");
    expect(maskPostalCode("")).toBe("");
    expect(POSTAL_PLACEHOLDER).toBe("A1A 1A1");
    expect(validInput.postalCode).not.toBe(POSTAL_PLACEHOLDER);
  });

  it("rejects invalid Canadian postal sequences", () => {
    expect(validateEarlyAccessInput({ ...validInput, postalCode: "D1D 1D1" }).ok).toBe(
      false,
    );
    expect(validateEarlyAccessInput({ ...validInput, postalCode: "12345" }).ok).toBe(false);
    expect(validateEarlyAccessInput({ ...validInput, postalCode: "" }).ok).toBe(false);
  });

  it("accepts valid Canadian codes outside the catchment", () => {
    const toronto = validateEarlyAccessInput({
      ...validInput,
      postalCode: "M5V 2T6",
    });
    const ottawa = validateEarlyAccessInput({
      ...validInput,
      postalCode: "K1A 0A6",
    });

    expect(toronto.ok).toBe(true);
    expect(ottawa.ok).toBe(true);
  });

  it("allows multiple service-interest selections", () => {
    const result = validateEarlyAccessInput({
      ...validInput,
      serviceInterests: ["home_laundry", "kitchen_meal", "family"],
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.serviceInterests).toEqual([
        "home_laundry",
        "kitchen_meal",
        "family",
      ]);
    }
  });

  it("drops other-interest text unless other_support is selected", () => {
    const dropped = validateEarlyAccessInput({
      ...validInput,
      serviceInterests: ["home_laundry"],
      serviceInterestOther: "Help with garden beds",
    });
    const kept = validateEarlyAccessInput({
      ...validInput,
      serviceInterests: ["other_support"],
      serviceInterestOther: "Help with garden beds",
    });

    expect(dropped.ok).toBe(true);
    if (dropped.ok) {
      expect(dropped.value.serviceInterestOther).toBeNull();
    }

    expect(kept.ok).toBe(true);
    if (kept.ok) {
      expect(kept.value.serviceInterestOther).toBe("Help with garden beds");
    }
  });

  it("treats frequency as a single optional choice and drops other text unless other is selected", () => {
    const weekly = validateEarlyAccessInput({
      ...validInput,
      frequency: "weekly",
      frequencyOther: "Every third Thursday",
    });
    const other = validateEarlyAccessInput({
      ...validInput,
      frequency: "other",
      frequencyOther: "Every third Thursday",
    });
    const invalid = validateEarlyAccessInput({
      ...validInput,
      frequency: ["weekly", "monthly"],
    });

    expect(weekly.ok).toBe(true);
    if (weekly.ok) {
      expect(weekly.value.frequency).toBe("weekly");
      expect(weekly.value.frequencyOther).toBeNull();
    }

    expect(other.ok).toBe(true);
    if (other.ok) {
      expect(other.value.frequencyOther).toBe("Every third Thursday");
    }

    expect(invalid.ok).toBe(false);
  });

  it("treats marketing as optional and rejects missing pilot consent", () => {
    const missingMarketing = validateEarlyAccessInput({
      firstName: "Alex",
      email: "alex@example.com",
      postalCode: "L3Y 4S2",
      pilotContactConsent: true,
    });
    const missingPilot = validateEarlyAccessInput({
      ...validInput,
      pilotContactConsent: false,
      marketingConsent: true,
    });

    expect(missingMarketing.ok).toBe(true);
    if (missingMarketing.ok) {
      expect(missingMarketing.value.marketingConsent).toBe(false);
    }

    expect(missingPilot.ok).toBe(false);
    if (!missingPilot.ok) {
      expect(missingPilot.fieldErrors.pilotContactConsent).toBe(
        FIELD_ERROR_MESSAGES.pilotConsentRequired,
      );
    }
  });
});
