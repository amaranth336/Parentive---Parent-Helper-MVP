import { readFileSync } from "node:fs";
import { join } from "node:path";

const MIGRATION_PATH =
  "supabase/migrations/20261016140000_create_crm_lite_operations.sql";

const SOURCE_TABLES = [
  "early_access_registrations",
  "helper_applications",
  "contact_inquiries",
] as const;

const CRM_VIEWS = [
  "crm_prospective_clients",
  "crm_helper_applicants",
  "crm_contact_inquiries",
  "crm_activity_feed",
] as const;

const PROSPECTIVE_STATUSES = [
  "new",
  "reviewed",
  "contacted",
  "interested",
  "waitlisted",
  "outside_area",
  "closed",
] as const;

const HELPER_STATUSES = [
  "new",
  "reviewing",
  "intro_conversation",
  "screening",
  "offer",
  "hired",
  "declined",
  "waitlisted",
  "withdrawn",
] as const;

const CONTACT_STATUSES = ["new", "replied", "waiting", "closed", "spam"] as const;

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

function statusBranch(sql: string, sourceColumn: string): string {
  const constraint = sql.slice(sql.indexOf("CONSTRAINT crm_operations_status_for_source"));
  const branchStart = constraint.indexOf(`${sourceColumn} IS NOT NULL`);
  if (branchStart < 0) {
    throw new Error(`status branch missing for ${sourceColumn}`);
  }

  const listStart = constraint.indexOf("status IN (", branchStart);
  const listEnd = constraint.indexOf(")", listStart);
  return constraint.slice(listStart, listEnd);
}

function quotedValues(block: string): string[] {
  return [...block.matchAll(/'([^']+)'/g)].map((found) => found[1]);
}

