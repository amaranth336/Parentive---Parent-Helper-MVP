import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SERVICE_INTEREST_KEYS } from "./copy";

const MIGRATION_PATH =
  "supabase/migrations/20261009120000_expand_early_access_service_interests.sql";

const LEGACY_INTEREST_KEYS = [
  "home_laundry",
  "kitchen_meal",
  "family",
  "flexible",
  "other_support",
] as const;

const CURRENT_INTEREST_KEYS = [
  "home_tidying",
  "laundry",
  "meal_prep",
  "light_organization",
  "light_cleaning",
  "occasional_child_engagement",
  "other",
] as const;

function readMigration(): string {
  return readFileSync(join(process.cwd(), MIGRATION_PATH), "utf8");
}

function allowedInterestKeys(sql: string): string[] {
  const match = sql.match(
    /service_interests <@ ARRAY\[([\s\S]*?)\]::text\[\]/,
  );
  if (!match?.[1]) {
    throw new Error("early_access_registrations_interests_check array not found");
  }

  return [...match[1].matchAll(/'([^']+)'/g)].map((found) => found[1]);
}

describe("early-access service interest contract", () => {
  const sql = readMigration();
  const allowed = allowedInterestKeys(sql);

  it("allows every current form key and keeps the five legacy keys", () => {
    expect([...SERVICE_INTEREST_KEYS]).toEqual([...CURRENT_INTEREST_KEYS]);
    expect(allowed).toEqual([
      ...LEGACY_INTEREST_KEYS,
      ...CURRENT_INTEREST_KEYS,
    ]);
  });

  it("allows free text when other_support or other is selected", () => {
    expect(sql).toContain(
      "CONSTRAINT early_access_registrations_other_only_when_selected",
    );
    expect(sql).toMatch(
      /service_interest_other IS NULL\s+OR 'other_support' = ANY \(service_interests\)\s+OR 'other' = ANY \(service_interests\)/,
    );
  });

  it("only replaces the two interest checks", () => {
    expect(sql).not.toMatch(
      /\b(GRANT|REVOKE|CREATE INDEX|ADD COLUMN|ROW LEVEL SECURITY|INSERT|UPDATE|DELETE|DEFAULT)\b/i,
    );
    expect(sql.match(/DROP CONSTRAINT/g)).toHaveLength(2);
    expect(sql.match(/ADD CONSTRAINT/g)).toHaveLength(2);
  });
});
