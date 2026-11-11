/** Public household-service pages and the customer support-request flow. */
export const TRACKABLE_PATHS = ["/", "/faq", "/our-support"] as const;

export const SENSITIVE_QUERY_KEYS = [
  "address",
  "birth",
  "birthdate",
  "child",
  "children",
  "dob",
  "e-mail",
  "email",
  "first_name",
  "firstname",
  "full_name",
  "fullname",
  "health",
  "last_name",
  "lastname",
  "message",
  "mobile",
  "name",
  "note",
  "notes",
  "password",
  "phone",
  "postal",
  "postal_code",
  "postalcode",
  "postcode",
  "tel",
  "token",
  "zip",
] as const;

const SENSITIVE_QUERY_KEY_SET = new Set<string>(SENSITIVE_QUERY_KEYS);

const SENSITIVE_SEGMENTS = new Set([
  "clinical",
  "fertility",
  "health",
  "medical",
]);

const EMAIL_VALUE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizePathname(pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
}

export function isTrackablePath(pathname: string): boolean {
  const path = normalizePathname(pathname);
  if (path.split("/").some((segment) => SENSITIVE_SEGMENTS.has(segment))) {
    return false;
  }
  if (path.includes("@")) return false;
  return (TRACKABLE_PATHS as readonly string[]).includes(path);
}

export function hasSensitiveQuery(search: string): boolean {
  const params = new URLSearchParams(search);
  for (const [key, value] of params.entries()) {
    if (SENSITIVE_QUERY_KEY_SET.has(key.toLowerCase())) return true;
    if (EMAIL_VALUE.test(value.trim())) return true;
    const digits = value.replace(/\D/g, "");
    if (digits.length >= 7) return true;
  }
  return false;
}

export function hasSensitiveHash(hash: string): boolean {
  if (!hash || hash === "#") return false;
  const value = hash.startsWith("#") ? hash.slice(1) : hash;
  if (value.includes("@")) return true;
  if (EMAIL_VALUE.test(value)) return true;
  if (value.replace(/\D/g, "").length >= 7) return true;
  return hasSensitiveQuery(value);
}

export function isTrackableLocation(
  pathname: string,
  search: string,
  hash = "",
): boolean {
  return (
    isTrackablePath(pathname) &&
    !hasSensitiveQuery(search) &&
    !hasSensitiveHash(hash)
  );
}

/**
 * Once a measurement script is loaded, leaving an allowed page must be a full
 * document load so that script cannot keep collecting on the next page.
 * Returns the destination href, or null when client navigation can stay.
 */
export function hardNavigationHref(
  href: string,
  currentOrigin: string,
): string | null {
  let url: URL;
  try {
    url = new URL(href, currentOrigin);
  } catch {
    return null;
  }
  if (url.origin !== currentOrigin) return null;
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (isTrackableLocation(url.pathname, url.search, url.hash)) {
    return null;
  }
  return url.href;
}
