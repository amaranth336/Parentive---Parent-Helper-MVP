import { readFileSync } from "node:fs";
import { join } from "node:path";
import { runInNewContext } from "node:vm";
import { parseConsent, serializeConsent } from "@/lib/analytics/consent";
import {
  createGaForwardBudget,
  shouldForwardGaCommand,
} from "@/lib/analytics/ga-forward";
import { HARD_NAVIGATION_SCRIPT } from "@/lib/analytics/hard-navigation";
import { parseGaMeasurementId, parseMetaPixelId } from "@/lib/analytics/ids";
import {
  createPageViewMemory,
  planPageViews,
  planSupportRequestLead,
} from "@/lib/analytics/page-views";
import {
  hardNavigationHref,
  isTrackablePath,
  SENSITIVE_QUERY_KEYS,
} from "@/lib/analytics/routes";
import {
  LANDING_CAPTURE_SCRIPT,
  LANDING_UTM_STORAGE_KEY,
  measurementPageLocation,
  publicPageUrl,
  sanitizeReferrer,
} from "@/lib/analytics/utm";

const SHOPS =
  "https://www.parentive.ca/?utm_source=community_placements&utm_medium=print&utm_campaign=evergreen_flyer";
const DOORS =
  "https://www.parentive.ca/?utm_source=door_to_door&utm_medium=print&utm_campaign=evergreen_flyer";
const APEX_SHOPS =
  "https://parentive.ca/?utm_source=community_placements&utm_medium=print&utm_campaign=evergreen_flyer";

const consent = {
  analytics: true,
  advertising: true,
  version: 1 as const,
};

