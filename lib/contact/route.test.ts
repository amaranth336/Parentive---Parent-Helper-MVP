import { ReadableStream } from "node:stream/web";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CONTACT_ERRORS, MAX_CONTACT_REQUEST_BYTES } from "./copy";

jest.mock("@/lib/supabase/admin", () => ({
  createServiceRoleClient: jest.fn(() => null),
}));

import { createServiceRoleClient } from "@/lib/supabase/admin";
import { POST } from "@/app/api/contact/route";

let ipCounter = 1;

function trustedIp(): string {
  ipCounter += 1;
  return `203.0.113.${ipCounter}`;
}

function contactRequest(
  body: BodyInit | null | undefined,
  headers: Record<string, string> = {},
  ip = trustedIp(),
): Request {
  return new Request("http://127.0.0.1/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-vercel-forwarded-for": ip,
      ...headers,
    },
    body: body ?? undefined,
    duplex: "half",
  } as RequestInit);
}

describe("contact route", () => {
  beforeEach(() => {
    (createServiceRoleClient as jest.Mock).mockClear();
  });

  it("rejects malformed requests", async () => {
    const cases = ["not-json", "[]", "null", "42", "\"text\""];

    for (const body of cases) {
      const response = await POST(contactRequest(body));
      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json).toEqual({
        ok: false,
        error: CONTACT_ERRORS.validation,
      });
    }

    expect(createServiceRoleClient).not.toHaveBeenCalled();
  });

  it("returns 413 when Content-Length is above 32768", async () => {
    const response = await POST(
      contactRequest(null, {
        "content-length": String(MAX_CONTACT_REQUEST_BYTES + 1),
        "content-type": "application/json",
      }),
    );

    expect(MAX_CONTACT_REQUEST_BYTES).toBe(32768);
    expect(response.status).toBe(413);
    expect(await response.json()).toEqual({
      ok: false,
      error: CONTACT_ERRORS.payloadTooLarge,
    });
  });

  it("returns 413 when the streamed body exceeds the cap", async () => {
    const oversized = new Uint8Array(MAX_CONTACT_REQUEST_BYTES + 40).fill(97);
    const mid = Math.floor(oversized.byteLength / 2);
    let index = 0;
    const chunks = [oversized.slice(0, mid), oversized.slice(mid)];
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        if (index >= chunks.length) {
          controller.close();
          return;
        }
        controller.enqueue(chunks[index]!);
        index += 1;
      },
    });

    // Node's ReadableStream and the DOM BodyInit type do not overlap under tsc.
    const response = await POST(
      contactRequest(stream as unknown as BodyInit, {
        "content-type": "application/json",
        "content-length": "128",
      }),
    );

    expect(response.status).toBe(413);
    expect(await response.json()).toEqual({
      ok: false,
      error: CONTACT_ERRORS.payloadTooLarge,
    });
  });

  it("rate limits before reading a trusted client IP and ignores x-forwarded-for", async () => {
    const source = readFileSync(
      join(process.cwd(), "app", "api", "contact", "route.ts"),
      "utf8",
    );
    expect(source).toContain("resolveClientIp");
    expect(source).toContain("contactRateLimiter");
    expect(source).toContain("readHelpersBodyWithLimit");
    expect(source).not.toContain("x-forwarded-for");
    expect(source).not.toContain("earlyAccessRateLimiter");
    expect(source.indexOf("resolveClientIp(request)")).toBeLessThan(
      source.indexOf("contactRateLimiter.isLimited"),
    );
    expect(source.indexOf("contactRateLimiter.isLimited")).toBeLessThan(
      source.indexOf('request.headers.get("content-length")'),
    );
    expect(source.indexOf("readHelpersBodyWithLimit(")).toBeLessThan(
      source.indexOf("handleContactSubmission("),
    );

    for (let index = 0; index < 5; index += 1) {
      const response = await POST(
        new Request("http://127.0.0.1/api/contact", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-forwarded-for": `198.51.100.${index + 1}`,
          },
          body: "{}",
        }),
      );
      expect(response.status).toBe(400);
    }

    const limited = await POST(
      new Request("http://127.0.0.1/api/contact", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "203.0.113.99",
        },
        body: "{}",
      }),
    );
    expect(limited.status).toBe(429);
    expect(await limited.json()).toEqual({
      ok: false,
      error: CONTACT_ERRORS.rateLimit,
    });

    const otherCaller = await POST(contactRequest("{}"));
    expect(otherCaller.status).toBe(400);
  });

  it("rejects a honeypot before creating a service-role client", async () => {
    const response = await POST(
      contactRequest(
        JSON.stringify({
          name: "Ada Lovelace",
          email: "ada@example.com",
          message: "Hello",
          companyWebsite: "https://spam.test",
        }),
      ),
    );

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json).toEqual({
      ok: false,
      error: CONTACT_ERRORS.validation,
    });
    expect(JSON.stringify(json)).not.toMatch(/honeypot|companyWebsite/i);
    expect(createServiceRoleClient).not.toHaveBeenCalled();
  });

  it("does not confirm success when the service-role client is missing", async () => {
    const response = await POST(
      contactRequest(
        JSON.stringify({
          name: "Ada Lovelace",
          email: "ada@example.com",
          message: "Hello",
        }),
      ),
    );

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      ok: false,
      error: CONTACT_ERRORS.unavailable,
    });
    expect(createServiceRoleClient).toHaveBeenCalled();
  });
});
