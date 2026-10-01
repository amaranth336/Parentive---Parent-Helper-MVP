import { CONTACT_ERRORS } from "./copy";
import { createIsolatedContactHandler } from "./handler";
import type { ContactNotificationResult } from "./notify";
import { notifyContactInquiry } from "./notify";
import {
  recordContactNotification,
  submitContactInquiry,
  type ServiceRoleClient,
} from "./submit";
import { createSlidingWindowLimiter } from "@/lib/early-access/rate-limit";

const validBody = {
  name: "Ada Lovelace",
  email: "Ada@Example.com",
  phone: "  416-555-0100  ",
  message: "  Hello from the household  ",
  reason: "booking",
};

type StoredState = {
  inserted?: unknown;
  updated?: unknown;
  insertError?: boolean;
  updateError?: boolean;
};

function createMockClient(state: StoredState): ServiceRoleClient {
  const client = {
    from(table: string) {
      if (table !== "contact_inquiries") {
        throw new Error(`unexpected table ${table}`);
      }
      return {
        insert(row: unknown) {
          state.inserted = row;
          return {
            select() {
              return {
                async single() {
                  if (state.insertError) {
                    return { data: null, error: { message: "db down" } };
                  }
                  return {
                    data: {
                      id: "inquiry-1",
                      created_at: "2026-10-01T13:45:00.000Z",
                    },
                    error: null,
                  };
                },
              };
            },
          };
        },
        update(patch: unknown) {
          state.updated = patch;
          return {
            async eq() {
              if (state.updateError) {
                return { error: { message: "update failed" } };
              }
              return { error: null };
            },
          };
        },
      };
    },
  };

  return client as unknown as ServiceRoleClient;
}

