import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getFooterNavItems, siteNav } from "@/components/site-nav";
import {
  CONTACT_HEADING,
  CONTACT_HELPERS_LINK_LABEL,
  CONTACT_PRIVACY_LINK_LABEL,
  CONTACT_PRIVACY_NOTE,
  CONTACT_SUPPORTING,
  HELPERS_PATH,
  PRIVACY_PATH,
  SUBMIT_IDLE_LABEL,
  SUBMIT_PENDING_LABEL,
  SUCCESS_HEADING,
  SUCCESS_MESSAGE,
} from "./copy";

function read(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("contact page contract", () => {
  const pageSource = read("app/contact/page.tsx");
  const formSource = read("components/contact-form.tsx");
  const cssSource = read("app/globals.css");
  const migrationSource = read(
    "supabase/migrations/20261001120000_create_contact_inquiries.sql",
  );

  it("exports contact metadata from a server page", () => {
    expect(pageSource).toContain("export const metadata: Metadata");
    expect(pageSource).toContain('title: "Contact — Parentive"');
    expect(pageSource).toContain("CONTACT_SUPPORTING");
    expect(pageSource).not.toMatch(/["']use client["']/);
    expect(CONTACT_HEADING).toBe("Get in touch");
    expect(CONTACT_SUPPORTING).toBe(
      "Have a question about Parentive? Send us a note and we'll be in touch.",
    );
    expect(SUCCESS_HEADING).toBe("Message received");
    expect(SUCCESS_MESSAGE).toBe(
      "Thanks. We received your message and will be in touch.",
    );
  });

  it("renders the contact hero photo inside the existing frame", () => {
    expect(pageSource).toContain("contact-hero");
    expect(pageSource).toContain('from "next/image"');
    expect(pageSource).toContain(
      "@/public/images/contact/contact-hero-mother-with-children.png",
    );
    expect(pageSource).toContain("contact-hero-image");
    expect(pageSource).toContain("fill");
    expect(pageSource).toContain('className="page contact"');
    expect(pageSource).toContain('id="main-content"');
    expect(pageSource).not.toContain("image goes here");
    expect(pageSource).not.toContain('aria-hidden="true"');
    expect(cssSource).toContain(".contact-hero");
    expect(cssSource).toMatch(
      /\.contact-hero\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9/,
    );
    expect(cssSource).toMatch(
      /@media \(min-width:\s*800px\)\s*\{\s*\.contact-hero\s*\{[^}]*aspect-ratio:\s*2\.2\s*\/\s*1/,
    );
    expect(cssSource).toContain("position: relative");
    expect(cssSource).toContain(".contact-hero-image");
    expect(cssSource).toMatch(
      /\.contact-hero-image\s*\{[^}]*object-fit:\s*cover/,
    );
    expect(cssSource).toMatch(
      /\.contact-hero-image\s*\{[^}]*object-position:\s*60% center/,
    );
    expect(cssSource).toMatch(
      /@media \(min-width:\s*800px\)\s*\{[\s\S]*?\.contact-hero-image\s*\{[^}]*object-position:\s*center center/,
    );
    expect(cssSource).not.toMatch(/\.contact-hero[\s\S]{0,240}url\(/);
  });

  it("keeps the helper note and privacy link outside new legal promises", () => {
    expect(CONTACT_HELPERS_LINK_LABEL).toBe("Join The Team");
    expect(HELPERS_PATH).toBe("/helpers");
    expect(PRIVACY_PATH).toBe("/privacy");
    expect(CONTACT_PRIVACY_NOTE).toBe(
      "We use your name, email, phone if you share one, and message so we can reply.",
    );
    expect(CONTACT_PRIVACY_LINK_LABEL).toBe("Read the privacy notice");
    expect(SUBMIT_IDLE_LABEL).toBe("Send message");
    expect(SUBMIT_PENDING_LABEL).toBe("Submitting…");
    expect(pageSource).toContain('className="contact-helpers-note"');
    expect(pageSource).toContain("CONTACT_HELPERS_LINK_LABEL");
    expect(pageSource).toContain("HELPERS_PATH");
    expect(formSource).toContain("CONTACT_PRIVACY_NOTE");
    expect(formSource).toContain("CONTACT_PRIVACY_LINK_LABEL");
    expect(formSource).toContain("PRIVACY_PATH");
    expect(formSource).toContain("SUBMIT_IDLE_LABEL");
    expect(formSource).toContain("SUBMIT_PENDING_LABEL");
    expect(formSource).toContain("noValidate");
    expect(formSource).toContain("contact-honeypot");
    expect(formSource).toContain("companyWebsite");
    expect(formSource).toContain("tabIndex={-1}");
    expect(formSource).toContain('autoComplete="off"');
    expect(formSource).not.toContain("visually-hidden");
  });

  it("adds Contact after FAQ in the footer only", () => {
    expect(siteNav.map((item) => item.label)).not.toContain("Contact");
    expect(getFooterNavItems().map((item) => item.href)).toEqual([
      "/",
      "/#support",
      "/#how-it-works",
      "/helpers",
      "/early-access",
      "/faq",
      "/contact",
    ]);
    const designSystem = read("app/design-system/page.tsx");
    expect(designSystem).toContain("plus FAQ and Contact");
    expect(designSystem).not.toContain("No contact or legal pages are linked yet.");
    expect(read("components/site-footer.tsx")).toContain("getFooterNavItems");
  });

  it("denies anon and authenticated access in the contact migration", () => {
    expect(migrationSource).toContain("ENABLE ROW LEVEL SECURITY");
    expect(migrationSource).toContain(
      "REVOKE ALL ON TABLE public.contact_inquiries FROM anon",
    );
    expect(migrationSource).toContain(
      "REVOKE ALL ON TABLE public.contact_inquiries FROM authenticated",
    );
    expect(migrationSource).toContain(
      "GRANT ALL ON TABLE public.contact_inquiries TO service_role",
    );
    expect(migrationSource).not.toMatch(/CREATE POLICY/i);
    expect(migrationSource).not.toMatch(/user_agent|client_ip|privacy_policy/i);
    expect(migrationSource).toContain("contact_inquiries_created_at_idx");
    expect(migrationSource).not.toMatch(/UNIQUE/i);

    const envExample = read(".env.example");
    expect(envExample).toMatch(/^RESEND_API_KEY=\s*$/m);
    expect(envExample).toMatch(/^CONTACT_NOTIFICATION_FROM=\s*$/m);
    expect(envExample).toContain("CONTACT_NOTIFICATION_TO=admin@parentive.ca");
  });
});
