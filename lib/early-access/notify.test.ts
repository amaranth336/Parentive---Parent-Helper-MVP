import {
  buildEarlyAccessNotificationText,
  notifyEarlyAccessRegistration,
  type EarlyAccessNotificationRegistration,
} from "./notify";

const registration: EarlyAccessNotificationRegistration = {
  id: "6f1c2c3e-2222-4222-8222-222222222222",
  createdAt: "2026-10-19T15:00:00.000Z",
  firstName: "Alex",
  email: "alex@example.com",
  postalCode: "L4G 1A1",
  serviceAreaStatus: "in_pilot",
  serviceAreaCommunity: "Aurora",
  serviceInterests: ["home_tidying", "other"],
  serviceInterestOther: "Seasonal closet reset",
  frequency: "weekly",
  frequencyOther: null,
  marketingConsent: false,
};

describe("early-access notification", () => {
  const previousKey = process.env.RESEND_API_KEY;
  const previousFrom = process.env.CONTACT_NOTIFICATION_FROM;
  const previousTo = process.env.CONTACT_NOTIFICATION_TO;

  beforeEach(() => {
    process.env.RESEND_API_KEY = "test-resend-key";
    process.env.CONTACT_NOTIFICATION_FROM =
      "Parentive <notifications@parentive.ca>";
    delete process.env.CONTACT_NOTIFICATION_TO;
  });

  afterEach(() => {
    if (previousKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previousKey;
    if (previousFrom === undefined) delete process.env.CONTACT_NOTIFICATION_FROM;
    else process.env.CONTACT_NOTIFICATION_FROM = previousFrom;
    if (previousTo === undefined) delete process.env.CONTACT_NOTIFICATION_TO;
    else process.env.CONTACT_NOTIFICATION_TO = previousTo;
    jest.restoreAllMocks();
  });

  it("includes the registration details an admin needs to follow up", () => {
    const text = buildEarlyAccessNotificationText(registration);
    expect(text).toContain("Name:\nAlex");
    expect(text).toContain("Email:\nalex@example.com");
    expect(text).toContain("Postal code:\nL4G 1A1");
    expect(text).toContain("Area:\nIn pilot (Aurora)");
    expect(text).toContain("Interests:\nHome tidying, Other");
    expect(text).toContain("Other interest:\nSeasonal closet reset");
    expect(text).toContain("Frequency:\nRecurring weekly");
    expect(text).toContain("Frequency detail:\nNot provided");
    expect(text).toContain("Marketing consent:\nNo");
    expect(text).toContain(`Reference:\n${registration.id}`);
  });

  it("posts plain text to the same admin recipient as contact", async () => {
    const fetchImpl = jest.fn(async () => ({ ok: true, status: 200 }) as Response);

    const result = await notifyEarlyAccessRegistration(registration, {
      fetchImpl,
      now: new Date("2026-10-19T15:01:00.000Z"),
    });

    expect(result.notification_status).toBe("sent");
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    const payload = JSON.parse(String(init.body)) as {
      from: string;
      to: string[];
      reply_to: string;
      subject: string;
    };
    expect(payload.from).toBe("Parentive <notifications@parentive.ca>");
    expect(payload.to).toEqual(["admin@parentive.ca"]);
    expect(payload.reply_to).toBe("alex@example.com");
    expect(payload.subject).toBe("New Parentive early-access registration");
  });

  it("records missing email config without calling Resend or logging the address", async () => {
    delete process.env.RESEND_API_KEY;
    const fetchImpl = jest.fn();
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

    const result = await notifyEarlyAccessRegistration(registration, { fetchImpl });

    expect(result).toEqual({
      notification_status: "failed",
      notification_error: "missing_email_config",
      notification_sent_at: null,
    });
    expect(fetchImpl).not.toHaveBeenCalled();
    const logged = JSON.stringify(errorSpy.mock.calls);
    expect(logged).toContain(registration.id);
    expect(logged).not.toContain(registration.email);
  });
});
