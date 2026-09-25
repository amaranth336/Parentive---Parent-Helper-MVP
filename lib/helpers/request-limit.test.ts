import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ReadableStream } from "node:stream/web";
import { HELPERS_ERRORS, MAX_DOCUMENT_BYTES, MAX_HELPERS_REQUEST_BYTES } from "./copy";
import type { HelpersRateLimitResult } from "./rate-limit";

const mockCheckRateLimit = jest.fn<
  Promise<HelpersRateLimitResult>,
  [string]
>();

jest.mock("@/lib/helpers/rate-limit", () => ({
  checkHelpersApplicationRateLimit: (key: string) => mockCheckRateLimit(key),
}));

import { POST } from "@/app/api/helpers/route";

function multipartBody(
  fields: Record<string, string>,
  file?: {
    name: string;
    type: string;
    bytes: Uint8Array;
  },
): { body: Uint8Array; contentType: string } {
  const boundary = "----ParentiveHelpersTestBoundary";
  const chunks: Uint8Array[] = [];
  const encoder = new TextEncoder();

  const push = (value: string | Uint8Array) => {
    chunks.push(typeof value === "string" ? encoder.encode(value) : value);
  };

  for (const [name, value] of Object.entries(fields)) {
    push(
      `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`,
    );
  }

  if (file) {
    push(
      `--${boundary}\r\nContent-Disposition: form-data; name="document"; filename="${file.name}"\r\nContent-Type: ${file.type}\r\n\r\n`,
    );
    push(file.bytes);
    push("\r\n");
  }

  push(`--${boundary}--\r\n`);

  let total = 0;
  for (const chunk of chunks) {
    total += chunk.byteLength;
  }
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return {
    body,
    contentType: `multipart/form-data; boundary=${boundary}`,
  };
}

function requestFromBody(
  body: Uint8Array,
  headers: Record<string, string>,
): Request {
  return new Request("http://127.0.0.1/api/helpers", {
    method: "POST",
    headers,
    body,
    duplex: "half",
  } as RequestInit);
}

function requestFromStream(
  chunks: Uint8Array[],
  headers: Record<string, string>,
): Request {
  let index = 0;
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

  return new Request("http://127.0.0.1/api/helpers", {
    method: "POST",
    headers,
    body: stream,
    duplex: "half",
  } as RequestInit);
}

