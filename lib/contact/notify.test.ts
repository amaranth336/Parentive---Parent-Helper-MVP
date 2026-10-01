import {
  buildContactNotificationText,
  notifyContactInquiry,
  type ContactNotificationInquiry,
} from "./notify";

const inquiry: ContactNotificationInquiry = {
  id: "6f1c2c3e-1111-4111-8111-111111111111",
  createdAt: "2026-10-01T13:45:00.000Z",
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: null,
  message: "Line one\n\nLine two",
};

const ENV_KEYS = [
  "RESEND_API_KEY",
  "CONTACT_NOTIFICATION_FROM",
  "CONTACT_NOTIFICATION_TO",
] as const;

describe("contact notification", () => {
  const previous: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>> =
    {};

  beforeEach(() => {
    for (const key of ENV_KEYS) {
      previous[key] = process.env[key];
    }
    process.env.RESEND_API_KEY = "test-resend-key";
    process.env.CONTACT_NOTIFICATION_FROM =
      "Parentive <notifications@parentive.ca>";
    delete process.env.CONTACT_NOTIFICATION_TO;
  });

  afterEach(() => {
    for (const key of ENV_KEYS) {
      if (previous[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = previous[key];
      }
    }
    jest.restoreAllMocks();
  });

  it("includes name, email, phone or Not provided, message, timestamp, and inquiry id", () => {
    expect(buildContactNotificationText(inquiry)).toBe(
      [
        "New Parentive contact form submission",
        "",
        "Name:",
        "Ada Lovelace",
        "",
        "Email:",
        "ada@example.com",
        "",
        "Phone:",
        "Not provided",
        "",
        "Message:",
        "Line one",
        "",
        "Line two",
        "",
        "Submitted:",
        "2026-10-01T13:45:00.000Z",
        "",
        "Reference:",
        "6f1c2c3e-1111-4111-8111-111111111111",
      ].join("\n"),
    );

    expect(
      buildContactNotificationText({ ...inquiry, phone: "416-555-0100" }),
    ).toContain("Phone:\n416-555-0100");
  });

  it("posts plain text to Resend from the configured sender", async () => {
    const fetchImpl = jest.fn(async () => ({ ok: true, status: 200 }) as Response);
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

    const result = await notifyContactInquiry(
      { ...inquiry, phone: "416-555-0100" },
      { fetchImpl, now: new Date("2026-10-01T13:46:00.000Z") },
    );

    expect(result).toEqual({
      notification_status: "sent",
      notification_error: null,
      notification_sent_at: "2026-10-01T13:46:00.000Z",
    });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.method).toBe("POST");
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer test-resend-key");
    const payload = JSON.parse(String(init.body)) as {
      from: string;
      to: string[];
      reply_to: string;
      subject: string;
      text: string;
      html?: string;
    };
    expect(payload.from).toBe("Parentive <notifications@parentive.ca>");
    expect(payload.from).not.toContain("ada@example.com");
    expect(payload.to).toEqual(["admin@parentive.ca"]);
    expect(payload.reply_to).toBe("ada@example.com");
    expect(payload.subject).toBe("New Parentive contact form submission");
    expect(payload.html).toBeUndefined();
    expect(payload.text).toContain("Phone:\n416-555-0100");
    expect(payload.text).toContain("Message:\nLine one\n\nLine two");
    expect(payload.text).toContain("Submitted:\n2026-10-01T13:45:00.000Z");
    expect(payload.text).toContain(
      "Reference:\n6f1c2c3e-1111-4111-8111-111111111111",
    );
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("uses CONTACT_NOTIFICATION_TO when it is set", async () => {
    process.env.CONTACT_NOTIFICATION_TO = " ops@parentive.ca ";
    const fetchImpl = jest.fn(async () => ({ ok: true, status: 200 }) as Response);

    await notifyContactInquiry(inquiry, { fetchImpl });

    const payload = JSON.parse(
      String((fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1].body),
    ) as { to: string[] };
    expect(payload.to).toEqual(["ops@parentive.ca"]);
  });

  it("records missing email config without calling Resend", async () => {
    delete process.env.RESEND_API_KEY;
    const fetchImpl = jest.fn();
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

    const result = await notifyContactInquiry(inquiry, { fetchImpl });

    expect(result).toEqual({
      notification_status: "failed",
      notification_error: "missing_email_config",
      notification_sent_at: null,
    });
    expect(fetchImpl).not.toHaveBeenCalled();
    const logged = JSON.stringify(errorSpy.mock.calls);
    expect(logged).toContain(inquiry.id);
    expect(logged).not.toContain(inquiry.email);
    expect(logged).not.toContain("Line one");
  });

  it("records a Resend HTTP failure without logging message contents", async () => {
    delete process.env.CONTACT_NOTIFICATION_FROM;
    const missingFrom = await notifyContactInquiry(inquiry, { fetchImpl: jest.fn() });
    expect(missingFrom.notification_error).toBe("missing_email_config");

    process.env.CONTACT_NOTIFICATION_FROM = "Parentive <notifications@parentive.ca>";
    const fetchImpl = jest.fn(async () => ({ ok: false, status: 403 }) as Response);
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

    const result = await notifyContactInquiry(inquiry, { fetchImpl });

    expect(result).toEqual({
      notification_status: "failed",
      notification_error: "resend_http_403",
      notification_sent_at: null,
    });
    const logged = JSON.stringify(errorSpy.mock.calls);
    expect(logged).toContain(inquiry.id);
    expect(logged).toContain("403");
    expect(logged).not.toContain("test-resend-key");
    expect(logged).not.toContain(inquiry.email);
    expect(logged).not.toContain("Line one");
  });

  it("records a network failure as a short non-PII code", async () => {
    const fetchImpl = jest.fn(async () => {
      throw new Error("socket hang up ada@example.com");
    });

    const result = await notifyContactInquiry(inquiry, { fetchImpl });

    expect(result).toEqual({
      notification_status: "failed",
      notification_error: "resend_request_failed",
      notification_sent_at: null,
    });
  });
});
