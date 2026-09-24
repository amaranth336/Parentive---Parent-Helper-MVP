import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  APPLICATION_CONSENT_PURPOSE,
  DOCUMENT_BUCKET,
  FUTURE_OPPORTUNITIES_CONSENT_PURPOSE,
  HELPERS_PRIVACY_POLICY_VERSION,
} from "./copy";
import {
  buildHelperApplicationRow,
  submitHelperApplication,
  type HelpersDocumentBytes,
  type ServiceRoleClient,
} from "./submit";
import type { ValidatedHelpersApplication } from "./validation";

const validated: ValidatedHelpersApplication = {
  firstName: "Alex",
  lastName: "Rivera",
  email: "alex@example.com",
  telephone: "416-555-0100",
  postalCode: "L4G 1A1",
  postalFsa: "L4G",
  interestKeys: ["laundry_household_resets", "parent_present_childcare"],
  interestedInChildSupport: true,
  gardenCapability: false,
  experienceText: "Relevant household and childcare experience.",
  motivationText: "I want to help families get through the week.",
  availableDays: ["monday", "friday"],
  preferredTimeBlocks: ["afternoons"],
  preferredWeeklyHours: "11_to_20",
  age18Confirmed: true,
  workEligibleCanada: true,
  hasOwnVehicle: true,
  screeningAcknowledgement: true,
  applicationConsent: true,
  futureOpportunitiesConsent: true,
  documentOriginalFilename: "experience.pdf",
  documentContentType: "application/pdf",
  documentByteSize: 12,
};

const document: HelpersDocumentBytes = {
  bytes: new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31]),
  contentType: "application/pdf",
  originalFilename: "experience.pdf",
  byteSize: 6,
  extension: "pdf",
};

type QueryResult = {
  data: { id: string } | null;
  error: { code?: string; message?: string } | null;
};

function createMockClient(options: {
  uploadError?: { message?: string } | null;
  insertResult?: QueryResult;
  removeError?: { message?: string } | null;
  removeErrorTwice?: boolean;
  onUpload?: (path: string, body: unknown) => void;
  onInsert?: (row: unknown) => void;
  onRemove?: (paths: string[]) => void;
}): ServiceRoleClient {
  let removeAttempts = 0;
  const client = {
    storage: {
      from(bucket: string) {
        expect(bucket).toBe(DOCUMENT_BUCKET);
        return {
          upload: async (path: string, body: unknown) => {
            options.onUpload?.(path, body);
            if (options.uploadError) {
              return { data: null, error: options.uploadError };
            }
            return { data: { path }, error: null };
          },
          remove: async (paths: string[]) => {
            options.onRemove?.(paths);
            removeAttempts += 1;
            if (options.removeError) {
              if (options.removeErrorTwice || removeAttempts === 1) {
                return { data: null, error: options.removeError };
              }
            }
            return { data: paths, error: null };
          },
        };
      },
    },
    from(table: string) {
      expect(table).toBe("helper_applications");
      return {
        insert(row: unknown) {
          options.onInsert?.(row);
          return {
            select() {
              return {
                single: async () =>
                  options.insertResult ?? {
                    data: { id: "created-1" },
                    error: null,
                  },
              };
            },
          };
        },
      };
    },
  };

  return client as unknown as ServiceRoleClient;
}

describe("helpers submit", () => {
  const now = new Date("2026-09-22T18:00:00.000Z");
  const fixedId = "11111111-1111-4111-8111-111111111111";

  it("uploads then inserts and returns ok only when both succeed", async () => {
    let uploadedPath: string | undefined;
    let persisted: unknown;
    const onRemove = jest.fn();
    const client = createMockClient({
      insertResult: { data: { id: fixedId }, error: null },
      onUpload: (path) => {
        uploadedPath = path;
      },
      onInsert: (row) => {
        persisted = row;
      },
      onRemove,
    });

    const result = await submitHelperApplication(validated, document, {
      client,
      now,
      id: fixedId,
    });

    expect(result).toEqual({ ok: true });
    expect(uploadedPath).toBe(`${fixedId}/experience.pdf`);
    expect(persisted).toEqual(
      buildHelperApplicationRow(validated, {
        id: fixedId,
        documentStoragePath: `${fixedId}/experience.pdf`,
        now,
      }),
    );
    expect(persisted).toMatchObject({
      email: "alex@example.com",
      interested_in_child_support: true,
      garden_capability: false,
      application_consent_purpose: APPLICATION_CONSENT_PURPOSE,
      future_opportunities_consent: true,
      future_opportunities_consent_purpose: FUTURE_OPPORTUNITIES_CONSENT_PURPOSE,
      privacy_policy_version: HELPERS_PRIVACY_POLICY_VERSION,
    });
    expect(onRemove).not.toHaveBeenCalled();
  });

  it("cleans up the storage object when insert fails", async () => {
    const onRemove = jest.fn();
    const client = createMockClient({
      insertResult: { data: null, error: { message: "insert failed" } },
      onRemove,
    });

    const result = await submitHelperApplication(validated, document, {
      client,
      now,
      id: fixedId,
    });

    expect(result.ok).toBe(false);
    expect(onRemove).toHaveBeenCalledWith([`${fixedId}/experience.pdf`]);
  });

  it("retries and records when storage cleanup fails after insert failure", async () => {
    const onRemove = jest.fn();
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const client = createMockClient({
      insertResult: { data: null, error: { message: "insert failed" } },
      removeError: { message: "remove denied" },
      removeErrorTwice: true,
      onRemove,
    });

    const result = await submitHelperApplication(validated, document, {
      client,
      now,
      id: fixedId,
    });

    expect(result.ok).toBe(false);
    expect(onRemove).toHaveBeenCalledTimes(2);
    expect(errorSpy).toHaveBeenCalled();
    const logged = String(errorSpy.mock.calls[0]?.[0] ?? "");
    expect(logged).toContain("storage_cleanup_failed");
    expect(logged).toContain(`${fixedId}/experience.pdf`);
    expect(logged).not.toContain(validated.email);
    errorSpy.mockRestore();
  });

  it("does not insert a row when upload fails", async () => {
    const onInsert = jest.fn();
    const client = createMockClient({
      uploadError: { message: "upload failed" },
      onInsert,
    });

    const result = await submitHelperApplication(validated, document, {
      client,
      now,
      id: fixedId,
    });

    expect(result.ok).toBe(false);
    expect(onInsert).not.toHaveBeenCalled();
  });

  it("returns an error when the admin client is missing", async () => {
    const result = await submitHelperApplication(validated, document, {
      client: null,
    });
    expect(result.ok).toBe(false);
  });

  it("allows multiple applications for the same email (no unique short-circuit)", async () => {
    const onInsert = jest.fn();
    const client = createMockClient({
      insertResult: { data: { id: "second" }, error: null },
      onInsert,
    });

    const first = await submitHelperApplication(validated, document, {
      client,
      now,
      id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    });
    const second = await submitHelperApplication(validated, document, {
      client,
      now,
      id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    });

    expect(first).toEqual({ ok: true });
    expect(second).toEqual({ ok: true });
    expect(onInsert).toHaveBeenCalledTimes(2);
  });

  it("never uses the anon or browser client", () => {
    const source = readFileSync(join(__dirname, "submit.ts"), "utf8");
    expect(source).toContain("createServiceRoleClient");
    expect(source).not.toMatch(/createBrowserClient|createServerClient/);
    expect(source).not.toMatch(/lib\/supabase\/client/);
    expect(source).not.toMatch(/NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  });
});
