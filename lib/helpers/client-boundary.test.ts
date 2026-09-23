import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("helpers client boundary", () => {
  it("keeps the service-role client off the helpers form and page", () => {
    const formSource = readFileSync(
      join(process.cwd(), "components", "helpers-application-form.tsx"),
      "utf8",
    );
    const pageSource = readFileSync(
      join(process.cwd(), "app", "helpers", "page.tsx"),
      "utf8",
    );

    for (const source of [formSource, pageSource]) {
      expect(source).not.toMatch(/lib\/supabase\/admin/);
      expect(source).not.toMatch(/createServiceRoleClient/);
      expect(source).not.toMatch(/SUPABASE_SERVICE_ROLE_KEY/);
      expect(source).not.toMatch(/lib\/helpers\/handler/);
      expect(source).not.toMatch(/lib\/helpers\/submit/);
    }
  });
});
