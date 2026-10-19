-- Founder-only CRM-lite operations layer.
--
-- Adds public.crm_operations, seed/update triggers, a backfill, and four
-- read-only views. Does not add columns, constraints, or policies to
-- early_access_registrations, helper_applications, or contact_inquiries,
-- and does not update or delete their existing rows.
--
-- Requires those three tables to already exist.
-- Requires PostgreSQL 15+ for security_invoker views.
--
-- crm_operations and the views are internal. No anon or authenticated
-- policies are created. Helper document views expose only the existing
-- private storage path, never a public or signed URL.

-- ---------------------------------------------------------------------------
-- Display labels. No table access. Unknown keys are returned unchanged.
-- Legacy early-access interest keys stay visible and are marked legacy.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.crm_display_label(
  p_vocabulary text,
  p_key text
)
RETURNS text
LANGUAGE sql
STABLE
SET search_path = pg_catalog
AS $$
  SELECT CASE
    WHEN p_key IS NULL THEN NULL
    WHEN p_vocabulary = 'early_access_interest' THEN CASE p_key
      WHEN 'home_tidying' THEN 'Home tidying'
      WHEN 'laundry' THEN 'Laundry'
      WHEN 'meal_prep' THEN 'Meal prep'
      WHEN 'light_organization' THEN 'Light organization'
      WHEN 'light_cleaning' THEN 'Light cleaning'
      WHEN 'occasional_child_engagement' THEN 'Occasional child engagement'
      WHEN 'other' THEN 'Other'
      WHEN 'home_laundry' THEN 'Home laundry (legacy)'
      WHEN 'kitchen_meal' THEN 'Kitchen and meals (legacy)'
      WHEN 'family' THEN 'Family (legacy)'
      WHEN 'flexible' THEN 'Flexible (legacy)'
      WHEN 'other_support' THEN 'Other support (legacy)'
      ELSE p_key
    END
    WHEN p_vocabulary = 'helper_interest' THEN CASE p_key
      WHEN 'laundry_household_resets' THEN 'Laundry, including putting items away'
      WHEN 'tidying_organizing' THEN 'Tidying, light cleaning and organizing family spaces'
      WHEN 'food_kitchen' THEN 'Food preparation and kitchen support'
      WHEN 'parent_present_childcare' THEN 'Parent-present childcare and child engagement'
      WHEN 'flexible_household' THEN 'Additional household support as Parentive services evolve'
      WHEN 'garden_outdoor' THEN 'Garden and light outdoor/landscape duties'
      ELSE p_key
    END
    WHEN p_vocabulary = 'weekday' THEN CASE p_key
      WHEN 'monday' THEN 'Monday'
      WHEN 'tuesday' THEN 'Tuesday'
      WHEN 'wednesday' THEN 'Wednesday'
      WHEN 'thursday' THEN 'Thursday'
      WHEN 'friday' THEN 'Friday'
      WHEN 'saturday' THEN 'Saturday'
      WHEN 'sunday' THEN 'Sunday'
      ELSE p_key
    END
    WHEN p_vocabulary = 'time_block' THEN CASE p_key
      WHEN 'mornings' THEN 'Mornings'
      WHEN 'afternoons' THEN 'Afternoons'
      WHEN 'evenings' THEN 'Evenings'
      WHEN 'flexible' THEN 'Flexible / varies'
      ELSE p_key
    END
    WHEN p_vocabulary = 'weekly_hours' THEN CASE p_key
      WHEN 'under_6' THEN 'Under 6 hours'
      WHEN '6_to_10' THEN '6–10 hours'
      WHEN '11_to_20' THEN '11–20 hours'
      WHEN '21_plus' THEN '21+ hours'
      ELSE p_key
    END
    WHEN p_vocabulary = 'frequency' THEN CASE p_key
      WHEN 'one_time' THEN 'One time'
      WHEN 'weekly' THEN 'Recurring weekly'
      WHEN 'biweekly' THEN 'Recurring biweekly'
      WHEN 'monthly' THEN 'Recurring monthly'
      WHEN 'other' THEN 'Other'
      ELSE p_key
    END
    WHEN p_vocabulary = 'area_status' THEN CASE p_key
      WHEN 'in_pilot' THEN 'In pilot'
      WHEN 'outside_pilot' THEN 'Outside pilot'
      WHEN 'unknown' THEN 'Unknown'
      ELSE p_key
    END
    ELSE p_key
  END;
