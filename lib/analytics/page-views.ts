import type { MeasurementConsent } from "@/lib/analytics/consent";
import { isTrackableLocation } from "@/lib/analytics/routes";
import {
  hasCoreUtm,
  measurementPageLocation,
  readUtmParams,
  referrerIsSensitive,
  sanitizeReferrer,
  type LandingUtm,
  type UtmParams,
} from "@/lib/analytics/utm";

export type PageViewMemory = {
  analytics: Set<string>;
  advertising: Set<string>;
};

export function createPageViewMemory(): PageViewMemory {
  return { analytics: new Set(), advertising: new Set() };
}

export type PageViewRequest = {
  href: string;
  referrer: string;
  consent: MeasurementConsent | null;
  landing: LandingUtm | null;
  gaId: string | null;
  pixelId: string | null;
};

export type PlannedPageView =
  | {
      provider: "ga4";
      gaId: string;
      pageLocation: string;
      pageReferrer: string;
      campaign: UtmParams;
    }
  | {
      provider: "meta";
      pixelId: string;
    };

function campaignFrom(current: UtmParams, landing: LandingUtm | null): UtmParams {
  if (hasCoreUtm(current)) return current;
  if (landing && hasCoreUtm(landing.params)) return landing.params;
  return {};
}

/**
 * Plans at most one hit per provider for a page location. Calling it again
 * for the same location and provider returns nothing.
 */
export function planPageViews(
  memory: PageViewMemory,
  request: PageViewRequest,
): PlannedPageView[] {
  if (!request.consent) return [];
  const url = new URL(request.href);
  if (!isTrackableLocation(url.pathname, url.search, url.hash)) return [];

  const pageLocation = measurementPageLocation(request.href, request.landing);
  if (!pageLocation) return [];

  const hits: PlannedPageView[] = [];

  if (request.consent.analytics && request.gaId) {
    const key = pageLocation;
    if (!memory.analytics.has(key)) {
      memory.analytics.add(key);
      hits.push({
        provider: "ga4",
        gaId: request.gaId,
        pageLocation,
        pageReferrer: sanitizeReferrer(request.referrer),
        campaign: campaignFrom(readUtmParams(new URL(pageLocation).search), request.landing),
      });
    }
  }

  if (
    request.consent.advertising &&
    request.pixelId &&
    !referrerIsSensitive(request.referrer)
  ) {
    const key = pageLocation;
    if (!memory.advertising.has(key)) {
      memory.advertising.add(key);
      hits.push({
        provider: "meta",
        pixelId: request.pixelId,
      });
    }
  }

  return hits;
}

export type LeadProvider = "ga4" | "meta";

export type LeadContext = {
  href: string;
  referrer: string;
};

/**
 * A lead is sent only from a page that itself can be measured. A sensitive
 * referrer can be omitted for GA4. Meta cannot strip it, so that lead is skipped.
 */
export function planSupportRequestLead(
  consent: MeasurementConsent | null,
  gaId: string | null,
  pixelId: string | null,
  context: LeadContext,
): LeadProvider[] {
  if (!consent) return [];
  let url: URL;
  try {
    url = new URL(context.href);
  } catch {
    return [];
  }
  if (!isTrackableLocation(url.pathname, url.search, url.hash)) return [];
  const providers: LeadProvider[] = [];
  if (consent.analytics && gaId) providers.push("ga4");
  if (
    consent.advertising &&
    pixelId &&
    !referrerIsSensitive(context.referrer)
  ) {
    providers.push("meta");
  }
  return providers;
}
