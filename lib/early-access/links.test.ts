import { readFileSync } from "node:fs";
import { join } from "node:path";
import { siteNav } from "@/components/site-nav";
import { homepage, homepageCtas } from "@/lib/homepage/content";
import { EARLY_ACCESS_COPY, PRIVACY_PAGE } from "./copy";

const ALLOWED_HREF =
  /^\/$|^\/#[A-Za-z0-9/_-]+$|^\/early-access$|^\/helpers$|^\/privacy$|^\/privacy#founding-helper-applications$|^\/design-system$/;

function isPublicLinkKey(key: string): boolean {
  return key === "href" || key.endsWith("Href") || key.endsWith("Path");
}

function collectPublicHrefs(...values: unknown[]): string[] {
  const hrefs = new Set<string>();

  function walk(value: unknown, key?: string) {
    if (typeof value === "string") {
      if (
        key &&
        isPublicLinkKey(key) &&
        value.startsWith("/") &&
        !value.startsWith("//")
      ) {
        hrefs.add(value);
      }
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => walk(item));
      return;
    }

    if (value && typeof value === "object") {
      for (const [childKey, childValue] of Object.entries(value)) {
        walk(childValue, childKey);
      }
    }
  }

  values.forEach((value) => walk(value));
  return [...hrefs];
}

describe("public early-access links", () => {
  const hrefs = collectPublicHrefs(
    homepage,
    homepageCtas,
    siteNav,
    EARLY_ACCESS_COPY,
    PRIVACY_PAGE,
  );

  it("only exposes approved public paths", () => {
    expect(hrefs).toEqual(
      expect.arrayContaining([
        "/",
        "/#support",
        "/#how-it-works",
        "/helpers",
        "/early-access",
        "/privacy",
      ]),
    );

    for (const href of hrefs) {
      expect(href).toMatch(ALLOWED_HREF);
      expect(href).not.toBe("/request");
    }
  });

  it("reads link fields and ignores slash-containing prose", () => {
    const collected = collectPublicHrefs(
      {
        href: "/request",
        label: "Bedroom reset - including washing/changing bedding",
      },
      { backHref: "/helpers" },
      { privacyPath: "/privacy" },
      { body: "See washing/changing and and/or notes" },
    );

    expect(collected).toEqual(
      expect.arrayContaining(["/request", "/helpers", "/privacy"]),
    );
    expect(collected).not.toContain("/changing");
    expect(collected).not.toContain("/or");
    expect(hrefs).not.toContain("/changing");
  });

  it("uses /early-access for the Early Access nav item", () => {
    expect(siteNav.find((item) => item.label === "Early Access")?.href).toBe(
      "/early-access",
    );
  });

  it("never points public inventory at /request", () => {
    expect(hrefs).not.toContain("/request");
    expect(JSON.stringify({ homepage, siteNav, EARLY_ACCESS_COPY, PRIVACY_PAGE })).not.toContain(
      "/request",
    );
  });

  it("keeps the service-role client off the waitlist form", () => {
    const formSource = readFileSync(
      join(process.cwd(), "components", "early-access-form.tsx"),
      "utf8",
    );
    const pageSource = readFileSync(
      join(process.cwd(), "app", "early-access", "page.tsx"),
      "utf8",
    );
    const pageContentSource = readFileSync(
      join(process.cwd(), "components", "early-access-page-content.tsx"),
      "utf8",
    );

    for (const source of [formSource, pageSource, pageContentSource]) {
      expect(source).not.toMatch(/lib\/supabase\/admin/);
      expect(source).not.toMatch(/createServiceRoleClient/);
      expect(source).not.toMatch(/SUPABASE_SERVICE_ROLE_KEY/);
      expect(source).not.toMatch(/lib\/early-access\/handler/);
      expect(source).not.toMatch(/lib\/early-access\/submit/);
    }
  });
});
