import { readFileSync } from "node:fs";
import { join } from "node:path";
import { formatPilotCommunityList, PILOT_COMMUNITIES } from "./communities";

describe("pilot communities", () => {
  it("includes the current names including Bradford", () => {
    expect(PILOT_COMMUNITIES).toEqual([
      "East Gwillimbury",
      "Newmarket",
      "Aurora",
      "Georgina",
      "Whitchurch-Stouffville",
      "Uxbridge",
      "Bradford",
    ]);
    expect(PILOT_COMMUNITIES).toHaveLength(7);
    expect(PILOT_COMMUNITIES).toContain("Bradford");
  });

  it("formats the list for customer-facing copy", () => {
    expect(formatPilotCommunityList(PILOT_COMMUNITIES)).toBe(
      "East Gwillimbury, Newmarket, Aurora, Georgina, Whitchurch-Stouffville, Uxbridge, and Bradford",
    );
  });

  it("allows every listed community on early-access rows", () => {
    const migration = readFileSync(
      join(
        process.cwd(),
        "supabase/migrations/20261124120000_allow_bradford_early_access_community.sql",
      ),
      "utf8",
    );

    for (const community of PILOT_COMMUNITIES) {
      expect(migration).toContain(`'${community}'`);
    }
  });
});
