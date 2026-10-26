import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_LINK_LABEL,
  INSTAGRAM_URL,
  SOCIALS_TITLE,
} from "./links";

function read(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("social links", () => {
  it("points at the public Parentive Instagram", () => {
    expect(SOCIALS_TITLE).toBe("our Socials");
    expect(INSTAGRAM_HANDLE).toBe("parentive.hq");
    expect(INSTAGRAM_URL).toBe("https://www.instagram.com/parentive.hq/");
    expect(INSTAGRAM_LINK_LABEL).toContain("Instagram");
  });

  it("places the same section above the contact hero and under the footer communities copy", () => {
    const contact = read("app/contact/page.tsx");
    const footer = read("components/site-footer.tsx");
    const component = read("components/social-links.tsx");
    const css = read("app/globals.css");

    expect(contact.indexOf("<SocialLinks")).toBeGreaterThan(-1);
    expect(contact.indexOf("<SocialLinks")).toBeLessThan(
      contact.indexOf('className="contact-hero"'),
    );
    expect(footer.indexOf("site-footer-area-heading")).toBeLessThan(
      footer.indexOf("<SocialLinks"),
    );
    expect(footer.indexOf("<SocialLinks")).toBeLessThan(
      footer.indexOf("site-footer-copy"),
    );
    expect(component).toContain("SOCIALS_TITLE");
    expect(component).toContain("INSTAGRAM_URL");
    expect(component).toContain('target="_blank"');
    expect(component).toContain('rel="noopener noreferrer"');
    expect(css).toContain(".socials-title");
    expect(css).toMatch(/\.socials-title\s*\{[^}]*color:\s*var\(--brand\)/);
    expect(css).toMatch(
      /@media \(min-width:\s*800px\)\s*\{[\s\S]*\.site-footer-socials\s*\{[^}]*margin-top:\s*auto/,
    );
    expect(css).toMatch(
      /\.site-footer-socials\s*\{[^}]*justify-content:\s*flex-end/,
    );
  });
});
