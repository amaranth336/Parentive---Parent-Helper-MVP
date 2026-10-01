import type { ContactNotificationResult } from "./notify";
import {
  recordContactNotification,
  submitContactInquiry,
  type ServiceRoleClient,
} from "./submit";
import type { ValidatedContact } from "./validation";

const validated: ValidatedContact = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: null,
  message: "Hello\n\nthere",
};

type StoredState = {
  inserted?: unknown;
  updated?: unknown;
  insertError?: boolean;
  updateError?: boolean;
  id?: string;
  createdAt?: string;
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
            select(columns: string) {
              expect(columns).toBe("id, created_at");
              return {
                async single() {
                  if (state.insertError) {
                    return { data: null, error: { message: "insert failed" } };
                  }
                  return {
                    data: {
                      id: state.id ?? "inquiry-1",
                      created_at: state.createdAt ?? "2026-10-01T13:45:00.000Z",
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
            async eq(column: string, id: string) {
              expect(column).toBe("id");
              expect(id).toBe(state.id ?? "inquiry-1");
              if (state.updateError) {
                return { data: null, error: { message: "update failed" } };
              }
              return { data: null, error: null };
            },
          };
        },
      };
    },
  };

  return client as unknown as ServiceRoleClient;
}

describe("contact submit", () => {
  it("stores only contact fields and reads back id and created_at", async () => {
    const state: StoredState = {
      id: "inquiry-42",
      createdAt: "2026-10-01T13:45:00.000Z",
    };
    const result = await submitContactInquiry(validated, {
      client: createMockClient(state),
    });

    expect(result).toEqual({
      ok: true,
      id: "inquiry-42",
      createdAt: "2026-10-01T13:45:00.000Z",
    });
    expect(state.inserted).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      phone: null,
      message: "Hello\n\nthere",
    });
  });

  it("returns failure when Supabase insertion fails", async () => {
    const state: StoredState = { insertError: true };
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

    const result = await submitContactInquiry(validated, {
      client: createMockClient(state),
    });

    expect(result).toEqual({ ok: false });
    expect(JSON.stringify(errorSpy.mock.calls)).not.toContain("ada@example.com");
    expect(JSON.stringify(errorSpy.mock.calls)).not.toContain("Hello");
    errorSpy.mockRestore();
  });

  it("records a sent notification and a failed notification", async () => {
    const sentState: StoredState = { id: "inquiry-1" };
    const sent: ContactNotificationResult = {
      notification_status: "sent",
      notification_error: null,
      notification_sent_at: "2026-10-01T13:46:00.000Z",
    };
    const sentResult = await recordContactNotification(
      createMockClient(sentState),
      "inquiry-1",
      sent,
    );
    expect(sentResult).toEqual({ ok: true });
    expect(sentState.updated).toEqual(sent);

    const failedState: StoredState = { id: "inquiry-1" };
    const failedResult = await recordContactNotification(
      createMockClient(failedState),
      "inquiry-1",
      {
        notification_status: "failed",
        notification_error: "resend_http_403",
        notification_sent_at: null,
      },
    );
    expect(failedResult).toEqual({ ok: true });
    expect(failedState.updated).toEqual({
      notification_status: "failed",
      notification_error: "resend_http_403",
      notification_sent_at: null,
    });
  });

  it("reports an update failure without throwing", async () => {
    const state: StoredState = { id: "inquiry-1", updateError: true };
    const result = await recordContactNotification(
      createMockClient(state),
      "inquiry-1",
      {
        notification_status: "failed",
        notification_error: "missing_email_config",
        notification_sent_at: null,
      },
    );

    expect(result).toEqual({ ok: false });
  });
});
