import { gaMeasurementId, metaPixelId } from "@/lib/analytics/ids";
import {
  createGaForwardBudget,
  shouldForwardGaCommand,
  type GaForwardBudget,
} from "@/lib/analytics/ga-forward";
import type { PlannedPageView } from "@/lib/analytics/page-views";
import { isTrackableLocation } from "@/lib/analytics/routes";
import {
  hasCoreUtm,
  publicPageUrl,
  referrerIsSensitive,
  sanitizeReferrer,
  UTM_KEYS,
  type UtmParams,
} from "@/lib/analytics/utm";

type Gtag = (...args: unknown[]) => void;

type FbqFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: FbqFunction;
  loaded: boolean;
  version: string;
  disablePushState?: boolean;
};

type MeasurementWindow = Window & {
  dataLayer?: unknown[];
  gtag?: Gtag;
  fbq?: FbqFunction;
  _fbq?: FbqFunction;
};

function measurementWindow(): MeasurementWindow | null {
  if (typeof window === "undefined") return null;
  return window as MeasurementWindow;
}

let gaInstalled = false;
let metaInstalled = false;
let dataLayerGuarded = false;
let gaBudget: GaForwardBudget = createGaForwardBudget();

const TRACKERS_FLAG = "__parentiveTrackers";

export function trackersAreLoaded(): boolean {
  return gaInstalled || metaInstalled;
}

export function resetProvidersForTests(): void {
  gaInstalled = false;
  metaInstalled = false;
  dataLayerGuarded = false;
  filteringGaPush = false;
  gaBudget = createGaForwardBudget();
}

function markTrackersLoaded(target: MeasurementWindow): void {
  (target as unknown as Record<string, boolean>)[TRACKERS_FLAG] = true;
}

function gaDisableKey(gaId: string): string {
  return `ga-disable-${gaId}`;
}

export function setGaDisabled(gaId: string, disabled: boolean): void {
  const target = measurementWindow();
  if (!target) return;
  (target as unknown as Record<string, boolean>)[gaDisableKey(gaId)] = disabled;
}

function expireCookie(name: string): void {
  if (typeof document === "undefined") return;
  const host = window.location.hostname;
  const base = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
  document.cookie = base;
  if (host && host !== "localhost") {
    document.cookie = `${base}; domain=${host}`;
    const parts = host.split(".");
    if (parts.length >= 2) {
      document.cookie = `${base}; domain=.${parts.slice(-2).join(".")}`;
    }
  }
}

function clearNamedCookies(names: string[]): void {
  for (const name of names) expireCookie(name);
}

export function clearAnalyticsCookies(gaId: string | null): void {
  const names = ["_ga", "_gid", "_gat"];
  if (gaId) names.push(`_ga_${gaId.slice(2)}`);
  clearNamedCookies(names);
}

export function clearAdvertisingCookies(): void {
  clearNamedCookies(["_fbp", "_fbc"]);
}

let filteringGaPush = false;

function filterPush(
  forward: (...items: unknown[]) => number,
  items: unknown[],
): number {
  if (filteringGaPush) return forward(...items);
  filteringGaPush = true;
  try {
    const allowed = items.filter((item) => shouldForwardGaCommand(item, gaBudget));
    if (allowed.length === 0) return 0;
    return forward(...allowed);
  } finally {
    filteringGaPush = false;
  }
}

/**
 * Keeps the filter in place even if gtag.js replaces dataLayer.push.
 * Automatic page, click and form commands are dropped. Expected commands pass.
 */
function installDataLayer(target: MeasurementWindow): void {
  if (dataLayerGuarded) return;
  const dataLayer = target.dataLayer ?? [];
  dataLayerGuarded = true;

  const proxy = new Proxy(dataLayer, {
    get(array, prop, receiver) {
      if (prop === "__parentiveProxy") return true;
      const value = Reflect.get(array, prop, receiver);
      if (prop !== "push") {
        return typeof value === "function" ? value.bind(array) : value;
      }
      const push = value as (...items: unknown[]) => number;
      return (...items: unknown[]) => filterPush(push.bind(array), items);
    },
    set(array, prop, value, receiver) {
      return Reflect.set(array, prop, value, receiver);
    },
  });
  target.dataLayer = proxy;
}

