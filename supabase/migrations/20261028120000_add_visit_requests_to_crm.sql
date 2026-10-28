-- Founder follow-up for pilot visit requests from /our-support.
-- Extends crm_operations. Does not change pilot_visit_requests rows.
-- A stored request is still not a confirmed booking and does not collect payment.

ALTER TABLE public.crm_operations
  ADD COLUMN pilot_visit_request_id uuid;

ALTER TABLE public.crm_operations
  ADD CONSTRAINT crm_operations_pilot_visit_request_id_key
    UNIQUE (pilot_visit_request_id);

ALTER TABLE public.crm_operations
  ADD CONSTRAINT crm_operations_pilot_visit_request_id_fkey
    FOREIGN KEY (pilot_visit_request_id)
    REFERENCES public.pilot_visit_requests (id)
    ON DELETE CASCADE;

ALTER TABLE public.crm_operations
  DROP CONSTRAINT crm_operations_exactly_one_source;

ALTER TABLE public.crm_operations
  ADD CONSTRAINT crm_operations_exactly_one_source
    CHECK (
      num_nonnulls(
        early_access_registration_id,
        helper_application_id,
        contact_inquiry_id,
        pilot_visit_request_id
      ) = 1
    );

ALTER TABLE public.crm_operations
  DROP CONSTRAINT crm_operations_status_for_source;

ALTER TABLE public.crm_operations
  ADD CONSTRAINT crm_operations_status_for_source
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
      OR (
        pilot_visit_request_id IS NOT NULL
        AND status IN (
          'new',
          'reviewing',
          'quoted',
          'awaiting_payment',
          'booked',
          'declined',
          'closed',
          'spam'
        )
      )
    );

COMMENT ON TABLE public.crm_operations IS
  'Founder-only follow-up for one early-access registration, helper application, contact inquiry, or pilot visit request. Submission rows are not stored here and are not modified by this table.';

