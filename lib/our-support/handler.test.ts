import { FIELD_ERRORS, VISIT_ERRORS } from "@/lib/our-support/copy";
import { createIsolatedVisitRequestHandler } from "@/lib/our-support/handler";
import { buildVisitNotificationText } from "@/lib/our-support/notify";
import type { ServiceRoleClient } from "@/lib/our-support/submit";
import { validateVisitRequestInput } from "@/lib/our-support/validation";

const validBody = {
  name: "Ada Lovelace",
  email: "Ada@Example.com",
  postalCode: "L4G 1A1",
  preferredTimes: "Tuesday mornings",
  helperNotes: "Fold shirts on the shelf.",
  visitType: "one-time",
  serviceIds: ["S16"],
  subtotalCents: 8000,
};

describe("pilot visit handler", () => {
  it("stores the server price and acknowledges only after the insert succeeds", async () => {
    const submit = jest.fn(async () => ({
      ok: true as const,
      id: "visit-1",
      createdAt: "2026-10-23T16:00:00.000Z",
    }));
    const notify = jest.fn(async () => ({
      notification_status: "sent" as const,
      notification_error: null,
      notification_sent_at: "2026-10-23T16:01:00.000Z",
    }));
    const handle = createIsolatedVisitRequestHandler({
      getAdminClient: () => ({}) as ServiceRoleClient,
      submit,
      notify,
      recordNotification: async () => ({ ok: true }),
    });

    const result = await handle(validBody, { ip: "203.0.113.20" });

    expect(result).toEqual({ status: 200, body: { ok: true } });
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "ada@example.com",
        subtotalCents: 8000,
        quoteRequired: false,
        serviceIds: ["S16"],
      }),
      expect.any(Object),
    );
    expect(notify).toHaveBeenCalled();
  });

  it("rejects a mismatched subtotal before storage or email", async () => {
    const submit = jest.fn();
    const notify = jest.fn();
    const handle = createIsolatedVisitRequestHandler({
      getAdminClient: () => ({}) as ServiceRoleClient,
      submit,
      notify,
    });

    const result = await handle(
      { ...validBody, subtotalCents: 1 },
      { ip: "203.0.113.21" },
    );

    expect(result.status).toBe(400);
    expect(result.body).toMatchObject({
      ok: false,
      error: VISIT_ERRORS.validation,
      fieldErrors: { subtotalCents: FIELD_ERRORS.subtotalMismatch },
    });
    expect(submit).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it("asks for a service when none are selected", async () => {
    const submit = jest.fn();
    const handle = createIsolatedVisitRequestHandler({
      getAdminClient: () => ({}) as ServiceRoleClient,
      submit,
    });

    const result = await handle(
      { ...validBody, serviceIds: [], subtotalCents: 0 },
      { ip: "203.0.113.22" },
    );

    expect(result.status).toBe(400);
    expect(result.body).toMatchObject({
      fieldErrors: { services: FIELD_ERRORS.servicesRequired },
    });
    expect(submit).not.toHaveBeenCalled();
  });

  it("returns an honest unavailable state when storage is not configured", async () => {
    const submit = jest.fn();
    const handle = createIsolatedVisitRequestHandler({
      getAdminClient: () => null,
      submit,
      notify: jest.fn(),
    });

    const result = await handle(validBody, { ip: "203.0.113.22" });
    expect(result).toEqual({
      status: 503,
      body: { ok: false, error: VISIT_ERRORS.unavailable },
    });
    expect(submit).not.toHaveBeenCalled();
  });

  it("keeps a stored request successful when email delivery fails", async () => {
    const handle = createIsolatedVisitRequestHandler({
      getAdminClient: () => ({}) as ServiceRoleClient,
      submit: async () => ({
        ok: true,
        id: "visit-2",
        createdAt: "2026-10-23T16:00:00.000Z",
      }),
      notify: async () => ({
        notification_status: "failed",
        notification_error: "missing_email_config",
        notification_sent_at: null,
      }),
      recordNotification: async () => ({ ok: true }),
    });

    const result = await handle(validBody, { ip: "203.0.113.23" });
    expect(result).toEqual({ status: 200, body: { ok: true } });
  });

  it("does not claim success when the insert fails", async () => {
    const handle = createIsolatedVisitRequestHandler({
      getAdminClient: () => ({}) as ServiceRoleClient,
      submit: async () => ({ ok: false }),
      notify: jest.fn(),
    });

    const result = await handle(validBody, { ip: "203.0.113.24" });
    expect(result).toEqual({
      status: 500,
      body: { ok: false, error: VISIT_ERRORS.unexpected },
    });
  });
});

describe("pilot visit notification", () => {
  it("tells reviewers that washing time overlaps and is not hands-on", () => {
    const validated = validateVisitRequestInput({
      ...validBody,
      serviceIds: ["S01", "S08", "S12"],
      subtotalCents: 9200,
    });
    expect(validated.ok).toBe(true);
    if (!validated.ok) {
      return;
    }

    const text = buildVisitNotificationText({
      id: "visit-3",
      createdAt: "2026-10-23T16:00:00.000Z",
      request: validated.value,
    });
    expect(text).toContain("135-minute elapsed planning allowance");
    expect(text).toContain("not hands-on time");
    expect(text).toContain("not a confirmed booking");
    expect(text).toContain("Marketing consent:");
    expect(text).toContain("No");
  });
});
