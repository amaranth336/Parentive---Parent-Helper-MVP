import { homepage } from "@/lib/homepage/content";
import {
  getFooterNavItems,
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
] as const;

describe("site navigation", () => {
  it("includes the live header labels", () => {
    expect(siteNav.map((item) => item.label)).toEqual([
      "Home",
      "Our Support",
      "How It Works",
      "Join The Team",
      "Early Access",
    ]);
  });

  it("derives hash destinations from homepage section IDs", () => {
    expect(siteNav.map((item) => item.href)).toEqual([
      "/",
      homepageSectionHref(homepage.support.id),
      homepageSectionHref(homepage.howItWorks.id),
      "/helpers",
      "/early-access",
    ]);
    expect(siteNav.map((item) => item.href)).toEqual([
      "/",
      "/#support",
      "/#how-it-works",
      "/helpers",
      "/early-access",
    ]);
  });

  it("does not link unimplemented routes", () => {
    const hrefs = siteNav.map((item) => item.href);

    for (const path of UNIMPLEMENTED_PATHS) {
      expect(hrefs).not.toContain(path);
    }
  });

  it("includes Home, sections, Join The Team, and Early Access in the live header", () => {
    const items = getVisibleNavItems();

    expect(items).toEqual(siteNav);
    expect(items).toEqual([
      { label: "Home", href: "/" },
      { label: "Our Support", href: "/#support" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Join The Team", href: "/helpers" },
      { label: "Early Access", href: "/early-access" },
    ]);
  });

  it("adds FAQ and Contact only to the footer navigation", () => {
    const headerItems = getVisibleNavItems();
    const footerItems = getFooterNavItems();

    expect(headerItems.map((item) => item.label)).not.toContain("FAQ");
    expect(headerItems.map((item) => item.label)).not.toContain("Contact");
    expect(footerItems.map((item) => item.label)).toEqual([
      "Home",
      "Our Support",
      "How It Works",
      "Join The Team",
      "Early Access",
      "FAQ",
      "Contact",
    ]);
    expect(footerItems).toEqual([
      ...headerItems,
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ]);
  });

  it("recognizes homepage hash hrefs", () => {
    expect(isHomepageHashHref("/#support")).toBe(true);
    expect(homepageHashId("/#how-it-works")).toBe("how-it-works");
    expect(isHomepageHashHref("/")).toBe(false);
    expect(homepageHashId("/")).toBeNull();
  });
});