describe("contact handler", () => {
  const previousKey = process.env.RESEND_API_KEY;
  const previousFrom = process.env.CONTACT_NOTIFICATION_FROM;
  const previousTo = process.env.CONTACT_NOTIFICATION_TO;

  beforeEach(() => {
    process.env.RESEND_API_KEY = "test-resend-key";
    process.env.CONTACT_NOTIFICATION_FROM = "Parentive <notifications@parentive.ca>";
    delete process.env.CONTACT_NOTIFICATION_TO;
  });

  afterEach(() => {
    if (previousKey === undefined) {
      delete process.env.RESEND_API_KEY;
    } else {
      process.env.RESEND_API_KEY = previousKey;
    }
    if (previousFrom === undefined) {
      delete process.env.CONTACT_NOTIFICATION_FROM;
    } else {
      process.env.CONTACT_NOTIFICATION_FROM = previousFrom;
    }
    if (previousTo === undefined) {
      delete process.env.CONTACT_NOTIFICATION_TO;
    } else {
      process.env.CONTACT_NOTIFICATION_TO = previousTo;
    }
    jest.restoreAllMocks();
  });

  it("accepts a valid contact submission and normalizes stored fields", async () => {
    const submit = jest.fn(async () => ({
      ok: true as const,
      id: "inquiry-1",
      createdAt: "2026-10-01T13:45:00.000Z",
    }));
    const notify = jest.fn(
      async (): Promise<ContactNotificationResult> => ({
        notification_status: "sent",
        notification_error: null,
        notification_sent_at: "2026-10-01T13:46:00.000Z",
      }),
    );
    const handle = createIsolatedContactHandler({
      getAdminClient: () => ({}) as ServiceRoleClient,
      submit,
      notify,
      recordNotification: async () => ({ ok: true }),
    });

    const result = await handle(validBody, { ip: "203.0.113.10" });

    expect(result).toEqual({ status: 200, body: { ok: true } });
    expect(submit).toHaveBeenCalledWith(
      {
        name: "Ada Lovelace",
        email: "ada@example.com",
        phone: "416-555-0100",
        message: "Hello from the household",
      },
      expect.any(Object),
    );
    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "inquiry-1",
        createdAt: "2026-10-01T13:45:00.000Z",
        email: "ada@example.com",
      }),
    );
  });

  it("rejects a honeypot without inserting or emailing", async () => {
    const submit = jest.fn();
    const notify = jest.fn();
    const handle = createIsolatedContactHandler({
      getAdminClient: () => ({}) as ServiceRoleClient,
      submit,
      notify,
    });

    const result = await handle(
      { ...validBody, companyWebsite: "https://spam.test" },
      { ip: "203.0.113.11" },
    );

    expect(result).toEqual({
      status: 400,
      body: { ok: false, error: CONTACT_ERRORS.validation },
    });
    expect(JSON.stringify(result.body)).not.toMatch(/honeypot|companyWebsite/i);
    expect(submit).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it("allows a whitespace-only honeypot", async () => {
    const submit = jest.fn(async () => ({
      ok: true as const,
      id: "inquiry-1",
      createdAt: "2026-10-01T13:45:00.000Z",
    }));
    const handle = createIsolatedContactHandler({
      getAdminClient: () => ({}) as ServiceRoleClient,
      submit,
      notify: async () => ({
        notification_status: "sent",
        notification_error: null,
        notification_sent_at: "2026-10-01T13:46:00.000Z",
      }),
      recordNotification: async () => ({ ok: true }),
    });

    const result = await handle(
      { ...validBody, companyWebsite: "   " },
      { ip: "203.0.113.12" },
    );

    expect(result.status).toBe(200);
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("rate limits the 6th request in a 10 minute window", async () => {
    const submit = jest.fn(async () => ({
      ok: true as const,
      id: "inquiry-1",
      createdAt: "2026-10-01T13:45:00.000Z",
    }));
    const limiter = createSlidingWindowLimiter();
    const start = 1_700_000_000_000;
    for (let index = 0; index < 5; index += 1) {
      expect(limiter.isLimited("203.0.113.20", start + index)).toBe(false);
    }
    expect(limiter.isLimited("203.0.113.20", start + 5)).toBe(true);
    expect(limiter.isLimited("203.0.113.20", start + 10 * 60 * 1000 + 1)).toBe(
      false,
    );

    const limitedHandle = createIsolatedContactHandler({
      getAdminClient: () => ({}) as ServiceRoleClient,
      submit,
      notify: async () => ({
        notification_status: "sent",
        notification_error: null,
        notification_sent_at: "2026-10-01T13:46:00.000Z",
      }),
      recordNotification: async () => ({ ok: true }),
    });

    for (let index = 0; index < 5; index += 1) {
      const allowed = await limitedHandle(validBody, { ip: "198.51.100.8" });
      expect(allowed.status).toBe(200);
    }

    const limited = await limitedHandle(validBody, { ip: "198.51.100.8" });
    expect(limited).toEqual({
      status: 429,
      body: { ok: false, error: CONTACT_ERRORS.rateLimit },
    });
    expect(submit).toHaveBeenCalledTimes(5);
  });

  it("returns 400 for a non-object body", async () => {
    const submit = jest.fn();
    const handle = createIsolatedContactHandler({
      getAdminClient: () => ({}) as ServiceRoleClient,
      submit,
    });

    const result = await handle(["nope"], { ip: "203.0.113.21" });
    expect(result.status).toBe(400);
    expect(result.body).toEqual({
      ok: false,
      error: CONTACT_ERRORS.validation,
    });
    expect(submit).not.toHaveBeenCalled();
  });

  it("returns 503 when the service-role client is missing", async () => {
    const submit = jest.fn();
    const handle = createIsolatedContactHandler({
      getAdminClient: () => null,
      submit,
    });

    const result = await handle(validBody, { ip: "203.0.113.22" });
    expect(result).toEqual({
      status: 503,
      body: { ok: false, error: CONTACT_ERRORS.unavailable },
    });
    expect(submit).not.toHaveBeenCalled();
  });

  it("returns 500 when Supabase insertion fails and does not email", async () => {
    const fetchImpl = jest.fn();
    const state: StoredState = { insertError: true };
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    const handle = createIsolatedContactHandler({
      getAdminClient: () => createMockClient(state),
      submit: submitContactInquiry,
      notify: (inquiry) => notifyContactInquiry(inquiry, { fetchImpl }),
    });

    const result = await handle(validBody, { ip: "203.0.113.23" });

    expect(result).toEqual({
      status: 500,
      body: { ok: false, error: CONTACT_ERRORS.unexpected },
    });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(state.updated).toBeUndefined();
  });

  it("confirms after successful storage and successful email notification", async () => {
    const state: StoredState = {};
    const fetchImpl = jest.fn(async () => ({ ok: true, status: 200 }) as Response);
    const handle = createIsolatedContactHandler({
      getAdminClient: () => createMockClient(state),
      submit: submitContactInquiry,
      notify: (inquiry) => notifyContactInquiry(inquiry, { fetchImpl }),
      recordNotification: recordContactNotification,
    });

    const result = await handle(
      { ...validBody, phone: "" },
      { ip: "203.0.113.24" },
    );

    expect(result).toEqual({ status: 200, body: { ok: true } });
    expect(state.inserted).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      phone: null,
      message: "Hello from the household",
    });
    const payload = JSON.parse(
      String((fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1].body),
    ) as { text: string; from: string };
    expect(payload.text).toContain("Name:\nAda Lovelace");
    expect(payload.text).toContain("Email:\nada@example.com");
    expect(payload.text).toContain("Phone:\nNot provided");
    expect(payload.text).toContain("Message:\nHello from the household");
    expect(payload.text).toContain("Submitted:\n2026-10-01T13:45:00.000Z");
    expect(payload.text).toContain("Reference:\ninquiry-1");
    expect(payload.from).not.toContain("ada@example.com");
    expect(state.updated).toEqual(
      expect.objectContaining({
        notification_status: "sent",
        notification_error: null,
      }),
    );
  });

  it("keeps the row and confirms when email notification fails", async () => {
    const state: StoredState = {};
    const fetchImpl = jest.fn(async () => ({ ok: false, status: 403 }) as Response);
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const handle = createIsolatedContactHandler({
      getAdminClient: () => createMockClient(state),
      submit: submitContactInquiry,
      notify: (inquiry) => notifyContactInquiry(inquiry, { fetchImpl }),
      recordNotification: recordContactNotification,
    });

    const result = await handle(validBody, { ip: "203.0.113.25" });

    expect(result).toEqual({ status: 200, body: { ok: true } });
    expect(state.inserted).toEqual(
      expect.objectContaining({ email: "ada@example.com" }),
    );
    expect(state.updated).toEqual({
      notification_status: "failed",
      notification_error: "resend_http_403",
      notification_sent_at: null,
    });
    const logged = JSON.stringify(errorSpy.mock.calls);
    expect(logged).toContain("inquiry-1");
    expect(logged).toContain("403");
    expect(logged).not.toContain("ada@example.com");
    expect(logged).not.toContain("test-resend-key");
    expect(logged).not.toContain("Hello from the household");
  });

  it("still confirms when the notification update fails", async () => {
    const state: StoredState = { updateError: true };
    const fetchImpl = jest.fn(async () => ({ ok: true, status: 200 }) as Response);
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const handle = createIsolatedContactHandler({
      getAdminClient: () => createMockClient(state),
      submit: submitContactInquiry,
      notify: (inquiry) => notifyContactInquiry(inquiry, { fetchImpl }),
      recordNotification: recordContactNotification,
    });

    const result = await handle(validBody, { ip: "203.0.113.26" });

    expect(result).toEqual({ status: 200, body: { ok: true } });
    expect(state.inserted).toBeDefined();
    const logged = JSON.stringify(errorSpy.mock.calls);
    expect(logged).toContain("inquiry-1");
    expect(logged).toContain("sent");
    expect(logged).not.toContain("ada@example.com");
  });
});
