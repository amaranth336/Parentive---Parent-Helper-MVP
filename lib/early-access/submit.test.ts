import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  MARKETING_CONSENT_PURPOSE,
  PILOT_CONTACT_PURPOSE,
  PRIVACY_POLICY_VERSION,
} from "./copy";
import {
  buildEarlyAccessRow,
  submitEarlyAccessRegistration,
  type ServiceRoleClient,
} from "./submit";
import type { ValidatedEarlyAccess } from "./validation";

const validated: ValidatedEarlyAccess = {
  firstName: "Alex",
  email: "alex@example.com",
  postalCode: "L4G 1A1",
  postalFsa: "L4G",
  serviceInterests: ["home_laundry", "other_support"],
  serviceInterestOther: "Seasonal closet reset",
  frequency: "weekly",
  frequencyOther: null,
  pilotContactConsent: true,
  marketingConsent: true,
};

type QueryResult = {
  data: { id: string } | null;
  error: { code?: string; message?: string } | null;
};

function createMockClient(options: {
  selectResults?: QueryResult[];
  insertResult?: QueryResult;
  onInsert?: (row: unknown) => void;
  onUpdate?: () => void;
}): ServiceRoleClient {
  const selectResults = [...(options.selectResults ?? [])];

  const client = {
    from(table: string) {
      expect(table).toBe("early_access_registrations");

      return {
        select() {
          return {
            eq() {
              return {
                maybeSingle: async () =>
                  selectResults.shift() ?? { data: null, error: null },
              };
            },
          };
        },
        insert(row: unknown) {
          options.onInsert?.(row);
          return {
            select() {
              return {
                single: async () =>
                  options.insertResult ?? {
                    data: { id: "new-id" },
                    error: null,
                  },
              };
            },
          };
        },
        update() {
          options.onUpdate?.();
          throw new Error("update must not be called");
        },
      };
    },
  };

  return client as unknown as ServiceRoleClient;
}

describe("early-access submit", () => {
  const now = new Date("2026-09-22T16:00:00.000Z");

  it("returns ok for a successful insert and persists the normalized payload", async () => {
    let persisted: unknown;
    const client = createMockClient({
      selectResults: [{ data: null, error: null }],
      insertResult: { data: { id: "created-1" }, error: null },
      onInsert: (row) => {
        persisted = row;
      },
    });

    const result = await submitEarlyAccessRegistration(validated, { client, now });

    expect(result).toEqual({ ok: true });
    expect(persisted).toEqual(buildEarlyAccessRow(validated, now));
    expect(persisted).toMatchObject({
      email: "alex@example.com",
      postal_code: "L4G 1A1",
      postal_fsa: "L4G",
      service_interests: ["home_laundry", "other_support"],
      frequency: "weekly",
      pilot_contact_consent: true,
      pilot_contact_purpose: PILOT_CONTACT_PURPOSE,
      pilot_contact_consented_at: now.toISOString(),
      marketing_consent: true,
      marketing_consent_purpose: MARKETING_CONSENT_PURPOSE,
      marketing_consented_at: now.toISOString(),
      privacy_policy_version: PRIVACY_POLICY_VERSION,
    });
  });

  it("returns ok for an existing row and does not update", async () => {
    const onUpdate = jest.fn();
    const onInsert = jest.fn();
    const client = createMockClient({
      selectResults: [{ data: { id: "existing-1" }, error: null }],
      onInsert,
      onUpdate,
    });

    const result = await submitEarlyAccessRegistration(validated, { client, now });

    expect(result).toEqual({ ok: true });
    expect(onInsert).not.toHaveBeenCalled();
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("treats a unique-violation plus successful re-select as ok", async () => {
    const client = createMockClient({
      selectResults: [
        { data: null, error: null },
        { data: { id: "raced-1" }, error: null },
      ],
      insertResult: {
        data: null,
        error: { code: "23505", message: "duplicate key value" },
      },
    });

    await expect(
      submitEarlyAccessRegistration(validated, { client, now }),
    ).resolves.toEqual({ ok: true });
  });

  it("returns an error when unique-violation re-select fails", async () => {
    const client = createMockClient({
      selectResults: [
        { data: null, error: null },
        { data: null, error: { message: "lookup failed" } },
      ],
      insertResult: {
        data: null,
        error: { code: "23505", message: "duplicate key value" },
      },
    });

    const result = await submitEarlyAccessRegistration(validated, { client, now });
    expect(result.ok).toBe(false);
  });

  it("returns an error when insert fails", async () => {
    const client = createMockClient({
      selectResults: [{ data: null, error: null }],
      insertResult: { data: null, error: { message: "write failed" } },
    });

    const result = await submitEarlyAccessRegistration(validated, { client, now });
    expect(result.ok).toBe(false);
  });

  it("returns an error when the admin client is missing", async () => {
    const result = await submitEarlyAccessRegistration(validated, { client: null });
    expect(result.ok).toBe(false);
  });

  it("never uses the anon or browser client", () => {
    const source = readFileSync(join(__dirname, "submit.ts"), "utf8");
    expect(source).toContain("createServiceRoleClient");
    expect(source).not.toMatch(/createBrowserClient|createServerClient/);
    expect(source).not.toMatch(/lib\/supabase\/client/);
    expect(source).not.toMatch(/NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  });
});
