import { readFileSync } from "node:fs";
import { join } from "node:path";
import { siteNav } from "@/components/site-nav";
import { homepage, homepageCtas } from "@/lib/homepage/content";
import { EARLY_ACCESS_COPY, PRIVACY_PAGE } from "./copy";

const ALLOWED_HREF =
  /^\/$|^\/#[A-Za-z0-9/_-]+$|^\/early-access$|^\/privacy$|^\/design-system$/;

function collectPublicHrefs(...values: unknown[]): string[] {
  const hrefs = new Set<string>();

  function walk(value: unknown) {
    if (typeof value === "string") {
      for (const match of value.matchAll(/\/(?:#[A-Za-z0-9/_-]+|[A-Za-z0-9/_-]+)/g)) {
        const href = match[0].replace(/[.,;:!?)]+$/, "");
        if (href.startsWith("/") && !href.startsWith("//")) {
          hrefs.add(href);
        }
      }
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }

    if (value && typeof value === "object") {
      Object.values(value).forEach(walk);
    }
  }

  values.forEach(walk);
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
    expect(hrefs.length).toBeGreaterThan(0);

    for (const href of hrefs) {
      expect(href).toMatch(ALLOWED_HREF);
      expect(href).not.toBe("/request");
    }
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

    for (const source of [formSource, pageSource]) {
      expect(source).not.toMatch(/lib\/supabase\/admin/);
      expect(source).not.toMatch(/createServiceRoleClient/);
      expect(source).not.toMatch(/SUPABASE_SERVICE_ROLE_KEY/);
      expect(source).not.toMatch(/lib\/early-access\/handler/);
      expect(source).not.toMatch(/lib\/early-access\/submit/);
    }
  });
});
