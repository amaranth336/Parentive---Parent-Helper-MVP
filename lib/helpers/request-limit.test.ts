import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MAX_DOCUMENT_BYTES, MAX_HELPERS_REQUEST_BYTES } from "./copy";

describe("helpers request size guard", () => {
  it("caps multipart requests above the document limit plus overhead", () => {
    expect(MAX_HELPERS_REQUEST_BYTES).toBeGreaterThan(MAX_DOCUMENT_BYTES);
    expect(MAX_HELPERS_REQUEST_BYTES - MAX_DOCUMENT_BYTES).toBe(512_000);
  });

  it("checks Content-Length before calling formData in the route", () => {
    const source = readFileSync(
      join(process.cwd(), "app", "api", "helpers", "route.ts"),
      "utf8",
    );
    expect(source).toContain("content-length");
    expect(source).toContain("MAX_HELPERS_REQUEST_BYTES");
    expect(source).toContain("413");
    expect(source.indexOf("content-length")).toBeLessThan(
      source.indexOf("request.formData()"),
    );
  });

  it("uses trusted platform IP headers instead of the first XFF hop", () => {
    const source = readFileSync(
      join(process.cwd(), "app", "api", "helpers", "route.ts"),
      "utf8",
    );
    expect(source).toContain("resolveClientIp");
    expect(source).not.toMatch(/x-forwarded-for[\s\S]*split\(\",\"\)\[0\]/);
  });
});
