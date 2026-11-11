"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isTrackableLocation } from "@/lib/analytics/routes";
import { trackersAreLoaded } from "@/lib/analytics/providers";
import { trackCurrentDocument } from "@/lib/analytics/track";
import type { MeasurementConsent } from "@/lib/analytics/consent";

export function MeasurementTracker({
  consent,
  ready,
}: {
  consent: MeasurementConsent | null;
  ready: boolean;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (!ready || !consent) return;
    let checking = false;

    const check = () => {
      if (checking) return;
      checking = true;
      try {
        trackCurrentDocument(consent);
        if (
          trackersAreLoaded() &&
          !isTrackableLocation(
            window.location.pathname,
            window.location.search,
            window.location.hash,
          )
        ) {
          window.location.replace(window.location.href);
        }
      } finally {
        checking = false;
      }
    };

    check();
    window.addEventListener("hashchange", check);
    window.addEventListener("popstate", check);
    const originalPush = window.history.pushState.bind(window.history);
    const originalReplace = window.history.replaceState.bind(window.history);
    window.history.pushState = (...args: Parameters<History["pushState"]>) => {
      originalPush(...args);
      check();
    };
    window.history.replaceState = (
      ...args: Parameters<History["replaceState"]>
    ) => {
      originalReplace(...args);
      check();
    };

    return () => {
      window.removeEventListener("hashchange", check);
      window.removeEventListener("popstate", check);
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
    };
  }, [consent, pathname, ready]);

  return null;
}
