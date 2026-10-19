import { createServiceRoleClient } from "@/lib/supabase/admin";

describe("createServiceRoleClient", () => {
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const originalWebSocket = globalThis.WebSocket;

  afterEach(() => {
    if (originalUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    } else {
      process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    }

    if (originalKey === undefined) {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    } else {
      process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
    }

    Object.defineProperty(globalThis, "WebSocket", {
      configurable: true,
      writable: true,
      value: originalWebSocket,
    });
  });

  it("returns null when server credentials are missing", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    expect(createServiceRoleClient()).toBeNull();
  });

  it("constructs a REST client when the runtime has no WebSocket", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
    Object.defineProperty(globalThis, "WebSocket", {
      configurable: true,
      writable: true,
      value: undefined,
    });
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

    const client = createServiceRoleClient();

    expect(client).not.toBeNull();
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