function ensureGa(gaId: string): void {
  const target = measurementWindow();
  if (!target) return;
  setGaDisabled(gaId, false);
  installDataLayer(target);
  if (!target.gtag) {
    target.gtag = function gtag(this: unknown) {
      target.dataLayer?.push(arguments);
    };
  }
  if (gaInstalled) return;
  gaInstalled = true;
  markTrackersLoaded(target);
  target.gtag("js", new Date());
  target.gtag("config", gaId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  if (document.getElementById("parentive-ga4")) return;
  const script = document.createElement("script");
  script.id = "parentive-ga4";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
  document.head.appendChild(script);
}

function ensureMeta(pixelId: string): void {
  const target = measurementWindow();
  if (!target) return;
  if (!target.fbq) {
    const fbq = function fbq() {
      const command = arguments;
      const pixel = fbq as FbqFunction;
      const args = Array.from(command as ArrayLike<unknown>);
      if (pixel.callMethod) {
        pixel.callMethod(...args);
      } else {
        pixel.queue.push(args);
      }
    } as FbqFunction;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    target.fbq = fbq;
    target._fbq = fbq;
  }
  target.fbq.disablePushState = true;
  if (metaInstalled) {
    target.fbq("consent", "grant");
    return;
  }
  metaInstalled = true;
  markTrackersLoaded(target);
  target.fbq("set", "autoConfig", false, pixelId);
  target.fbq("init", pixelId);
  target.fbq("consent", "grant");
  if (document.getElementById("parentive-meta-pixel")) return;
  const script = document.createElement("script");
  script.id = "parentive-meta-pixel";
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
}

function campaignParams(campaign: UtmParams): Record<string, string> {
  const params: Record<string, string> = {};
  if (campaign.utm_source) params.campaign_source = campaign.utm_source;
  if (campaign.utm_medium) params.campaign_medium = campaign.utm_medium;
  if (campaign.utm_campaign) params.campaign_name = campaign.utm_campaign;
  return params;
}

export function restoreLandingQuery(landing: {
  path: string;
  params: UtmParams;
} | null): void {
  const target = measurementWindow();
  if (!target || !landing || !hasCoreUtm(landing.params)) return;
  if (target.location.pathname !== landing.path) return;
  const current = new URL(target.location.href);
  if (
    current.searchParams.get("utm_source") &&
    current.searchParams.get("utm_medium") &&
    current.searchParams.get("utm_campaign")
  ) {
    return;
  }
  for (const key of UTM_KEYS) {
    const value = landing.params[key];
    if (value) current.searchParams.set(key, value);
  }
  const next = `${current.pathname}${current.search}${current.hash}`;
  target.history.replaceState(target.history.state, "", next);
}

export function sendPlannedPageView(hit: PlannedPageView): void {
  try {
    if (hit.provider === "ga4") {
      ensureGa(hit.gaId);
      const target = measurementWindow();
      if (!target?.gtag) return;
      gaBudget.pageViews += 1;
      target.gtag("event", "page_view", {
        page_location: hit.pageLocation,
        page_referrer: hit.pageReferrer,
        send_to: hit.gaId,
        ...campaignParams(hit.campaign),
      });
      return;
    }
    ensureMeta(hit.pixelId);
    measurementWindow()?.fbq?.("track", "PageView");
  } catch {
    // Measurement must not break the page.
  }
}

export function sendSupportRequestLead(provider: "ga4" | "meta"): void {
  try {
    const target = measurementWindow();
    if (!target) return;
    const current = new URL(target.location.href);
    if (!isTrackableLocation(current.pathname, current.search, current.hash)) {
      return;
    }
    const pageLocation = publicPageUrl(target.location.href);
    if (!pageLocation) return;
    const pageReferrer = sanitizeReferrer(target.document.referrer);
    if (provider === "ga4") {
      const gaId = gaMeasurementId();
      if (!gaId) return;
      ensureGa(gaId);
      if (!target.gtag) return;
      gaBudget.leads += 1;
      target.gtag("event", "generate_lead", {
        send_to: gaId,
        page_location: pageLocation,
        page_referrer: pageReferrer,
      });
      return;
    }
    if (referrerIsSensitive(target.document.referrer)) return;
    const pixelId = metaPixelId();
    if (!pixelId) return;
    ensureMeta(pixelId);
    target.fbq?.("track", "Lead");
  } catch {
    // A measurement failure must not affect the saved request.
  }
}

export function revokeMeasurement(consent: {
  analytics: boolean;
  advertising: boolean;
}): void {
  try {
    const gaId = gaMeasurementId();
    if (gaId && !consent.analytics) {
      setGaDisabled(gaId, true);
      clearAnalyticsCookies(gaId);
    }
    if (gaId && consent.analytics) {
      setGaDisabled(gaId, false);
    }
    const target = measurementWindow();
    if (!consent.advertising) {
      clearAdvertisingCookies();
      target?.fbq?.("consent", "revoke");
    } else if (target?.fbq) {
      target.fbq("consent", "grant");
    }
  } catch {
    // Withdrawal bookkeeping must not break the page.
  }
}