describe("crm-lite operations migration contract", () => {
  const sql = readMigration();

  it("requires exactly one source foreign key", () => {
    expect(sql).toContain("CONSTRAINT crm_operations_exactly_one_source");
    expect(sql).toMatch(
      /num_nonnulls\(\s*early_access_registration_id,\s*helper_application_id,\s*contact_inquiry_id\s*\)\s*=\s*1/,
    );

    for (const column of [
      "early_access_registration_id",
      "helper_application_id",
      "contact_inquiry_id",
    ]) {
      expect(sql).toContain(`UNIQUE (${column})`);
      expect(sql).toContain(`FOREIGN KEY (${column})`);
      expect(sql).toMatch(
        new RegExp(
          `FOREIGN KEY \\(${column}\\)[\\s\\S]*?ON DELETE CASCADE`,
        ),
      );
    }
  });

  it("limits status values to the matching source type", () => {
    expect(quotedValues(statusBranch(sql, "early_access_registration_id"))).toEqual(
      [...PROSPECTIVE_STATUSES],
    );
    expect(quotedValues(statusBranch(sql, "helper_application_id"))).toEqual([
      ...HELPER_STATUSES,
    ]);
    expect(quotedValues(statusBranch(sql, "contact_inquiry_id"))).toEqual([
      ...CONTACT_STATUSES,
    ]);
    expect(sql).toContain("char_length(notes) <= 5000");
    expect(sql).toContain("char_length(assigned_to) <= 80");
    expect(sql).toContain("CREATE INDEX crm_operations_status_idx");
    expect(sql).toContain("CREATE INDEX crm_operations_follow_up_on_idx");
    expect(sql).toContain("CREATE INDEX crm_operations_assigned_to_idx");
  });

  it("locks crm_operations to service_role without public policies", () => {
    expect(sql).toContain(
      "ALTER TABLE public.crm_operations ENABLE ROW LEVEL SECURITY",
    );
    expect(sql).toContain("REVOKE ALL ON TABLE public.crm_operations FROM PUBLIC");
    expect(sql).toContain("REVOKE ALL ON TABLE public.crm_operations FROM anon");
    expect(sql).toContain(
      "REVOKE ALL ON TABLE public.crm_operations FROM authenticated",
    );
    expect(sql).toContain("GRANT ALL ON TABLE public.crm_operations TO service_role");
    expect(sql).not.toMatch(/CREATE POLICY/i);

    const grantLines = sql
      .split("\n")
      .filter((line) => /^\s*GRANT\b/i.test(line));
    expect(grantLines.length).toBeGreaterThan(0);
    for (const line of grantLines) {
      expect(line).not.toMatch(/\bTO anon\b/i);
      expect(line).not.toMatch(/\bTO authenticated\b/i);
      expect(line).toMatch(/\bTO service_role\b/);
    }
  });

  it("refreshes updated_at only on crm_operations", () => {
    expect(sql).toContain("NEW.updated_at = clock_timestamp()");
    expect(sql).toMatch(
      /CREATE TRIGGER crm_operations_set_updated_at\s+BEFORE UPDATE ON public\.crm_operations/,
    );
    expect(sql).not.toMatch(
      /(?:BEFORE|AFTER)\s+UPDATE\s+ON\s+public\.(early_access_registrations|helper_applications|contact_inquiries)/i,
    );
  });

  it("seeds and backfills operations rows without changing submissions", () => {
    expect(sql).toMatch(
      /CREATE TRIGGER crm_operations_seed_early_access\s+AFTER INSERT ON public\.early_access_registrations/,
    );
    expect(sql).toMatch(
      /CREATE TRIGGER crm_operations_seed_helper_application\s+AFTER INSERT ON public\.helper_applications/,
    );
    expect(sql).toMatch(
      /CREATE TRIGGER crm_operations_seed_contact_inquiry\s+AFTER INSERT ON public\.contact_inquiries/,
    );

    expect(sql).toMatch(
      /ON CONFLICT \(early_access_registration_id\) DO NOTHING/,
    );
    expect(sql).toMatch(/ON CONFLICT \(helper_application_id\) DO NOTHING/);
    expect(sql).toMatch(/ON CONFLICT \(contact_inquiry_id\) DO NOTHING/);

    expect(sql).toMatch(
      /INSERT INTO public\.crm_operations \(\s*early_access_registration_id,\s*status\s*\)\s*SELECT\s*id,\s*'new'\s*FROM public\.early_access_registrations/,
    );
    expect(sql).toMatch(
      /INSERT INTO public\.crm_operations \(\s*helper_application_id,\s*status\s*\)\s*SELECT\s*id,\s*'new'\s*FROM public\.helper_applications/,
    );
    expect(sql).toMatch(
      /INSERT INTO public\.crm_operations \(\s*contact_inquiry_id,\s*status\s*\)\s*SELECT\s*id,\s*'new'\s*FROM public\.contact_inquiries/,
    );

    for (const table of SOURCE_TABLES) {
      expect(sql).not.toMatch(
        new RegExp(`ALTER TABLE\\s+public\\.${table}\\b`, "i"),
      );
      expect(sql).not.toMatch(new RegExp(`UPDATE\\s+public\\.${table}\\b`, "i"));
      expect(sql).not.toMatch(
        new RegExp(`DELETE\\s+FROM\\s+public\\.${table}\\b`, "i"),
      );
      expect(sql).not.toMatch(
        new RegExp(`CREATE TABLE\\s+public\\.${table}\\b`, "i"),
      );
    }

    const seedFns = [
      "crm_operations_seed_early_access",
      "crm_operations_seed_helper_application",
      "crm_operations_seed_contact_inquiry",
    ];
    for (const name of seedFns) {
      const start = sql.indexOf(`FUNCTION public.${name}()`);
      const end = sql.indexOf(`COMMENT ON FUNCTION public.${name}()`);
      const body = sql.slice(start, end);
      expect(body).toContain("'new'");
      expect(body).not.toMatch(/\bUPDATE\b/i);
      expect(body).not.toMatch(/\bDELETE\b/i);
    }
  });

  it("creates the four views and revokes them from public roles", () => {
    for (const view of CRM_VIEWS) {
      expect(sql).toContain(`CREATE VIEW public.${view}`);
      expect(sql).toContain(
        `REVOKE ALL ON TABLE public.${view} FROM PUBLIC`,
      );
      expect(sql).toContain(`REVOKE ALL ON TABLE public.${view} FROM anon`);
      expect(sql).toContain(
        `REVOKE ALL ON TABLE public.${view} FROM authenticated`,
      );
      expect(sql).toContain(
        `GRANT SELECT ON TABLE public.${view} TO service_role`,
      );
      expect(viewBody(sql, view)).toContain("security_barrier = true");
      expect(viewBody(sql, view)).toContain("security_invoker = true");
    }

    const viewGrantLines = sql
      .split("\n")
      .filter(
        (line) =>
          /GRANT/i.test(line) &&
          CRM_VIEWS.some((view) => line.includes(view)),
      );
    expect(viewGrantLines).toHaveLength(CRM_VIEWS.length);
    for (const line of viewGrantLines) {
      expect(line).toMatch(/GRANT SELECT/i);
      expect(line).toMatch(/TO service_role/);
      expect(line).not.toMatch(/INSERT|UPDATE|DELETE|ALL/i);
    }
  });

  it("keeps helper document access to a private path", () => {
    const helper = viewBody(sql, "crm_helper_applicants");
    expect(helper).toContain(
      "h.document_storage_path AS document_locator",
    );
    expect(helper).toContain("h.document_byte_size AS document_bytes");
    expect(helper).not.toMatch(
      /https?:\/\/|getPublicUrl|createSignedUrl|\/object\/public\/|createSignedUrl|sign\(/i,
    );
    expect(sql).not.toMatch(
      /helper_application_rate_limits|helper_application_storage_orphan_events/,
    );
    expect(sql).toMatch(
      /COMMENT ON COLUMN public\.crm_helper_applicants\.document_locator IS[\s\S]*not a public URL[\s\S]*not a signed URL/,
    );
    expect(sql).not.toMatch(/https?:\/\//i);
  });

  it("shapes each view from the current source contract", () => {
    const prospective = viewBody(sql, "crm_prospective_clients");
    expect(prospective).toContain("r.service_interests");
    expect(prospective).toContain("AS interests_summary");
    expect(prospective).not.toMatch(/\br\.updated_at\b/);
    expect(sql).toContain("'Home laundry (legacy)'");
    expect(sql).toContain("'Kitchen and meals (legacy)'");
    expect(sql).toContain("'Family (legacy)'");
    expect(sql).toContain("'Flexible (legacy)'");
    expect(sql).toContain("'Other support (legacy)'");
    expect(sql).toContain("ELSE p_key");

    const contact = viewBody(sql, "crm_contact_inquiries");
    expect(contact).not.toMatch(/consent|privacy_policy|privacy_notice/i);

    const feed = viewBody(sql, "crm_activity_feed");
    expect(feed).toContain("'prospective_client'::text AS record_type");
    expect(feed).toContain("'helper_applicant'::text AS record_type");
    expect(feed).toContain("'contact_inquiry'::text AS record_type");
    expect(feed).toContain("left(c.message, 140) AS summary");
    expect(feed).not.toMatch(
      /experience_text|motivation_text|document_storage_path|document_locator|consent_purpose|pilot_contact_purpose|marketing_consent_purpose/,
    );
    expect(feed).not.toMatch(/\bAS message\b/i);
  });

  it("does not grant display or trigger functions to website roles", () => {
    const functions = [
      "public.crm_display_label(text, text)",
      "public.crm_display_list(text, text[])",
      "public.crm_operations_set_updated_at()",
      "public.crm_operations_seed_early_access()",
      "public.crm_operations_seed_helper_application()",
      "public.crm_operations_seed_contact_inquiry()",
    ];

    for (const signature of functions) {
      expect(sql).toContain(`REVOKE ALL ON FUNCTION ${signature} FROM PUBLIC`);
      expect(sql).toContain(`REVOKE ALL ON FUNCTION ${signature} FROM anon`);
      expect(sql).toContain(
        `REVOKE ALL ON FUNCTION ${signature} FROM authenticated`,
      );
      expect(sql).toContain(
        `GRANT EXECUTE ON FUNCTION ${signature} TO service_role`,
      );
    }
  });
});
