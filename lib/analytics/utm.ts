import {
  hasSensitiveHash,
  hasSensitiveQuery,
  normalizePathname,
} from "@/lib/analytics/routes";

export const LANDING_UTM_STORAGE_KEY = "parentive-landing-utm";

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type UtmParams = Partial<Record<UtmKey, string>>;

const UTM_KEY_SET = new Set<string>(UTM_KEYS);
const SAFE_UTM_VALUE = /^[A-Za-z0-9._~-]{1,80}$/;

export type LandingUtm = {
  path: string;
  params: UtmParams;
};

export function isSafeUtmValue(value: string | null | undefined): value is string {
  return typeof value === "string" && SAFE_UTM_VALUE.test(value);
}

export function readUtmParams(search: string): UtmParams {
  const params = new URLSearchParams(search);
  const result: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (isSafeUtmValue(value)) {
      result[key] = value;
    }
  }
  return result;
}

export function hasCoreUtm(params: UtmParams): boolean {
  return Boolean(params.utm_source && params.utm_medium && params.utm_campaign);
}

export function landingFromLocation(href: string): LandingUtm | null {
  const url = new URL(href);
  const params = readUtmParams(url.search);
  if (!params.utm_source && !params.utm_medium && !params.utm_campaign) {
    return null;
  }
  return { path: normalizePathname(url.pathname), params };
}

export function parseStoredLanding(raw: string | null): LandingUtm | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { path?: unknown; params?: unknown };
    if (typeof parsed.path !== "string" || !parsed.params || typeof parsed.params !== "object") {
      return null;
    }
    const params = readUtmParams(
      UTM_KEYS.map((key) => {
        const value = (parsed.params as Record<string, unknown>)[key];
        return typeof value === "string" ? `${key}=${encodeURIComponent(value)}` : "";
      })
        .filter(Boolean)
        .join("&"),
    );
    if (!params.utm_source && !params.utm_medium && !params.utm_campaign) {
      return null;
    }
    return { path: normalizePathname(parsed.path), params };
  } catch {
    return null;
  }
}

function onlySafeUtmSearch(search: string): boolean {
  if (!search) return true;
  const params = new URLSearchParams(search);
  const keys = Array.from(params.keys());
  if (keys.length === 0) return true;
  return keys.every((key) => {
    if (!UTM_KEY_SET.has(key)) return false;
    return isSafeUtmValue(params.get(key));
  });
}

/**
 * URL transmitted to a measurement tool. Keeps an already-safe UTM query
 * exactly as it appears, including parameter order.
 */
export function publicPageUrl(href: string): string | null {
  const url = new URL(href);
  if (hasSensitiveQuery(url.search)) return null;
  const path = normalizePathname(url.pathname);
  if (onlySafeUtmSearch(url.search)) {
    return `${url.origin}${path}${url.search}`;
  }
  const clean = new URL(`${url.origin}${path}`);
  const params = readUtmParams(url.search);
  for (const key of UTM_KEYS) {
    const value = params[key];
    if (value) clean.searchParams.set(key, value);
  }
  return clean.toString();
}

export function measurementPageLocation(
  currentHref: string,
  landing: LandingUtm | null,
): string | null {
  const current = publicPageUrl(currentHref);
  if (!current) return null;
  const currentUrl = new URL(current);
  const currentParams = readUtmParams(currentUrl.search);
  if (hasCoreUtm(currentParams) || !landing) return current;
  if (normalizePathname(currentUrl.pathname) !== landing.path) return current;
  if (!hasCoreUtm(landing.params)) return current;
  const restored = new URL(`${currentUrl.origin}${landing.path}`);
  for (const key of UTM_KEYS) {
    const value = landing.params[key];
    if (value) restored.searchParams.set(key, value);
  }
  return restored.toString();
}

export function referrerIsSensitive(referrer: string): boolean {
  if (!referrer) return false;
  try {
    const url = new URL(referrer);
    if (url.username || url.password) return true;
    if (hasSensitiveQuery(url.search)) return true;
    if (hasSensitiveHash(url.hash)) return true;
    if (url.pathname.includes("@")) return true;
    return false;
  } catch {
    return true;
  }
}

/** Origin and path only, so a referrer query is not forwarded. */
export function sanitizeReferrer(referrer: string): string {
  if (!referrer || referrerIsSensitive(referrer)) return "";
  try {
    const url = new URL(referrer);
    return `${url.origin}${normalizePathname(url.pathname)}`;
  } catch {
    return "";
  }
}

/**
 * Runs before hydration and does not contact any third party. Stores the
 * first safe UTM set for this tab so a later in-app URL change can still
 * attribute the visit.
 */
export const LANDING_CAPTURE_SCRIPT = `(function(){try{var keys=["utm_source","utm_medium","utm_campaign","utm_content","utm_term"];var safe=/^[A-Za-z0-9._~-]{1,80}$/;var params=new URLSearchParams(window.location.search);var stored={};for(var i=0;i<keys.length;i++){var value=params.get(keys[i]);if(value&&safe.test(value))stored[keys[i]]=value;}if(!stored.utm_source&&!stored.utm_medium&&!stored.utm_campaign)return;if(window.sessionStorage.getItem("parentive-landing-utm"))return;window.sessionStorage.setItem("parentive-landing-utm",JSON.stringify({path:window.location.pathname,params:stored}));}catch(e){}})();`;