$$;

CREATE OR REPLACE FUNCTION public.crm_display_list(
  p_vocabulary text,
  p_keys text[]
)
RETURNS text
LANGUAGE sql
STABLE
SET search_path = pg_catalog
AS $$
  SELECT string_agg(
    public.crm_display_label(p_vocabulary, item.key),
    ', ' ORDER BY item.ordinality
  )
  FROM unnest(p_keys) WITH ORDINALITY AS item(key, ordinality);
$$;

REVOKE ALL ON FUNCTION public.crm_display_label(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.crm_display_label(text, text) FROM anon;
REVOKE ALL ON FUNCTION public.crm_display_label(text, text) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.crm_display_label(text, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.crm_display_label(text, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.crm_display_label(text, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.crm_display_label(text, text) TO service_role;

REVOKE ALL ON FUNCTION public.crm_display_list(text, text[]) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.crm_display_list(text, text[]) FROM anon;
REVOKE ALL ON FUNCTION public.crm_display_list(text, text[]) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.crm_display_list(text, text[]) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.crm_display_list(text, text[]) FROM anon;
REVOKE EXECUTE ON FUNCTION public.crm_display_list(text, text[]) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.crm_display_list(text, text[]) TO service_role;

COMMENT ON FUNCTION public.crm_display_label(text, text) IS
  'Internal display labels for CRM views. Does not read tables. Do not grant to anon or authenticated.';

COMMENT ON FUNCTION public.crm_display_list(text, text[]) IS
  'Joins crm_display_label values in array order. Does not read tables. Do not grant to anon or authenticated.';

-- ---------------------------------------------------------------------------
-- 1) crm_operations
-- ---------------------------------------------------------------------------

CREATE TABLE public.crm_operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  early_access_registration_id uuid,
  helper_application_id uuid,
  contact_inquiry_id uuid,
  status text NOT NULL,
  notes text,
  follow_up_on date,
  last_contacted_on date,
  assigned_to text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT crm_operations_early_access_registration_id_key
    UNIQUE (early_access_registration_id),
  CONSTRAINT crm_operations_helper_application_id_key
    UNIQUE (helper_application_id),
  CONSTRAINT crm_operations_contact_inquiry_id_key
    UNIQUE (contact_inquiry_id),
  CONSTRAINT crm_operations_early_access_registration_id_fkey
    FOREIGN KEY (early_access_registration_id)
    REFERENCES public.early_access_registrations (id)
    ON DELETE CASCADE,
  CONSTRAINT crm_operations_helper_application_id_fkey
    FOREIGN KEY (helper_application_id)
    REFERENCES public.helper_applications (id)
    ON DELETE CASCADE,
  CONSTRAINT crm_operations_contact_inquiry_id_fkey
    FOREIGN KEY (contact_inquiry_id)
    REFERENCES public.contact_inquiries (id)
    ON DELETE CASCADE,
  CONSTRAINT crm_operations_exactly_one_source
    CHECK (
      num_nonnulls(
        early_access_registration_id,
        helper_application_id,
        contact_inquiry_id
      ) = 1
    ),
  CONSTRAINT crm_operations_notes_len
    CHECK (notes IS NULL OR char_length(notes) <= 5000),
  CONSTRAINT crm_operations_assigned_to_len
    CHECK (assigned_to IS NULL OR char_length(assigned_to) <= 80),
  CONSTRAINT crm_operations_status_for_source
    CHECK (
      (
        early_access_registration_id IS NOT NULL
        AND status IN (
          'new',
          'reviewed',
          'contacted',
          'interested',
          'waitlisted',
          'outside_area',
          'closed'
        )
      )
      OR (
        helper_application_id IS NOT NULL
        AND status IN (
          'new',
          'reviewing',
          'intro_conversation',
          'screening',
          'offer',
          'hired',
          'declined',
          'waitlisted',
          'withdrawn'
        )
      )
      OR (
        contact_inquiry_id IS NOT NULL
        AND status IN (
          'new',
          'replied',
          'waiting',
          'closed',
          'spam'
        )
      )
    )
);

CREATE INDEX crm_operations_status_idx
  ON public.crm_operations (status);

CREATE INDEX crm_operations_follow_up_on_idx
  ON public.crm_operations (follow_up_on);

CREATE INDEX crm_operations_assigned_to_idx
  ON public.crm_operations (assigned_to);

COMMENT ON TABLE public.crm_operations IS
  'Founder-only follow-up for one early-access registration, helper application, or contact inquiry. Submission rows are not stored here and are not modified by this table.';

-- ---------------------------------------------------------------------------
-- 2) Security. No anon or authenticated policies.
-- ---------------------------------------------------------------------------

ALTER TABLE public.crm_operations ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.crm_operations FROM PUBLIC;
REVOKE ALL ON TABLE public.crm_operations FROM anon;
REVOKE ALL ON TABLE public.crm_operations FROM authenticated;
GRANT ALL ON TABLE public.crm_operations TO service_role;

-- ---------------------------------------------------------------------------
-- 3) updated_at. This trigger is only on crm_operations.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.crm_operations_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
  NEW.updated_at = clock_timestamp();
  RETURN NEW;
