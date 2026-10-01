import { FIELD_ERROR_MESSAGES } from "./copy";
import {
  CONTACT_LIMITS,
  isContactHoneypotTripped,
  validateContactInput,
} from "./validation";

const validInput = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "416-555-0100",
  message: "Hello from the household.",
};

describe("contact validation", () => {
  it("accepts a valid contact submission", () => {
    const result = validateContactInput(validInput);

    expect(result).toEqual({
      ok: true,
      value: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        phone: "416-555-0100",
        message: "Hello from the household.",
      },
    });
  });

  it("requires a name", () => {
    const missing = validateContactInput({ ...validInput, name: "   " });

    expect(missing.ok).toBe(false);
    if (!missing.ok) {
      expect(missing.fieldErrors.name).toBe(FIELD_ERROR_MESSAGES.nameRequired);
      expect(missing.fieldErrors.email).toBeUndefined();
    }
  });

  it("requires an email", () => {
    const missing = validateContactInput({ ...validInput, email: "" });

    expect(missing.ok).toBe(false);
    if (!missing.ok) {
      expect(missing.fieldErrors.email).toBe(FIELD_ERROR_MESSAGES.emailRequired);
    }
  });

  it("rejects an invalid email", () => {
    for (const email of ["not-an-email", "ada@example", "ada example@x.com", "a@b"]) {
      const result = validateContactInput({ ...validInput, email });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.fieldErrors.email).toBe(FIELD_ERROR_MESSAGES.emailInvalid);
      }
    }
  });

  it("requires a message", () => {
    const missing = validateContactInput({ ...validInput, message: "  \n  " });

    expect(missing.ok).toBe(false);
    if (!missing.ok) {
      expect(missing.fieldErrors.message).toBe(FIELD_ERROR_MESSAGES.messageRequired);
    }
  });

  it("allows an optional phone", () => {
    for (const phone of [undefined, null, "", "   "]) {
      const result = validateContactInput({ ...validInput, phone });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.phone).toBeNull();
      }
    }

    const omitted = validateContactInput({
      name: validInput.name,
      email: validInput.email,
      message: validInput.message,
    });
    expect(omitted.ok).toBe(true);
    if (omitted.ok) {
      expect(omitted.value.phone).toBeNull();
    }

    const short = validateContactInput({ ...validInput, phone: " 1 " });
    expect(short.ok).toBe(true);
    if (short.ok) {
      expect(short.value.phone).toBe("1");
    }
  });

  it("enforces field length limits", () => {
    const tooLong = validateContactInput({
      name: "a".repeat(CONTACT_LIMITS.name + 1),
      email: `${"a".repeat(243)}@example.com`,
      phone: "1".repeat(CONTACT_LIMITS.phone + 1),
      message: "m".repeat(CONTACT_LIMITS.message + 1),
    });

    expect(tooLong.ok).toBe(false);
    if (!tooLong.ok) {
      expect(tooLong.fieldErrors.name).toBe(FIELD_ERROR_MESSAGES.nameLength);
      expect(tooLong.fieldErrors.email).toBe(FIELD_ERROR_MESSAGES.emailInvalid);
      expect(tooLong.fieldErrors.phone).toBe(FIELD_ERROR_MESSAGES.phoneInvalid);
      expect(tooLong.fieldErrors.message).toBe(FIELD_ERROR_MESSAGES.messageLength);
    }

    expect(`${"a".repeat(243)}@example.com`).toHaveLength(255);

    const atLimit = validateContactInput({
      name: "n".repeat(CONTACT_LIMITS.name),
      email: `${"a".repeat(242)}@example.com`,
      phone: "4".repeat(CONTACT_LIMITS.phone),
      message: "m".repeat(CONTACT_LIMITS.message),
    });
    expect(`${"a".repeat(242)}@example.com`).toHaveLength(254);
    expect(atLimit.ok).toBe(true);
  });

  it("normalizes whitespace without collapsing internal spaces or line breaks", () => {
    const result = validateContactInput({
      name: "  Ada  Lovelace  ",
      email: "  Ada@Example.COM ",
      phone: "  416 555 0100  ",
      message: "  Hello\n\nthere  ",
    });

    expect(result).toEqual({
      ok: true,
      value: {
        name: "Ada  Lovelace",
        email: "ada@example.com",
        phone: "416 555 0100",
        message: "Hello\n\nthere",
      },
    });
  });

  it("treats a filled honeypot as tripped and whitespace-only as empty", () => {
    expect(isContactHoneypotTripped({ companyWebsite: "https://spam.test" })).toBe(
      true,
    );
    expect(isContactHoneypotTripped({ companyWebsite: 12 })).toBe(true);
    expect(isContactHoneypotTripped({ companyWebsite: "   " })).toBe(false);
    expect(isContactHoneypotTripped({ companyWebsite: "" })).toBe(false);
    expect(isContactHoneypotTripped({ companyWebsite: null })).toBe(false);
    expect(isContactHoneypotTripped({})).toBe(false);

    const ignored = validateContactInput({
      ...validInput,
      companyWebsite: "https://spam.test",
      reason: "employment",
    });
    expect(ignored.ok).toBe(true);
    if (ignored.ok) {
      expect(ignored.value).toEqual({
        name: validInput.name,
        email: validInput.email,
        phone: validInput.phone,
        message: validInput.message,
      });
      expect(ignored.value).not.toHaveProperty("companyWebsite");
      expect(ignored.value).not.toHaveProperty("reason");
    }
  });
});
