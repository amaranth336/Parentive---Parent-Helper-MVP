import { EARLY_ACCESS_ERRORS } from "./copy";
import { createIsolatedEarlyAccessHandler } from "./handler";
import { isVerifiedEarlyAccessSuccess } from "./response";
import type { ServiceRoleClient } from "./submit";
import type { ValidatedEarlyAccess } from "./validation";

const validBody = {
  firstName: "Alex",
  email: "alex@example.com",
  postalCode: "L4G 1A1",
  serviceInterests: ["home_tidying"],
  pilotContactConsent: true,
  marketingConsent: false,
};

const fakeClient = {} as ServiceRoleClient;

const duplicateResult = { ok: true as const, duplicate: true as const };

const createdResult = {
  ok: true as const,
  duplicate: false as const,
  id: "created-1",
  createdAt: "2026-10-19T15:00:00.000Z",
};

const sentNotification = {
  notification_status: "sent" as const,
  notification_error: null,
  notification_sent_at: "2026-10-19T15:00:01.000Z",
};

describe("early-access handler", () => {
  it("returns 400 validation fieldErrors", async () => {
    const handle = createIsolatedEarlyAccessHandler({
      getAdminClient: () => fakeClient,
      submit: async () => duplicateResult,
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
      submit: async () => duplicateResult,
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
      submit: async () => duplicateResult,
    });

    const result = await handle(validBody, { ip: "2.2.2.2" });
    expect(result.status).toBe(503);
    expect(result.body).toEqual({
      ok: false,
      error: EARLY_ACCESS_ERRORS.unavailable,
    });
  });

  it("returns 200 on a verified insert and emails the admin once", async () => {
    const submit = jest.fn(async () => createdResult);
    const notify = jest.fn(async () => sentNotification);
    const recordNotification = jest.fn(async () => ({ ok: true as const }));
    const handle = createIsolatedEarlyAccessHandler({
      getAdminClient: () => fakeClient,
      submit,
      notify,
      recordNotification,
    });

    const result = await handle(validBody, { ip: "3.3.3.3" });
    expect(result).toEqual({ status: 200, body: { ok: true } });
    expect(submit).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "created-1",
        email: "alex@example.com",
        serviceAreaStatus: "in_pilot",
        serviceAreaCommunity: "Aurora",
        serviceInterests: ["home_tidying"],
      }),
    );
    expect(recordNotification).toHaveBeenCalledWith(
      fakeClient,
      "created-1",
      sentNotification,
    );
  });

  it("returns 200 on a verified duplicate without a second email", async () => {
    const notify = jest.fn();
    const submit = jest.fn(
      async (_value: ValidatedEarlyAccess) => duplicateResult,
    );
    const handle = createIsolatedEarlyAccessHandler({
      getAdminClient: () => fakeClient,
      submit,
      notify,
    });

    const result = await handle(validBody, { ip: "4.4.4.4" });
    expect(result).toEqual({ status: 200, body: { ok: true } });
    expect(JSON.stringify(result.body)).not.toMatch(/already|registered|exists/i);
    expect(notify).not.toHaveBeenCalled();
  });

  it("returns 200 when the admin email fails", async () => {
    const recordNotification = jest.fn(async () => ({ ok: true as const }));
    const handle = createIsolatedEarlyAccessHandler({
      getAdminClient: () => fakeClient,
      submit: async () => createdResult,
      notify: async () => {
        throw new Error("resend down");
      },
      recordNotification,
    });

    const result = await handle(validBody, { ip: "6.6.6.6" });
    expect(result).toEqual({ status: 200, body: { ok: true } });
    expect(recordNotification).toHaveBeenCalledWith(
      fakeClient,
      "created-1",
      expect.objectContaining({
        notification_status: "failed",
        notification_error: "resend_request_failed",
      }),
    );
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