function read(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("measurement ids", () => {
  it("rejects missing, placeholder, and malformed ids", () => {
    expect(parseGaMeasurementId(undefined)).toBeNull();
    expect(parseGaMeasurementId("")).toBeNull();
    expect(parseGaMeasurementId("G-XXXXXXXXXX")).toBeNull();
    expect(parseGaMeasurementId("UA-123")).toBeNull();
    expect(parseMetaPixelId(undefined)).toBeNull();
    expect(parseMetaPixelId("000000000000000")).toBeNull();
    expect(parseMetaPixelId("pixel")).toBeNull();
  });

  it("accepts a real measurement id and numeric pixel id", () => {
    expect(parseGaMeasurementId("G-ABC1234")).toBe("G-ABC1234");
    expect(parseGaMeasurementId("G-X1Y2Z3")).toBe("G-X1Y2Z3");
    expect(parseMetaPixelId("1234567890123456")).toBe("1234567890123456");
  });
});

describe("flyer landing urls", () => {
  it("keeps the printed UTM query exactly, including after the apex host", () => {
    expect(publicPageUrl(SHOPS)).toBe(SHOPS);
    expect(publicPageUrl(DOORS)).toBe(DOORS);
    expect(publicPageUrl(APEX_SHOPS)).toBe(APEX_SHOPS);
    expect(publicPageUrl(SHOPS)).toContain("utm_source=community_placements");
    expect(publicPageUrl(SHOPS)).toContain("utm_medium=print");
    expect(publicPageUrl(SHOPS)).toContain("utm_campaign=evergreen_flyer");
    expect(publicPageUrl(DOORS)).toContain("utm_source=door_to_door");
  });

  it("restores a stripped landing URL without renaming the campaign", () => {
    const restored = measurementPageLocation("https://parentive.ca/", {
      path: "/",
      params: {
        utm_source: "door_to_door",
        utm_medium: "print",
        utm_campaign: "evergreen_flyer",
      },
    });
    expect(restored).toBe(
      "https://parentive.ca/?utm_source=door_to_door&utm_medium=print&utm_campaign=evergreen_flyer",
    );
  });

  it("does not forward an email address or a sensitive referrer", () => {
    expect(
      publicPageUrl(`${SHOPS}&email=parent@example.com`),
    ).toBeNull();
    expect(sanitizeReferrer("https://example.com/invite?email=parent@example.com")).toBe(
      "",
    );
    expect(sanitizeReferrer("https://www.google.com/search?q=parentive")).toBe(
      "https://www.google.com/search",
    );
  });
});

describe("landing capture script", () => {
  function capture(href: string, existing: string | null = null): string | null {
    const store = new Map<string, string>();
    if (existing) store.set(LANDING_UTM_STORAGE_KEY, existing);
    const location = new URL(href);
    runInNewContext(LANDING_CAPTURE_SCRIPT, {
      window: {
        location,
        sessionStorage: {
          getItem: (key: string) => store.get(key) ?? null,
          setItem: (key: string, value: string) => {
            store.set(key, value);
          },
        },
      },
      URLSearchParams,
      JSON,
    });
    return store.get(LANDING_UTM_STORAGE_KEY) ?? null;
  }

  it("stores the first flyer touch and does not call a third party", () => {
    expect(LANDING_CAPTURE_SCRIPT).not.toMatch(/google|facebook|doubleclick|gtag|fbq/i);
    const stored = capture(SHOPS);
    expect(stored).toContain("community_placements");
    expect(stored).toContain("evergreen_flyer");
    expect(capture(DOORS, stored)).toBe(stored);
  });
});

describe("where measurement is allowed", () => {
  it("allows the homepage, FAQ, and support request only", () => {
    expect(isTrackablePath("/")).toBe(true);
    expect(isTrackablePath("/faq")).toBe(true);
    expect(isTrackablePath("/our-support")).toBe(true);
    for (const path of [
      "/helpers",
      "/early-access",
      "/contact",
      "/privacy",
      "/privacy/notice",
      "/design-system",
      "/admin",
      "/accounts",
      "/search",
      "/fertility",
      "/health/resources",
      "/go/shops",
      "/go/door",
    ]) {
      expect(isTrackablePath(path)).toBe(false);
    }
  });

  it("uses a full document load when leaving an allowed page", () => {
    expect(
      hardNavigationHref("https://parentive.ca/helpers", "https://parentive.ca"),
    ).toBe("https://parentive.ca/helpers");
    expect(
      hardNavigationHref("https://parentive.ca/faq", "https://parentive.ca"),
    ).toBeNull();
    expect(
      hardNavigationHref("https://example.com/faq", "https://parentive.ca"),
    ).toBeNull();
    expect(
      hardNavigationHref(
        "https://parentive.ca/faq#parent@example.com",
        "https://parentive.ca",
      ),
    ).toBe("https://parentive.ca/faq#parent@example.com");
    expect(
      hardNavigationHref(
        "https://parentive.ca/our-support?tel=4165551234",
        "https://parentive.ca",
      ),
    ).toBe("https://parentive.ca/our-support?tel=4165551234");
    expect(
      hardNavigationHref(
        "https://parentive.ca/faq#name=Jane",
        "https://parentive.ca",
      ),
    ).toBe("https://parentive.ca/faq#name=Jane");
    expect(
      hardNavigationHref(
        "https://parentive.ca/faq#phone=555-121",
        "https://parentive.ca",
      ),
    ).toBe("https://parentive.ca/faq#phone=555-121");
    expect(HARD_NAVIGATION_SCRIPT).toContain('"/our-support"');
    expect(HARD_NAVIGATION_SCRIPT).toContain(">=7");
    for (const key of SENSITIVE_QUERY_KEYS) {
      expect(HARD_NAVIGATION_SCRIPT).toContain(`"${key}"`);
    }
    expect(HARD_NAVIGATION_SCRIPT).not.toMatch(/googletagmanager|facebook\.net/);
  });

  it("assigns a full document load for a same-page personal query or hash", () => {
    const hrefs = [
      "https://parentive.ca/our-support?tel=4165551234",
      "https://parentive.ca/faq#name=Jane",
      "https://parentive.ca/faq#phone=555-121",
    ];
    for (const href of hrefs) {
    let assigned: string | null = null;
    const anchor = {
      href,
      target: "",
      nodeType: 1,
      hasAttribute: () => false,
      closest: () => anchor,
    };
    runInNewContext(HARD_NAVIGATION_SCRIPT, {
      URL,
      URLSearchParams,
      window: {
        __parentiveTrackers: true,
        location: {
          origin: "https://parentive.ca",
          assign: (href: string) => {
            assigned = href;
          },
        },
      },
      document: {
        addEventListener: (
          _type: string,
          handler: (event: {
            defaultPrevented: boolean;
            button: number;
            metaKey: boolean;
            ctrlKey: boolean;
            shiftKey: boolean;
            altKey: boolean;
            target: typeof anchor;
            preventDefault: () => void;
            stopPropagation: () => void;
            stopImmediatePropagation: () => void;
          }) => void,
        ) => {
          handler({
            defaultPrevented: false,
            button: 0,
            metaKey: false,
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            target: anchor,
            preventDefault: () => undefined,
            stopPropagation: () => undefined,
            stopImmediatePropagation: () => undefined,
          });
        },
      },
    });
    expect(assigned).toBe(href);
    }
  });
});

describe("page view and lead planning", () => {
  const memory = () => createPageViewMemory();

  it("uses the UTM values on the current page when they differ from an older stored visit", () => {
    const hits = planPageViews(memory(), {
      href: "https://parentive.ca/?utm_source=door_to_door&utm_medium=print&utm_campaign=evergreen_flyer",
      referrer: "",
      consent,
      landing: {
        path: "/",
        params: {
          utm_source: "community_placements",
          utm_medium: "print",
          utm_campaign: "evergreen_flyer",
        },
      },
      gaId: "G-ABC1234",
      pixelId: null,
    });
    expect(hits[0]).toMatchObject({
      provider: "ga4",
      pageLocation:
        "https://parentive.ca/?utm_source=door_to_door&utm_medium=print&utm_campaign=evergreen_flyer",
      campaign: {
        utm_source: "door_to_door",
        utm_medium: "print",
        utm_campaign: "evergreen_flyer",
      },
    });
  });

  it("plans one GA4 page view with the tagged landing URL", () => {
    const hits = planPageViews(memory(), {
      href: APEX_SHOPS,
      referrer: "",
      consent,
      landing: {
        path: "/",
        params: {
          utm_source: "community_placements",
          utm_medium: "print",
          utm_campaign: "evergreen_flyer",
        },
      },
      gaId: "G-ABC1234",
      pixelId: "1234567890123456",
    });
    const ga = hits.find((hit) => hit.provider === "ga4");
    const meta = hits.find((hit) => hit.provider === "meta");
    expect(ga).toMatchObject({
      provider: "ga4",
      pageLocation: APEX_SHOPS,
      campaign: {
        utm_source: "community_placements",
        utm_medium: "print",
        utm_campaign: "evergreen_flyer",
      },
    });
    expect(meta).toMatchObject({ provider: "meta" });
  });

  it("does not plan a second hit for the same page, consent change, or missing permission", () => {
    const state = memory();
    const request = {
      href: "https://parentive.ca/faq",
      referrer: "",
      consent,
      landing: null,
      gaId: "G-ABC1234",
      pixelId: "1234567890123456",
    };
    expect(planPageViews(state, request)).toHaveLength(2);
    expect(planPageViews(state, request)).toHaveLength(0);
    expect(
      planPageViews(state, {
        ...request,
        href: "https://parentive.ca/our-support",
        consent: { ...consent, advertising: false },
      }).map((hit) => hit.provider),
    ).toEqual(["ga4"]);
    expect(
      planPageViews(memory(), { ...request, consent: null }),
    ).toHaveLength(0);
    expect(
      planPageViews(memory(), {
        ...request,
        href: "https://parentive.ca/helpers",
      }),
    ).toHaveLength(0);
    expect(
      planPageViews(memory(), {
        ...request,
        href: "https://parentive.ca/faq#parent@example.com",
      }),
    ).toHaveLength(0);
    expect(
      planPageViews(memory(), {
        ...request,
        href: "https://parentive.ca/faq#name=Jane",
      }),
    ).toHaveLength(0);
  });

  it("plans a support-request lead only for the allowed providers", () => {
    const saved = {
      href: "https://parentive.ca/our-support",
      referrer: "",
    };
    expect(
      planSupportRequestLead(consent, "G-ABC1234", "1234567890123456", saved),
    ).toEqual(["ga4", "meta"]);
    expect(
      planSupportRequestLead(
        { ...consent, advertising: false },
        "G-ABC1234",
        "1234567890123456",
        saved,
      ),
    ).toEqual(["ga4"]);
    expect(
      planSupportRequestLead(
        { ...consent, analytics: false },
        "G-ABC1234",
        "1234567890123456",
        saved,
      ),
    ).toEqual(["meta"]);
    expect(
      planSupportRequestLead(
        { ...consent, analytics: false, advertising: false },
        "G-ABC1234",
        "1234567890123456",
        saved,
      ),
    ).toEqual([]);
    expect(planSupportRequestLead(consent, null, null, saved)).toEqual([]);
    expect(
      planSupportRequestLead(null, "G-ABC1234", "1234567890123456", saved),
    ).toEqual([]);
    expect(
      planSupportRequestLead(consent, "G-ABC1234", "1234567890123456", {
        href: "https://parentive.ca/our-support?email=parent@example.com",
        referrer: "",
      }),
    ).toEqual([]);
    expect(
      planSupportRequestLead(consent, "G-ABC1234", "1234567890123456", {
        href: "https://parentive.ca/faq#name=Jane",
        referrer: "",
      }),
    ).toEqual([]);
    expect(
      planSupportRequestLead(consent, "G-ABC1234", "1234567890123456", {
        href: "https://parentive.ca/our-support",
        referrer: "https://example.com/invite?email=parent@example.com",
      }),
    ).toEqual(["ga4"]);
  });

  it("drops automatic GA events and forwards one expected lead", () => {
    const budget = createGaForwardBudget();
    expect(shouldForwardGaCommand(["event", "form_submit", {}], budget)).toBe(false);
    expect(shouldForwardGaCommand(["event", "click", {}], budget)).toBe(false);
    expect(shouldForwardGaCommand(["event", "session_start", {}], budget)).toBe(false);
    expect(shouldForwardGaCommand(["event", "first_visit", {}], budget)).toBe(false);
    expect(shouldForwardGaCommand(["event", "user_engagement", {}], budget)).toBe(
      false,
    );
    expect(shouldForwardGaCommand(["config", "G-ABC1234", {}], budget)).toBe(true);
    expect(shouldForwardGaCommand(["event", "page_view", {}], budget)).toBe(false);
    budget.pageViews = 1;
    expect(shouldForwardGaCommand(["event", "page_view", {}], budget)).toBe(true);
    expect(shouldForwardGaCommand(["event", "page_view", {}], budget)).toBe(false);
    budget.leads = 1;
    expect(shouldForwardGaCommand(["event", "generate_lead", {}], budget)).toBe(true);
    expect(shouldForwardGaCommand({ event: "generate_lead" }, budget)).toBe(false);
  });
});

describe("consent storage", () => {
  it("round-trips the two choices and rejects an older version", () => {
    const stored = serializeConsent({
      analytics: true,
      advertising: false,
      version: 1,
    });
    expect(parseConsent(stored)).toEqual({
      analytics: true,
      advertising: false,
      version: 1,
    });
    expect(parseConsent(JSON.stringify({ analytics: true, advertising: true, version: 0 }))).toBeNull();
  });
});

describe("measurement wiring", () => {
  it("adds the env names and keeps provider scripts out of the server layout", () => {
    const env = read(".env.example");
    expect(env).toContain("NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX");
    expect(env).toContain("NEXT_PUBLIC_META_PIXEL_ID=000000000000000");
    const layout = read("app/layout.tsx");
    expect(layout).not.toContain("googletagmanager");
    expect(layout).not.toContain("fbevents");
    expect(layout).not.toContain("facebook.com/tr");
    const providers = read("lib/analytics/providers.ts");
    expect(providers).not.toContain("<noscript");
    expect(providers).not.toContain("facebook.com/tr");
  });

  it("records a lead only after the support request is confirmed saved", () => {
    const support = read("components/our-support-experience.tsx");
    const calls = support.match(/recordSavedSupportRequest\(\)/g) ?? [];
    expect(calls).toHaveLength(1);
    const callAt = support.indexOf("recordSavedSupportRequest()");
    expect(support.slice(0, callAt)).toContain("isVerifiedVisitRequestSuccess");
    expect(support.slice(callAt)).toContain("return;");

    for (const file of [
      "components/contact-form.tsx",
      "components/early-access-form.tsx",
      "components/helpers-application-form.tsx",
    ]) {
      expect(read(file)).not.toContain("recordSavedSupportRequest");
    }
  });

  it("does not add flyer redirect routes", () => {
    expect(() => read("app/go/shops/page.tsx")).toThrow();
    expect(() => read("app/go/door/page.tsx")).toThrow();
  });

  it("explains both tools in the privacy notice", () => {
    const notice = read("lib/analytics/copy.ts");
    const page = read("app/privacy/notice/page.tsx");
    expect(notice).toContain("Google Analytics 4");
    expect(notice).toContain("Meta Pixel");
    expect(notice).toContain("Privacy choices");
    expect(page).toContain("WebsiteMeasurementNotice");
    expect(read("components/privacy-notices.tsx")).toContain("MEASUREMENT_PRIVACY");
  });
});