describe("helpers request size guard", () => {
  beforeEach(() => {
    mockCheckRateLimit.mockReset();
    mockCheckRateLimit.mockResolvedValue({ limited: false });
  });

  it("caps multipart requests above the document limit plus overhead", () => {
    expect(MAX_HELPERS_REQUEST_BYTES).toBeGreaterThan(MAX_DOCUMENT_BYTES);
    expect(MAX_HELPERS_REQUEST_BYTES - MAX_DOCUMENT_BYTES).toBe(512_000);
  });

  it("rate-limits before Content-Length and streaming body reads", () => {
    const source = readFileSync(
      join(process.cwd(), "app", "api", "helpers", "route.ts"),
      "utf8",
    );
    expect(source).toContain("checkHelpersApplicationRateLimit");
    expect(source).toContain("readHelpersBodyWithLimit");
    expect(source).toContain("content-length");
    expect(source).toContain("413");
    expect(source.indexOf("resolveClientIp")).toBeLessThan(
      source.indexOf("checkHelpersApplicationRateLimit"),
    );
    expect(source.indexOf("checkHelpersApplicationRateLimit")).toBeLessThan(
      source.indexOf("content-length"),
    );
    expect(source.indexOf("readHelpersBodyWithLimit")).toBeLessThan(
      source.indexOf("formData()"),
    );
  });

  it("uses trusted platform IP headers instead of x-forwarded-for", () => {
    const source = readFileSync(
      join(process.cwd(), "app", "api", "helpers", "route.ts"),
      "utf8",
    );
    expect(source).toContain("resolveClientIp");
    expect(source).not.toContain("x-forwarded-for");
  });

  it("allows a small body when Content-Length is absent (reaches validation)", async () => {
    const { body, contentType } = multipartBody({ firstName: "Alex" });
    const response = await POST(
      requestFromBody(body, { "content-type": contentType }),
    );

    // Not 413 — body was accepted; incomplete form yields validation 400.
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.ok).toBe(false);
    expect(json.error).toBe(HELPERS_ERRORS.validation);
  });

  it("returns 413 when Content-Length is understated but the stream is oversized", async () => {
    const oversized = new Uint8Array(MAX_HELPERS_REQUEST_BYTES + 64).fill(1);
    const mid = Math.floor(oversized.byteLength / 2);
    const response = await POST(
      requestFromStream([oversized.slice(0, mid), oversized.slice(mid)], {
        "content-type": "application/octet-stream",
        "content-length": "128",
      }),
    );

    expect(response.status).toBe(413);
    const json = await response.json();
    expect(json).toEqual({
      ok: false,
      error: HELPERS_ERRORS.payloadTooLarge,
    });
  });

  it("returns 413 for an oversized Content-Length before streaming", async () => {
    const response = await POST(
      new Request("http://127.0.0.1/api/helpers", {
        method: "POST",
        headers: {
          "content-length": String(MAX_HELPERS_REQUEST_BYTES + 1),
          "content-type": "application/octet-stream",
        },
      }),
    );

    expect(response.status).toBe(413);
  });

  it("accepts a near-limit multipart body (not 413)", async () => {
    const pdfHeader = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31]);
    const padding = new Uint8Array(64 * 1024).fill(0x20);
    const fileBytes = new Uint8Array(pdfHeader.byteLength + padding.byteLength);
    fileBytes.set(pdfHeader, 0);
    fileBytes.set(padding, pdfHeader.byteLength);

    const { body, contentType } = multipartBody(
      { firstName: "Alex" },
      {
        name: "experience.pdf",
        type: "application/pdf",
        bytes: fileBytes,
      },
    );

    expect(body.byteLength).toBeLessThan(MAX_HELPERS_REQUEST_BYTES);

    const response = await POST(
      requestFromBody(body, {
        "content-type": contentType,
        "content-length": String(body.byteLength),
      }),
    );

    expect(response.status).not.toBe(413);
    expect(response.status).toBe(400);
  });

  it("returns validation 400 for an invalid file under the request cap", async () => {
    const { body, contentType } = multipartBody(
      {
        firstName: "Alex",
        lastName: "Rivera",
        email: "alex@example.com",
        telephone: "416-555-0100",
        postalCode: "L4G 1A1",
        interestKeys: "laundry_household_resets",
        experienceText: "Relevant household experience.",
        motivationText: "I want to help families.",
        availableDays: "monday",
        preferredTimeBlocks: "mornings",
        preferredWeeklyHours: "6_to_10",
        age18Confirmed: "true",
        workEligibleCanada: "true",
        hasOwnVehicle: "true",
        screeningAcknowledgement: "true",
        applicationConsent: "true",
        futureOpportunitiesConsent: "false",
      },
      {
        name: "experience.pdf",
        type: "application/pdf",
        bytes: new Uint8Array([0x00, 0x01, 0x02, 0x03]),
      },
    );

    expect(body.byteLength).toBeLessThan(MAX_HELPERS_REQUEST_BYTES);

    const response = await POST(
      requestFromBody(body, {
        "content-type": contentType,
        "content-length": String(body.byteLength),
      }),
    );

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.ok).toBe(false);
    expect(json.fieldErrors?.document).toBeTruthy();
  });

  it("returns 503 when rate limiting is unavailable", async () => {
    mockCheckRateLimit.mockResolvedValue({ unavailable: true });
    const { body, contentType } = multipartBody({ firstName: "Alex" });

    const response = await POST(
      requestFromBody(body, { "content-type": contentType }),
    );

    expect(response.status).toBe(503);
    const json = await response.json();
    expect(json).toEqual({
      ok: false,
      error: HELPERS_ERRORS.unavailable,
    });
  });

  it("returns 429 when rate limited", async () => {
    mockCheckRateLimit.mockResolvedValue({ limited: true });
    const { body, contentType } = multipartBody({ firstName: "Alex" });

    const response = await POST(
      requestFromBody(body, { "content-type": contentType }),
    );

    expect(response.status).toBe(429);
    const json = await response.json();
    expect(json).toEqual({
      ok: false,
      error: HELPERS_ERRORS.rateLimit,
    });
  });
});