-- ---------------------------------------------------------------------------
-- Seed one operations row when a visit request is inserted.
-- ON CONFLICT keeps a second fire from creating a duplicate.
-- The function does not assign NEW fields on the source row.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.crm_operations_seed_visit_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  INSERT INTO public.crm_operations (
    pilot_visit_request_id,
    status
  ) VALUES (
    NEW.id,
    'new'
  )
  ON CONFLICT (pilot_visit_request_id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER crm_operations_seed_visit_request
  AFTER INSERT ON public.pilot_visit_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.crm_operations_seed_visit_request();

REVOKE ALL ON FUNCTION public.crm_operations_seed_visit_request() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.crm_operations_seed_visit_request() FROM anon;
REVOKE ALL ON FUNCTION public.crm_operations_seed_visit_request() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.crm_operations_seed_visit_request() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.crm_operations_seed_visit_request() FROM anon;
REVOKE EXECUTE ON FUNCTION public.crm_operations_seed_visit_request() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.crm_operations_seed_visit_request() TO service_role;

COMMENT ON FUNCTION public.crm_operations_seed_visit_request() IS
  'Inserts a new crm_operations row for a pilot visit request. Does not modify the request.';

-- ---------------------------------------------------------------------------
-- Backfill. Idempotent. Does not update source rows.
-- ---------------------------------------------------------------------------

INSERT INTO public.crm_operations (
  pilot_visit_request_id,
  status
)
SELECT
  id,
  'new'
FROM public.pilot_visit_requests
ON CONFLICT (pilot_visit_request_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Read-only founder view.
-- security_invoker keeps base-table RLS in force for the querying role.
-- The operations join also prevents Postgres from auto-updating the view.
-- ---------------------------------------------------------------------------

-- BEGIN VIEW crm_visit_requests
CREATE VIEW public.crm_visit_requests
WITH (security_barrier = true, security_invoker = true)
AS
SELECT
  v.created_at AS submitted_at,
  v.id AS request_id,
  v.name,
  v.email,
  v.postal_code,
  v.postal_fsa,
  v.preferred_times,
  v.visit_type,
  v.recurring_preferences,
  v.service_ids,
  v.service_lines,
  CASE
    WHEN jsonb_typeof(v.service_lines) = 'array' THEN (
      SELECT string_agg(item.line->>'name', ', ' ORDER BY item.ordinality)
      FROM jsonb_array_elements(v.service_lines) WITH ORDINALITY AS item(line, ordinality)
    )
    ELSE NULL
  END AS services_summary,
  v.subtotal_cents,
  v.currency,
  v.quote_required,
  v.flexible_description,
  v.minimum_cents,
  v.fixed_below_minimum,
  v.helper_notes,
  v.marketing_consent,
  v.request_contact_purpose,
  v.privacy_policy_version AS privacy_notice_version,
  v.source_path,
  v.notification_status,
  v.notification_sent_at,
  v.notification_error,
  COALESCE(o.status, 'new') AS review_status,
  o.follow_up_on,
  o.last_contacted_on,
  o.assigned_to,
  o.notes AS internal_notes,
  o.id AS ops_id
FROM public.pilot_visit_requests AS v
LEFT JOIN public.crm_operations AS o
  ON o.pilot_visit_request_id = v.id
ORDER BY v.created_at DESC;
-- END VIEW crm_visit_requests

COMMENT ON VIEW public.crm_visit_requests IS
  'Read-only founder view of pilot visit requests plus follow-up. Edit crm_operations, not this view. A row is a request, not a confirmed booking.';

REVOKE ALL ON TABLE public.crm_visit_requests FROM PUBLIC;
REVOKE ALL ON TABLE public.crm_visit_requests FROM anon;
REVOKE ALL ON TABLE public.crm_visit_requests FROM authenticated;
GRANT SELECT ON TABLE public.crm_visit_requests TO service_role;

-- ---------------------------------------------------------------------------
-- Activity feed. Same columns as the existing view, plus visit requests.
-- Omits helper notes, flexible-support text, and contact-purpose text.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE VIEW public.crm_activity_feed
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
UNION ALL
SELECT
  v.created_at AS activity_at,
  'visit_request'::text AS record_type,
  v.id AS source_id,
  v.name,
  v.email,
  NULL::text AS phone,
  v.postal_code AS location_context,
  COALESCE(o.status, 'new') AS status,
  concat_ws(
    ' · ',
    CASE v.visit_type
      WHEN 'recurring' THEN 'Recurring scheduled visits'
      ELSE 'One-time visit'
    END,
    CASE
      WHEN jsonb_typeof(v.service_lines) = 'array' THEN (
        SELECT string_agg(item.line->>'name', ', ' ORDER BY item.ordinality)
        FROM jsonb_array_elements(v.service_lines) WITH ORDINALITY AS item(line, ordinality)
      )
      ELSE NULL
    END,
    CASE
      WHEN v.quote_required AND v.subtotal_cents = 0 THEN 'Quoted separately'
      WHEN v.quote_required THEN 'Priced services plus a separate quote'
      ELSE 'Priced services'
    END
  ) AS summary
FROM public.pilot_visit_requests AS v
LEFT JOIN public.crm_operations AS o
  ON o.pilot_visit_request_id = v.id
ORDER BY activity_at DESC;

COMMENT ON VIEW public.crm_activity_feed IS
  'Read-only chronological founder feed. Helper experience, motivation, document paths, consent purpose text, visit helper notes, flexible-support details, and full contact messages are omitted.';

REVOKE ALL ON TABLE public.crm_activity_feed FROM PUBLIC;
REVOKE ALL ON TABLE public.crm_activity_feed FROM anon;
REVOKE ALL ON TABLE public.crm_activity_feed FROM authenticated;
GRANT SELECT ON TABLE public.crm_activity_feed TO service_role;
