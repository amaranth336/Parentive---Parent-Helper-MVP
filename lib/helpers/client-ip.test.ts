import { resolveClientIp } from "./client-ip";

function requestWith(headers: Record<string, string>): Request {
  return new Request("http://127.0.0.1/api/helpers", {
    method: "POST",
    headers,
  });
}

describe("resolveClientIp", () => {
  it("prefers x-vercel-forwarded-for over spoofable x-forwarded-for heads", () => {
    const ip = resolveClientIp(
      requestWith({
        "x-forwarded-for": "1.1.1.1, 2.2.2.2",
        "x-vercel-forwarded-for": "9.9.9.9",
      }),
    );
    expect(ip).toBe("9.9.9.9");
  });

  it("uses x-real-ip when vercel header is absent", () => {
    const ip = resolveClientIp(
      requestWith({
        "x-real-ip": "8.8.8.8",
        "x-forwarded-for": "1.1.1.1, 8.8.8.8",
      }),
    );
    expect(ip).toBe("8.8.8.8");
  });

  it("falls back to the last x-forwarded-for hop, not the first", () => {
    const ip = resolveClientIp(
      requestWith({
        "x-forwarded-for": "1.1.1.1, 10.0.0.5",
      }),
    );
    expect(ip).toBe("10.0.0.5");
  });

  it("returns unknown when no usable header is present", () => {
    expect(resolveClientIp(requestWith({}))).toBe("unknown");
  });
});
