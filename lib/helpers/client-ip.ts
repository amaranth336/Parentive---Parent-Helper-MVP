/**
 * Resolve a client IP for helper-application rate limiting.
 *
 * Vercel deployment assumptions:
 * - On Vercel, `x-vercel-forwarded-for` is platform-set to the connecting client
 *   IP (take the first value if a list is present).
 * - `x-real-ip` is also treated as platform-controlled on Vercel and is used
 *   only when the Vercel header is absent.
 * - Do NOT trust `x-forwarded-for`: clients can prepend spoofed hops. Custom
 *   reverse proxies that strip Vercel headers will collapse callers into the
 *   shared `"unknown"` rate-limit bucket (intentional fail-safe).
 * - Local `next dev` typically has neither header → `"unknown"`.
 */

const IPV4_LIKE =
  /^(?:\d{1,3}\.){3}\d{1,3}$|^\[?[A-Fa-f0-9:]+\]?(?:%\w+)?$/;

function firstHeaderValue(header: string | null): string | null {
  if (!header) {
    return null;
  }

  const first = header.split(",")[0]?.trim();
  return first || null;
}

function looksLikeIp(value: string): boolean {
  return IPV4_LIKE.test(value);
}

export function resolveClientIp(request: Request): string {
  const vercel = firstHeaderValue(
    request.headers.get("x-vercel-forwarded-for"),
  );
  if (vercel && looksLikeIp(vercel)) {
    return vercel;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp && looksLikeIp(realIp)) {
    return realIp;
  }

  return "unknown";
}
