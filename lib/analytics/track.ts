import type { MeasurementConsent } from "@/lib/analytics/consent";
import { readStoredConsent } from "@/lib/analytics/consent";
import { gaMeasurementId, metaPixelId } from "@/lib/analytics/ids";
import { isTrackableLocation } from "@/lib/analytics/routes";
import {
  createPageViewMemory,
  planPageViews,
  planSupportRequestLead,
  type PageViewMemory,
} from "@/lib/analytics/page-views";
import {
  restoreLandingQuery,
  revokeMeasurement,
  sendPlannedPageView,
  sendSupportRequestLead,
} from "@/lib/analytics/providers";
import {
  LANDING_UTM_STORAGE_KEY,
  landingFromLocation,
  parseStoredLanding,
  type LandingUtm,
} from "@/lib/analytics/utm";

const pageViews: PageViewMemory = createPageViewMemory();
let activeConsent: MeasurementConsent | null = null;

function readLanding(): LandingUtm | null {
  try {
    const stored = parseStoredLanding(
      window.sessionStorage.getItem(LANDING_UTM_STORAGE_KEY),
    );
    if (stored) return stored;
    const fresh = landingFromLocation(window.location.href);
    if (!fresh) return null;
    window.sessionStorage.setItem(LANDING_UTM_STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  } catch {
    return landingFromLocation(window.location.href);
  }
}

export function trackCurrentDocument(consent: MeasurementConsent | null): void {
  activeConsent = consent;
  if (typeof window === "undefined" || !consent) return;
  try {
    if (
      !isTrackableLocation(
        window.location.pathname,
        window.location.search,
        window.location.hash,
      )
    ) {
      return;
    }
    const landing = readLanding();
    if (consent.analytics || consent.advertising) {
      restoreLandingQuery(landing);
    }
    const hits = planPageViews(pageViews, {
      href: window.location.href,
      referrer: document.referrer,
      consent,
      landing,
      gaId: gaMeasurementId(),
      pixelId: metaPixelId(),
    });
    for (const hit of hits) sendPlannedPageView(hit);
  } catch {
    // Measurement must not break the page.
  }
}

export function applyMeasurementConsent(consent: MeasurementConsent): void {
  activeConsent = consent;
  revokeMeasurement(consent);
}

/** Call only after the support-request API confirms the row was saved. */
export function recordSavedSupportRequest(): void {
  try {
    if (typeof window === "undefined") return;
    const consent = activeConsent ?? readStoredConsent(window.localStorage);
    const providers = planSupportRequestLead(
      consent,
      gaMeasurementId(),
      metaPixelId(),
      {
        href: window.location.href,
        referrer: document.referrer,
      },
    );
    for (const provider of providers) sendSupportRequestLead(provider);
  } catch {
    // A measurement failure must not affect the saved request.
  }
}
