import { runInNewContext } from "node:vm";
import { HARD_NAVIGATION_SCRIPT } from "@/lib/analytics/hard-navigation";
import { createPageViewMemory, planPageViews } from "@/lib/analytics/page-views";
import { hardNavigationHref, isTrackableLocation } from "@/lib/analytics/routes";
import { publicPageUrl, sanitizeReferrer } from "@/lib/analytics/utm";

const origin = "https://parentive.ca";
const campaign = "utm_source=meta&utm_medium=paid_social&utm_campaign=every_village";
const clickId = "TEST1234567890_abc-DEF";
const landing = `${origin}/our-support?${campaign}&fbclid=${clickId}`;

function inlineNavigation(href: string): string | null {
  let assigned: string | null = null;
  const anchor = {
    href,
    target: "",
    nodeType: 1,
    hasAttribute: () => false,
    closest: () => anchor,
  };
  const event = {
    defaultPrevented: false,
    button: 0,
    target: anchor,
    preventDefault: () => undefined,
    stopPropagation: () => undefined,
    stopImmediatePropagation: () => undefined,
  };
  runInNewContext(HARD_NAVIGATION_SCRIPT, {
    URL,
    URLSearchParams,
    window: {
      __parentiveTrackers: true,
      location: { origin, assign: (href: string) => { assigned = href; } },
    },
    document: {
      addEventListener: (_type: string, handler: (event: object) => void) => handler(event),
    },
  });
  return assigned;
}

describe("Meta click landing measurement", () => {
  it("allows a valid click ID while sending only campaign parameters to GA4", () => {
    expect(isTrackableLocation("/our-support", new URL(landing).search)).toBe(true);
    expect(publicPageUrl(landing)).toBe(`${origin}/our-support?${campaign}`);
    expect(sanitizeReferrer(landing)).toBe(`${origin}/our-support`);
  });

  it("keeps consent and duplicate prevention in force for tagged ad visits", () => {
    const memory = createPageViewMemory();
    const request = {
      href: landing,
      referrer: "https://www.facebook.com/",
      consent: null,
      landing: null,
      gaId: "G-ABC1234",
      pixelId: "1234567890123456",
    };
    expect(planPageViews(memory, request)).toEqual([]);
    expect(planPageViews(memory, {
      ...request,
      consent: { analytics: false, advertising: false, version: 1 },
    })).toEqual([]);
    const analyticsOnly = {
      ...request,
      consent: { analytics: true, advertising: false, version: 1 as const },
    };
    expect(planPageViews(memory, analyticsOnly)).toEqual([expect.objectContaining({
      provider: "ga4",
      pageLocation: `${origin}/our-support?${campaign}`,
      campaign: { utm_source: "meta", utm_medium: "paid_social", utm_campaign: "every_village" },
    })]);
    expect(planPageViews(memory, analyticsOnly)).toEqual([]);
    expect(planPageViews(memory, {
      ...request,
      consent: { analytics: true, advertising: true, version: 1 },
    })).toEqual([{ provider: "meta", pixelId: request.pixelId }]);
    expect(planPageViews(memory, {
      ...analyticsOnly,
      href: landing.replace(clickId, "Different1234567890"),
    })).toEqual([]);
  });

  it.each([
    `${origin}/our-support?fbclid=4165551234`,
    `${origin}/our-support?fbclid=parent%40example.com`,
    `${origin}/our-support?fbclid=TEST%201234567890`,
    `${origin}/our-support?fbclid=`,
    `${origin}/our-support?fbclid=${"a".repeat(501)}`,
    `${landing}&fbclid=Another1234567890`,
    `${landing}&phone=4165551234`,
    `${landing}&email=parent%40example.com`,
    `${landing}&name=Jane`,
    `${landing}&other=TEST1234567890`,
    `${origin}/our-support?gclid=TEST1234567890`,
    `${origin}/our-support?FBCLID=TEST1234567890`,
    `${landing}#phone=4165551234`,
    `${origin}/health?fbclid=${clickId}`,
    `${origin}/helpers?fbclid=${clickId}`,
  ])("keeps blocked locations excluded in both navigation guards: %s", (href) => {
    const url = new URL(href);
    expect(isTrackableLocation(url.pathname, url.search, url.hash)).toBe(false);
    expect(hardNavigationHref(href, origin)).toBe(href);
    expect(inlineNavigation(href)).toBe(href);
    expect(planPageViews(createPageViewMemory(), {
      href,
      referrer: "",
      consent: { analytics: true, advertising: true, version: 1 },
      landing: null,
      gaId: "G-ABC1234",
      pixelId: "1234567890123456",
    })).toEqual([]);
  });

  it.each(["/", "/faq", "/our-support"])("allows ad visits in both navigation guards: %s", (path) => {
    const href = `${origin}${path}?${campaign}&fbclid=${clickId}`;
    expect(hardNavigationHref(href, origin)).toBeNull();
    expect(inlineNavigation(href)).toBeNull();
  });
});
