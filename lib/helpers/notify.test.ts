import {
  buildHelperNotificationText,
  notifyHelperApplication,
  type HelperNotificationApplication,
} from "./notify";

const application: HelperNotificationApplication = {
  id: "6f1c2c3e-3333-4333-8333-333333333333",
  createdAt: "2026-10-19T15:00:00.000Z",
  firstName: "Alex",
  lastName: "Rivera",
  email: "alex@example.com",
  telephone: "416-555-0100",
  postalCode: "L4G 1A1",
  interestKeys: ["laundry_household_resets"],
  interestedInChildSupport: false,
  gardenCapability: true,
  experienceText: "Relevant household experience.",
  motivationText: "I want to help families.",
  availableDays: ["monday"],
  preferredTimeBlocks: ["mornings"],
  preferredWeeklyHours: "6_to_10",
  documentOriginalFilename: "experience.pdf",
  futureOpportunitiesConsent: false,
};

describe("helper notification", () => {
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

  it("includes follow-up details and the document name, not a storage path", () => {
    const text = buildHelperNotificationText(application);
    expect(text).toContain("Name:\nAlex Rivera");
    expect(text).toContain("Email:\nalex@example.com");
    expect(text).toContain("Telephone:\n416-555-0100");
    expect(text).toContain(
      "Interests:\nLaundry, including putting items away",
    );
    expect(text).toContain("Days:\nMonday");
    expect(text).toContain("Preferred times:\nMornings");
    expect(text).toContain("Weekly hours:\n6–10 hours");
    expect(text).toContain("Document:\nexperience.pdf");
    expect(text).not.toMatch(/document_storage_path|helper-documents|\//);
    expect(text).toContain(`Reference:\n${application.id}`);
  });

  it("posts plain text to the same admin recipient as contact", async () => {
    const fetchImpl = jest.fn(async () => ({ ok: true, status: 200 }) as Response);

    const result = await notifyHelperApplication(application, {
      fetchImpl,
      now: new Date("2026-10-19T15:01:00.000Z"),
    });

    expect(result.notification_status).toBe("sent");
    const payload = JSON.parse(
      String((fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1].body),
    ) as { to: string[]; reply_to: string; subject: string };
    expect(payload.to).toEqual(["admin@parentive.ca"]);
    expect(payload.reply_to).toBe("alex@example.com");
    expect(payload.subject).toBe("New Parentive helper application");
  });

  it("records missing email config without calling Resend or logging the address", async () => {
    delete process.env.RESEND_API_KEY;
    const fetchImpl = jest.fn();
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

    const result = await notifyHelperApplication(application, { fetchImpl });

    expect(result.notification_error).toBe("missing_email_config");
    expect(fetchImpl).not.toHaveBeenCalled();
    const logged = JSON.stringify(errorSpy.mock.calls);
    expect(logged).toContain(application.id);
    expect(logged).not.toContain(application.email);
    expect(logged).not.toContain("Relevant household experience");
  });
});
