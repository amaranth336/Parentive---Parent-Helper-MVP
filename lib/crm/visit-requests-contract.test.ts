import { readFileSync } from "node:fs";
import { join } from "node:path";

const MIGRATION_PATH =
  "supabase/migrations/20261028120000_add_visit_requests_to_crm.sql";

const VISIT_STATUSES = [
  "new",
  "reviewing",
  "quoted",
  "awaiting_payment",
  "booked",
  "declined",
  "closed",
  "spam",
] as const;

function readMigration(): string {
  return readFileSync(join(process.cwd(), MIGRATION_PATH), "utf8");
}

function viewBody(sql: string, viewName: string): string {
  const start = `-- BEGIN VIEW ${viewName}`;
  const end = `-- END VIEW ${viewName}`;
  const startIndex = sql.indexOf(start);
  const endIndex = sql.indexOf(end);
  if (startIndex < 0 || endIndex < startIndex) {
    throw new Error(`view section missing for ${viewName}`);
  }

  return sql.slice(startIndex, endIndex);
}

function quotedValues(block: string): string[] {
  return [...block.matchAll(/'([^']+)'/g)].map((found) => found[1]);
}

describe("visit request crm migration contract", () => {
  const sql = readMigration();

  it("links one operations row to one visit request", () => {
    expect(sql).toContain(
      "ADD COLUMN pilot_visit_request_id uuid",
    );
    expect(sql).toContain("UNIQUE (pilot_visit_request_id)");
    expect(sql).toMatch(
      /FOREIGN KEY \(pilot_visit_request_id\)[\s\S]*?REFERENCES public\.pilot_visit_requests \(id\)[\s\S]*?ON DELETE CASCADE/,
    );
    expect(sql).toMatch(
      /num_nonnulls\(\s*early_access_registration_id,\s*helper_application_id,\s*contact_inquiry_id,\s*pilot_visit_request_id\s*\)\s*=\s*1/,
    );
  });

  it("limits visit-request follow-up to the agreed statuses", () => {
    const constraint = sql.slice(
      sql.indexOf("ADD CONSTRAINT crm_operations_status_for_source"),
    );
    const branchStart = constraint.indexOf("pilot_visit_request_id IS NOT NULL");
    const listStart = constraint.indexOf("status IN (", branchStart);
    const listEnd = constraint.indexOf(")", listStart);
    expect(quotedValues(constraint.slice(listStart, listEnd))).toEqual([
      ...VISIT_STATUSES,
    ]);
    expect(constraint).toContain("early_access_registration_id IS NOT NULL");
    expect(constraint).toContain("helper_application_id IS NOT NULL");
    expect(constraint).toContain("contact_inquiry_id IS NOT NULL");
  });

  it("seeds and backfills without changing visit requests", () => {
    expect(sql).toMatch(
      /CREATE TRIGGER crm_operations_seed_visit_request\s+AFTER INSERT ON public\.pilot_visit_requests/,
    );
    expect(sql).toMatch(/ON CONFLICT \(pilot_visit_request_id\) DO NOTHING/);
    expect(sql).toMatch(
      /INSERT INTO public\.crm_operations \(\s*pilot_visit_request_id,\s*status\s*\)\s*SELECT\s*id,\s*'new'\s*FROM public\.pilot_visit_requests/,
    );
    expect(sql).not.toMatch(/UPDATE\s+public\.pilot_visit_requests\b/i);
    expect(sql).not.toMatch(/DELETE\s+FROM\s+public\.pilot_visit_requests\b/i);
    expect(sql).not.toMatch(/ALTER TABLE\s+public\.pilot_visit_requests\b/i);

    const start = sql.indexOf("FUNCTION public.crm_operations_seed_visit_request()");
    const end = sql.indexOf(
      "COMMENT ON FUNCTION public.crm_operations_seed_visit_request()",
    );
    const body = sql.slice(start, end);
    expect(body).toContain("'new'");
    expect(body).not.toMatch(/\bUPDATE\b/i);
    expect(body).not.toMatch(/\bDELETE\b/i);
  });

  it("keeps the seed function off website roles", () => {
    const signature = "public.crm_operations_seed_visit_request()";
    expect(sql).toContain(`REVOKE ALL ON FUNCTION ${signature} FROM PUBLIC`);
    expect(sql).toContain(`REVOKE ALL ON FUNCTION ${signature} FROM anon`);
    expect(sql).toContain(
      `REVOKE ALL ON FUNCTION ${signature} FROM authenticated`,
    );
    expect(sql).toContain(
      `GRANT EXECUTE ON FUNCTION ${signature} TO service_role`,
    );
    expect(sql).not.toMatch(/\bTO anon\b/i);
    expect(sql).not.toMatch(/\bTO authenticated\b/i);
  });

  it("publishes a service-role visit view and feed line", () => {
    const view = viewBody(sql, "crm_visit_requests");
    expect(view).toContain("security_barrier = true");
    expect(view).toContain("security_invoker = true");
    expect(view).toContain("v.service_lines");
    expect(view).toContain("AS services_summary");
    expect(view).toContain("v.helper_notes");
    expect(view).toContain("COALESCE(o.status, 'new') AS review_status");
    expect(view).toContain("o.notes AS internal_notes");
    expect(sql).toContain(
      "REVOKE ALL ON TABLE public.crm_visit_requests FROM anon",
    );
    expect(sql).toContain(
      "REVOKE ALL ON TABLE public.crm_visit_requests FROM authenticated",
    );
    expect(sql).toContain(
      "GRANT SELECT ON TABLE public.crm_visit_requests TO service_role",
    );

    const feedStart = sql.indexOf("CREATE OR REPLACE VIEW public.crm_activity_feed");
    const feed = sql.slice(feedStart);
    expect(feed).toContain("'visit_request'::text AS record_type");
    expect(feed).toContain("'prospective_client'::text AS record_type");
    expect(feed).toContain("'helper_applicant'::text AS record_type");
    expect(feed).toContain("'contact_inquiry'::text AS record_type");
    expect(feed).not.toMatch(
      /helper_notes|flexible_description|request_contact_purpose|experience_text|motivation_text|document_storage_path/,
    );
    expect(sql).toContain(
      "GRANT SELECT ON TABLE public.crm_activity_feed TO service_role",
    );
  });
});
