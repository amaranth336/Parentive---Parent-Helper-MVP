import { homepage } from "@/lib/homepage/content";
import {
  getVisibleNavItems,
  homepageHashId,
  homepageSectionHref,
  isHomepageHashHref,
  siteNav,
} from "./site-nav";

const UNIMPLEMENTED_PATHS = [
  "/services",
  "/pricing",
  "/how-it-works",
  "/request",
  "/helpers",
] as const;

describe("site navigation", () => {
  it("includes the four live labels", () => {
    expect(siteNav.map((item) => item.label)).toEqual([
      "Home",
      "Our Support",
      "How It Works",
      "Early Access",
    ]);
  });

  it("derives hash destinations from homepage section IDs", () => {
    expect(siteNav.map((item) => item.href)).toEqual([
      "/",
      homepageSectionHref(homepage.support.id),
      homepageSectionHref(homepage.howItWorks.id),
      "/early-access",
    ]);
    expect(siteNav.map((item) => item.href)).toEqual([
      "/",
      "/#support",
      "/#how-it-works",
      "/early-access",
    ]);
  });

  it("does not link unimplemented routes", () => {
    const hrefs = siteNav.map((item) => item.href);

    for (const path of UNIMPLEMENTED_PATHS) {
      expect(hrefs).not.toContain(path);
    }
  });

  it("includes Home and the three section links in the live header", () => {
    const items = getVisibleNavItems();

    expect(items).toEqual(siteNav);
    expect(items).toEqual([
      { label: "Home", href: "/" },
      { label: "Our Support", href: "/#support" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Early Access", href: "/early-access" },
    ]);
  });

  it("recognizes homepage hash hrefs", () => {
    expect(isHomepageHashHref("/#support")).toBe(true);
    expect(homepageHashId("/#how-it-works")).toBe("how-it-works");
    expect(isHomepageHashHref("/")).toBe(false);
    expect(homepageHashId("/")).toBeNull();
  });
});
