import { HELPERS_ERRORS } from "./copy";
import { createIsolatedHelpersHandler } from "./handler";
import { isVerifiedHelpersSuccess } from "./response";
import type { ServiceRoleClient } from "./submit";

const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]);

function buildValidFormData(): FormData {
  const formData = new FormData();
  formData.set("firstName", "Alex");
  formData.set("lastName", "Rivera");
  formData.set("email", "alex@example.com");
  formData.set("telephone", "416-555-0100");
  formData.set("postalCode", "L4G 1A1");
  formData.append("interestKeys", "laundry_household_resets");
  formData.set("experienceText", "Relevant household experience.");
  formData.set("motivationText", "I want to help families.");
  formData.append("availableDays", "monday");
  formData.append("preferredTimeBlocks", "mornings");
  formData.set("preferredWeeklyHours", "6_to_10");
  formData.set("age18Confirmed", "true");
  formData.set("workEligibleCanada", "true");
  formData.set("hasOwnVehicle", "true");
  formData.set("screeningAcknowledgement", "true");
  formData.set("applicationConsent", "true");
  formData.set("futureOpportunitiesConsent", "false");
  formData.set(
    "document",
    new File([pdfBytes], "experience.pdf", { type: "application/pdf" }),
  );
  return formData;
}

const fakeClient = {} as ServiceRoleClient;

describe("helpers handler", () => {
  it("returns 400 validation fieldErrors", async () => {
    const handle = createIsolatedHelpersHandler({
      getAdminClient: () => fakeClient,
      submit: async () => ({ ok: true }),
    });

    const result = await handle(new FormData(), { ip: "1.1.1.1" });

    expect(result.status).toBe(400);
    expect(result.body.ok).toBe(false);
    if (!result.body.ok) {
      expect(result.body.fieldErrors).toEqual(
        expect.objectContaining({
          firstName: expect.any(String),
          email: expect.any(String),
          postalCode: expect.any(String),
          applicationConsent: expect.any(String),
        }),
      );
    }
  });

  it("returns 429 on the 4th request from the same IP", async () => {
    const handle = createIsolatedHelpersHandler({
      getAdminClient: () => fakeClient,
      submit: async () => ({ ok: true }),
    });

    for (let index = 0; index < 3; index += 1) {
      const allowed = await handle(buildValidFormData(), { ip: "9.9.9.9" });
      expect(allowed.status).toBe(200);
    }

    const limited = await handle(buildValidFormData(), { ip: "9.9.9.9" });
    expect(limited.status).toBe(429);
    expect(limited.body).toEqual({
      ok: false,
      error: HELPERS_ERRORS.rateLimit,
    });
  });

  it("rejects oversized files before reading bytes into memory", async () => {
    const handle = createIsolatedHelpersHandler({
      getAdminClient: () => fakeClient,
      submit: async () => ({ ok: true }),
      validateDocument: () => {
        throw new Error("validateDocument should not run for oversized files");
      },
    });

    const formData = buildValidFormData();
    const oversized = new File([new Uint8Array(5_242_881)], "huge.pdf", {
      type: "application/pdf",
    });
    Object.defineProperty(oversized, "arrayBuffer", {
      value: async () => {
        throw new Error("arrayBuffer should not be called");
      },
    });
    formData.set("document", oversized);

    const result = await handle(formData, { ip: "7.7.7.7" });
    expect(result.status).toBe(400);
    expect(result.body.ok).toBe(false);
    if (!result.body.ok) {
      expect(result.body.fieldErrors?.document).toMatch(/5 MB/i);
    }
  });

  it("returns 503 when config is missing", async () => {
    const handle = createIsolatedHelpersHandler({
      getAdminClient: () => null,
      submit: async () => ({ ok: true }),
    });

    const result = await handle(buildValidFormData(), { ip: "2.2.2.2" });
    expect(result.status).toBe(503);
    expect(result.body).toEqual({
      ok: false,
      error: HELPERS_ERRORS.unavailable,
    });
  });

  it("returns 200 only on verified submit", async () => {
    const submit = jest.fn(async () => ({ ok: true as const }));
    const handle = createIsolatedHelpersHandler({
      getAdminClient: () => fakeClient,
      submit,
    });

    const result = await handle(buildValidFormData(), { ip: "3.3.3.3" });
    expect(result).toEqual({ status: 200, body: { ok: true } });
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("returns 500 on a failed write", async () => {
    const handle = createIsolatedHelpersHandler({
      getAdminClient: () => fakeClient,
      submit: async () => ({ ok: false, error: "write failed" }),
    });

    const result = await handle(buildValidFormData(), { ip: "5.5.5.5" });
    expect(result.status).toBe(500);
    expect(result.body).toEqual({
      ok: false,
      error: HELPERS_ERRORS.unexpected,
    });
  });

  it("treats only HTTP success plus ok:true as a verified application", () => {
    expect(isVerifiedHelpersSuccess(true, { ok: true })).toBe(true);
    expect(isVerifiedHelpersSuccess(true, { ok: false, error: "nope" })).toBe(
      false,
    );
    expect(isVerifiedHelpersSuccess(true, { created: true })).toBe(false);
    expect(isVerifiedHelpersSuccess(false, { ok: true })).toBe(false);
    expect(isVerifiedHelpersSuccess(true, null)).toBe(false);
  });
});