END;
$$;

CREATE TRIGGER crm_operations_set_updated_at
  BEFORE UPDATE ON public.crm_operations
  FOR EACH ROW
  EXECUTE FUNCTION public.crm_operations_set_updated_at();

REVOKE ALL ON FUNCTION public.crm_operations_set_updated_at() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.crm_operations_set_updated_at() FROM anon;
REVOKE ALL ON FUNCTION public.crm_operations_set_updated_at() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.crm_operations_set_updated_at() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.crm_operations_set_updated_at() FROM anon;
REVOKE EXECUTE ON FUNCTION public.crm_operations_set_updated_at() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.crm_operations_set_updated_at() TO service_role;

-- ---------------------------------------------------------------------------
-- 4) Seed one operations row when a submission is inserted.
--    ON CONFLICT keeps a second fire from creating a duplicate.
--    The functions do not assign NEW fields on the source row.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.crm_operations_seed_early_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  INSERT INTO public.crm_operations (
    early_access_registration_id,
    status
  ) VALUES (
    NEW.id,
    'new'
  )
  ON CONFLICT (early_access_registration_id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER crm_operations_seed_early_access
  AFTER INSERT ON public.early_access_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.crm_operations_seed_early_access();

CREATE OR REPLACE FUNCTION public.crm_operations_seed_helper_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  INSERT INTO public.crm_operations (
    helper_application_id,
    status
  ) VALUES (
    NEW.id,
    'new'
  )
  ON CONFLICT (helper_application_id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER crm_operations_seed_helper_application
  AFTER INSERT ON public.helper_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.crm_operations_seed_helper_application();

CREATE OR REPLACE FUNCTION public.crm_operations_seed_contact_inquiry()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  INSERT INTO public.crm_operations (
    contact_inquiry_id,
    status
  ) VALUES (
    NEW.id,
    'new'
  )
  ON CONFLICT (contact_inquiry_id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER crm_operations_seed_contact_inquiry
  AFTER INSERT ON public.contact_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.crm_operations_seed_contact_inquiry();

REVOKE ALL ON FUNCTION public.crm_operations_seed_early_access() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.crm_operations_seed_early_access() FROM anon;
REVOKE ALL ON FUNCTION public.crm_operations_seed_early_access() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.crm_operations_seed_early_access() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.crm_operations_seed_early_access() FROM anon;
REVOKE EXECUTE ON FUNCTION public.crm_operations_seed_early_access() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.crm_operations_seed_early_access() TO service_role;

REVOKE ALL ON FUNCTION public.crm_operations_seed_helper_application() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.crm_operations_seed_helper_application() FROM anon;
REVOKE ALL ON FUNCTION public.crm_operations_seed_helper_application() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.crm_operations_seed_helper_application() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.crm_operations_seed_helper_application() FROM anon;
REVOKE EXECUTE ON FUNCTION public.crm_operations_seed_helper_application() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.crm_operations_seed_helper_application() TO service_role;

REVOKE ALL ON FUNCTION public.crm_operations_seed_contact_inquiry() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.crm_operations_seed_contact_inquiry() FROM anon;
REVOKE ALL ON FUNCTION public.crm_operations_seed_contact_inquiry() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.crm_operations_seed_contact_inquiry() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.crm_operations_seed_contact_inquiry() FROM anon;
REVOKE EXECUTE ON FUNCTION public.crm_operations_seed_contact_inquiry() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.crm_operations_seed_contact_inquiry() TO service_role;

COMMENT ON FUNCTION public.crm_operations_seed_early_access() IS
  'Inserts a new crm_operations row for an early-access registration. Does not modify the registration.';

COMMENT ON FUNCTION public.crm_operations_seed_helper_application() IS
  'Inserts a new crm_operations row for a helper application. Does not modify the application.';

COMMENT ON FUNCTION public.crm_operations_seed_contact_inquiry() IS
  'Inserts a new crm_operations row for a contact inquiry. Does not modify the inquiry.';

-- ---------------------------------------------------------------------------
-- 5) Backfill. Idempotent. Does not update source rows.
-- ---------------------------------------------------------------------------

INSERT INTO public.crm_operations (
  early_access_registration_id,
  status
)
SELECT
  id,
  'new'
FROM public.early_access_registrations
ON CONFLICT (early_access_registration_id) DO NOTHING;

INSERT INTO public.crm_operations (
  helper_application_id,
  status
)
SELECT
  id,
  'new'
FROM public.helper_applications
ON CONFLICT (helper_application_id) DO NOTHING;

INSERT INTO public.crm_operations (
  contact_inquiry_id,
  status
)
SELECT
  id,
  'new'
FROM public.contact_inquiries
ON CONFLICT (contact_inquiry_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 6) Read-only founder views.
--    security_invoker keeps base-table RLS in force for the querying role.
--    The operations join also prevents Postgres from auto-updating the view.
-- ---------------------------------------------------------------------------

-- BEGIN VIEW crm_prospective_clients
CREATE VIEW public.crm_prospective_clients
WITH (security_barrier = true, security_invoker = true)
AS
SELECT
  r.created_at AS submitted_at,
  r.id AS registration_id,
  r.first_name,
  r.email,
  r.postal_code,
  r.postal_fsa,
  r.service_area_status AS area_status,
  r.service_area_community AS community,
  r.service_interests,
  public.crm_display_list(
    'early_access_interest',
    r.service_interests
  ) AS interests_summary,
  r.service_interest_other AS other_interest,
  r.frequency,
  r.frequency_other AS frequency_detail,
  r.pilot_contact_consent,
  r.pilot_contact_consented_at,
  r.pilot_contact_purpose,
  r.marketing_consent,
  r.marketing_consented_at,
  r.marketing_consent_purpose,
  r.privacy_policy_version AS privacy_notice_version,
  r.source_path,
  COALESCE(o.status, 'new') AS review_status,
  o.follow_up_on,
  o.last_contacted_on,
  o.assigned_to,
  o.notes AS internal_notes,
  o.id AS ops_id
FROM public.early_access_registrations AS r
LEFT JOIN public.crm_operations AS o
  ON o.early_access_registration_id = r.id
ORDER BY r.created_at DESC;
-- END VIEW crm_prospective_clients

-- BEGIN VIEW crm_helper_applicants
CREATE VIEW public.crm_helper_applicants
WITH (security_barrier = true, security_invoker = true)
AS
SELECT
  h.created_at AS submitted_at,
  h.id AS application_id,
  h.first_name,
  h.last_name,
  h.email,
  h.telephone,
  h.postal_code,
  h.postal_fsa,
  h.interest_keys,
  public.crm_display_list('helper_interest', h.interest_keys) AS interests_summary,
  h.interested_in_child_support AS child_support_interest,
  h.garden_capability AS garden_interest,
  h.experience_text AS experience,
  h.motivation_text AS motivation,
  h.available_days,
  public.crm_display_list('weekday', h.available_days) AS days_summary,
  h.preferred_time_blocks AS preferred_times,
  public.crm_display_list('time_block', h.preferred_time_blocks) AS times_summary,
  h.preferred_weekly_hours AS weekly_hours,
  public.crm_display_label(
    'weekly_hours',
    h.preferred_weekly_hours
  ) AS weekly_hours_label,
  h.age_18_confirmed,
  h.work_eligible_canada,
  h.has_own_vehicle,
  h.screening_acknowledgement,
  h.document_original_filename AS document_filename,
  h.document_content_type AS document_type,
  h.document_byte_size AS document_bytes,
  h.document_storage_path AS document_locator,
  h.application_consent,
  h.application_consented_at,
  h.application_consent_purpose,
  h.future_opportunities_consent,
  h.future_opportunities_consented_at,
  h.future_opportunities_consent_purpose,
  h.privacy_policy_version AS privacy_notice_version,
  h.status AS submission_status,
  h.source_path,
  COALESCE(o.status, 'new') AS review_status,
  o.follow_up_on,
  o.last_contacted_on,
  o.assigned_to,
  o.notes AS internal_notes,
  o.id AS ops_id
FROM public.helper_applications AS h
LEFT JOIN public.crm_operations AS o
  ON o.helper_application_id = h.id
ORDER BY h.created_at DESC;
-- END VIEW crm_helper_applicants

-- BEGIN VIEW crm_contact_inquiries
CREATE VIEW public.crm_contact_inquiries
WITH (security_barrier = true, security_invoker = true)
AS
SELECT
  c.created_at AS submitted_at,
  c.id AS inquiry_id,
  c.name,
  c.email,
  c.phone,
  c.message,
  c.notification_status,
  c.notification_sent_at,
  c.notification_error,
  COALESCE(o.status, 'new') AS review_status,
  o.follow_up_on,
  o.last_contacted_on,
  o.assigned_to,
  o.notes AS internal_notes,
  o.id AS ops_id
FROM public.contact_inquiries AS c
LEFT JOIN public.crm_operations AS o
  ON o.contact_inquiry_id = c.id
ORDER BY c.created_at DESC;
-- END VIEW crm_contact_inquiries

-- BEGIN VIEW crm_activity_feed
CREATE VIEW public.crm_activity_feed
WITH (security_barrier = true, security_invoker = true)
AS
SELECT
  r.created_at AS activity_at,
  'prospective_client'::text AS record_type,
  r.id AS source_id,
  r.first_name AS name,
  r.email,
  NULL::text AS phone,
  concat_ws(
    ' · ',
    r.postal_code,
    r.service_area_community,
    public.crm_display_label('area_status', r.service_area_status)
  ) AS location_context,
  COALESCE(o.status, 'new') AS status,
  concat_ws(
    ' · ',
    public.crm_display_list('early_access_interest', r.service_interests),
    CASE
      WHEN r.frequency = 'other' THEN COALESCE(
        NULLIF(btrim(r.frequency_other), ''),
        public.crm_display_label('frequency', 'other')
      )
      ELSE public.crm_display_label('frequency', r.frequency)
    END,
    concat_ws(
      ', ',
      r.service_area_community,
      public.crm_display_label('area_status', r.service_area_status)
    )
  ) AS summary
FROM public.early_access_registrations AS r
LEFT JOIN public.crm_operations AS o
  ON o.early_access_registration_id = r.id
UNION ALL
SELECT
  h.created_at AS activity_at,
  'helper_applicant'::text AS record_type,
  h.id AS source_id,
  concat_ws(' ', h.first_name, h.last_name) AS name,
  h.email,
  h.telephone AS phone,
  concat_ws(' · ', h.postal_code, h.postal_fsa) AS location_context,
  COALESCE(o.status, 'new') AS status,
  concat_ws(
    ' · ',
    public.crm_display_list('helper_interest', h.interest_keys),
    public.crm_display_label('weekly_hours', h.preferred_weekly_hours)
  ) AS summary
FROM public.helper_applications AS h
LEFT JOIN public.crm_operations AS o
  ON o.helper_application_id = h.id
UNION ALL
SELECT
  c.created_at AS activity_at,
  'contact_inquiry'::text AS record_type,
  c.id AS source_id,
  c.name,
  c.email,
  c.phone,
  NULL::text AS location_context,
  COALESCE(o.status, 'new') AS status,
  left(c.message, 140) AS summary
FROM public.contact_inquiries AS c
LEFT JOIN public.crm_operations AS o
  ON o.contact_inquiry_id = c.id
ORDER BY activity_at DESC;
-- END VIEW crm_activity_feed

COMMENT ON VIEW public.crm_prospective_clients IS
  'Read-only founder view of early-access registrations plus follow-up. Edit crm_operations, not this view.';

COMMENT ON VIEW public.crm_helper_applicants IS
  'Read-only founder view of helper applications plus follow-up. Edit crm_operations, not this view. document_locator is a private storage path.';

COMMENT ON VIEW public.crm_contact_inquiries IS
  'Read-only founder view of contact inquiries plus follow-up. The contact source contract has no consent or privacy-version columns, and this view does not invent them.';

COMMENT ON VIEW public.crm_activity_feed IS
  'Read-only chronological founder feed. Helper experience, motivation, document paths, consent purpose text, and full contact messages are omitted.';

COMMENT ON COLUMN public.crm_helper_applicants.document_locator IS
  'Private Supabase Storage path in bucket helper-application-documents. This is not a public URL and not a signed URL.';

COMMENT ON COLUMN public.crm_helper_applicants.document_bytes IS
  'Stored file size in bytes from document_byte_size. This view does not contain file contents.';

-- ---------------------------------------------------------------------------
-- 7) View grants. SELECT for service_role only.
-- ---------------------------------------------------------------------------

REVOKE ALL ON TABLE public.crm_prospective_clients FROM PUBLIC;
REVOKE ALL ON TABLE public.crm_prospective_clients FROM anon;
REVOKE ALL ON TABLE public.crm_prospective_clients FROM authenticated;
GRANT SELECT ON TABLE public.crm_prospective_clients TO service_role;

REVOKE ALL ON TABLE public.crm_helper_applicants FROM PUBLIC;
REVOKE ALL ON TABLE public.crm_helper_applicants FROM anon;
REVOKE ALL ON TABLE public.crm_helper_applicants FROM authenticated;
GRANT SELECT ON TABLE public.crm_helper_applicants TO service_role;

REVOKE ALL ON TABLE public.crm_contact_inquiries FROM PUBLIC;
REVOKE ALL ON TABLE public.crm_contact_inquiries FROM anon;
REVOKE ALL ON TABLE public.crm_contact_inquiries FROM authenticated;
GRANT SELECT ON TABLE public.crm_contact_inquiries TO service_role;

REVOKE ALL ON TABLE public.crm_activity_feed FROM PUBLIC;
REVOKE ALL ON TABLE public.crm_activity_feed FROM anon;
REVOKE ALL ON TABLE public.crm_activity_feed FROM authenticated;
GRANT SELECT ON TABLE public.crm_activity_feed TO service_role;
