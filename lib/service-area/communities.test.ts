import { readFileSync } from "node:fs";
import { join } from "node:path";
import { formatPilotCommunityList, PILOT_COMMUNITIES } from "./communities";

describe("pilot communities", () => {
  it("includes the current names including Oak Ridges and King Township", () => {
    expect(PILOT_COMMUNITIES).toEqual([
      "East Gwillimbury",
      "Newmarket",
      "Aurora",
      "Georgina",
      "Whitchurch-Stouffville",
      "Uxbridge",
      "Bradford",
      "Oak Ridges",
      "King Township",
    ]);
    expect(PILOT_COMMUNITIES).toHaveLength(9);
    expect(PILOT_COMMUNITIES).toContain("Oak Ridges");
    expect(PILOT_COMMUNITIES).toContain("King Township");
  });

  it("formats the list for customer-facing copy", () => {
    expect(formatPilotCommunityList(PILOT_COMMUNITIES)).toBe(
      "East Gwillimbury, Newmarket, Aurora, Georgina, Whitchurch-Stouffville, Uxbridge, Bradford, Oak Ridges, and King Township",
    );
  });

  it("allows every listed community on early-access rows", () => {
    const migration = readFileSync(
      join(
        process.cwd(),
        "supabase/migrations/20261125120000_allow_oak_ridges_and_king_township_early_access_community.sql",
      ),
      "utf8",
    );

    for (const community of PILOT_COMMUNITIES) {
      expect(migration).toContain(`'${community}'`);
    }
  });
});
