import { readFileSync } from "node:fs";
import { join } from "node:path";

function read(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("contact client boundary", () => {
  const formSource = read("components/contact-form.tsx");
  const pageSource = read("app/contact/page.tsx");

  it("keeps server secrets and privileged modules off the contact page and form", () => {
    for (const source of [formSource, pageSource]) {
      expect(source).not.toMatch(/lib\/supabase\/admin/);
      expect(source).not.toMatch(/createServiceRoleClient/);
      expect(source).not.toMatch(/SUPABASE_SERVICE_ROLE_KEY/);
      expect(source).not.toMatch(/lib\/contact\/handler/);
      expect(source).not.toMatch(/lib\/contact\/submit/);
      expect(source).not.toMatch(/lib\/contact\/notify/);
      expect(source).not.toMatch(/RESEND_API_KEY/);
      expect(source).not.toMatch(/CONTACT_NOTIFICATION_FROM/);
      expect(source).not.toMatch(/CONTACT_NOTIFICATION_TO/);
      expect(source).not.toMatch(/api\.resend\.com/);
      expect(source).not.toMatch(/service_role/);
    }
  });
});
