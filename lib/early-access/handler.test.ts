import { EARLY_ACCESS_ERRORS } from "./copy";
import { createIsolatedEarlyAccessHandler } from "./handler";
import { isVerifiedEarlyAccessSuccess } from "./response";
import type { ServiceRoleClient } from "./submit";
import type { ValidatedEarlyAccess } from "./validation";

const validBody = {
  firstName: "Alex",
  email: "alex@example.com",
  postalCode: "L4G 1A1",
  serviceInterests: ["home_laundry"],
  pilotContactConsent: true,
  marketingConsent: false,
};

const fakeClient = {} as ServiceRoleClient;

describe("early-access handler", () => {
  it("returns 400 validation fieldErrors", async () => {
    const handle = createIsolatedEarlyAccessHandler({
      getAdminClient: () => fakeClient,
      submit: async () => ({ ok: true }),
    });

    const result = await handle({}, { ip: "1.1.1.1" });

    expect(result.status).toBe(400);
    expect(result.body.ok).toBe(false);
    if (!result.body.ok) {
      expect(result.body.fieldErrors).toEqual(
        expect.objectContaining({
          firstName: expect.any(String),
          email: expect.any(String),
          postalCode: expect.any(String),
          pilotContactConsent: expect.any(String),
        }),
      );
    }
  });

  it("returns 429 on the 6th request from the same IP", async () => {
    const handle = createIsolatedEarlyAccessHandler({
      getAdminClient: () => fakeClient,
      submit: async () => ({ ok: true }),
    });

    for (let index = 0; index < 5; index += 1) {
      const allowed = await handle(validBody, { ip: "9.9.9.9" });
      expect(allowed.status).toBe(200);
    }

    const limited = await handle(validBody, { ip: "9.9.9.9" });
    expect(limited.status).toBe(429);
    expect(limited.body).toEqual({
      ok: false,
      error: EARLY_ACCESS_ERRORS.rateLimit,
    });
  });

  it("returns 503 when config is missing", async () => {
    const handle = createIsolatedEarlyAccessHandler({
      getAdminClient: () => null,
      submit: async () => ({ ok: true }),
    });

    const result = await handle(validBody, { ip: "2.2.2.2" });
    expect(result.status).toBe(503);
    expect(result.body).toEqual({
      ok: false,
      error: EARLY_ACCESS_ERRORS.unavailable,
    });
  });

  it("returns 200 on a verified insert", async () => {
    const submit = jest.fn(async () => ({ ok: true as const }));
    const handle = createIsolatedEarlyAccessHandler({
      getAdminClient: () => fakeClient,
      submit,
    });

    const result = await handle(validBody, { ip: "3.3.3.3" });
    expect(result).toEqual({ status: 200, body: { ok: true } });
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("returns 200 on a verified duplicate without leaking existence", async () => {
    const submit = jest.fn(
      async (_value: ValidatedEarlyAccess) => ({ ok: true as const }),
    );
    const handle = createIsolatedEarlyAccessHandler({
      getAdminClient: () => fakeClient,
      submit,
    });

    const result = await handle(validBody, { ip: "4.4.4.4" });
    expect(result).toEqual({ status: 200, body: { ok: true } });
    expect(JSON.stringify(result.body)).not.toMatch(/already|registered|exists/i);
  });

  it("returns 500 on a failed write", async () => {
    const handle = createIsolatedEarlyAccessHandler({
      getAdminClient: () => fakeClient,
      submit: async () => ({ ok: false, error: "write failed" }),
    });

    const result = await handle(validBody, { ip: "5.5.5.5" });
    expect(result.status).toBe(500);
    expect(result.body).toEqual({
      ok: false,
      error: EARLY_ACCESS_ERRORS.unexpected,
    });
  });

  it("treats only HTTP success plus ok:true as a verified registration", () => {
    expect(isVerifiedEarlyAccessSuccess(true, { ok: true })).toBe(true);
    expect(isVerifiedEarlyAccessSuccess(true, { ok: false, error: "nope" })).toBe(
      false,
    );
    expect(isVerifiedEarlyAccessSuccess(true, { created: true })).toBe(false);
    expect(isVerifiedEarlyAccessSuccess(false, { ok: true })).toBe(false);
    expect(isVerifiedEarlyAccessSuccess(true, null)).toBe(false);
    expect(isVerifiedEarlyAccessSuccess(false, { ok: false })).toBe(false);
  });
});
