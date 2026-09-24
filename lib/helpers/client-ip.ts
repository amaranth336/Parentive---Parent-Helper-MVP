/**
 * Resolve a client IP for helper-application rate limiting.
 *
 * Prefer platform-controlled headers that callers cannot freely set.
 * Never prefer the first X-Forwarded-For hop: clients can prepend spoofed IPs
 * and reverse proxies append the real address.
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

function lastHeaderValue(header: string | null): string | null {
  if (!header) {
    return null;
  }

  const parts = header
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : null;
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

  // Proxies append the connecting peer. Prefer the last hop over the first.
  const forwardedLast = lastHeaderValue(request.headers.get("x-forwarded-for"));
  if (forwardedLast && looksLikeIp(forwardedLast)) {
    return forwardedLast;
  }

  return "unknown";
}
