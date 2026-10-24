-- Pilot visit requests from /our-support.
-- Writes are server-only via the service role. No public insert/read policies.
-- Marketing consent is stored false: this form does not enroll requesters.
-- A stored request is not a confirmed booking and does not collect payment.

CREATE TABLE public.pilot_visit_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  postal_code text NOT NULL,
  postal_fsa text NOT NULL,
  preferred_times text NOT NULL,
  helper_notes text,
  visit_type text NOT NULL,
  recurring_preferences text,
  service_ids text[] NOT NULL,
  service_lines jsonb NOT NULL,
  subtotal_cents integer NOT NULL,
  quote_required boolean NOT NULL,
  flexible_description text,
  minimum_cents integer NOT NULL,
  fixed_below_minimum boolean NOT NULL,
  currency text NOT NULL DEFAULT 'CAD',
  marketing_consent boolean NOT NULL DEFAULT false,
  request_contact_purpose text NOT NULL,
  privacy_policy_version text NOT NULL,
  source_path text NOT NULL DEFAULT '/our-support',
  notification_status text NOT NULL DEFAULT 'pending',
  notification_error text,
  notification_sent_at timestamptz,

  CONSTRAINT pilot_visit_requests_name_len
    CHECK (char_length(name) BETWEEN 1 AND 80),
  CONSTRAINT pilot_visit_requests_email_len
    CHECK (char_length(email) BETWEEN 5 AND 254),
  CONSTRAINT pilot_visit_requests_postal_code_format
    CHECK (postal_code ~ '^[ABCEGHJ-NPRSTVXY][0-9][ABCEGHJ-NPRSTV-Z] [0-9][ABCEGHJ-NPRSTV-Z][0-9]$'),
  CONSTRAINT pilot_visit_requests_postal_fsa_len
    CHECK (char_length(postal_fsa) = 3),
  CONSTRAINT pilot_visit_requests_preferred_times_len
    CHECK (char_length(preferred_times) BETWEEN 1 AND 500),
  CONSTRAINT pilot_visit_requests_helper_notes_len
    CHECK (helper_notes IS NULL OR char_length(helper_notes) BETWEEN 1 AND 5000),
  CONSTRAINT pilot_visit_requests_visit_type_check
    CHECK (visit_type IN ('one-time', 'recurring')),
  CONSTRAINT pilot_visit_requests_recurring_preferences_check
    CHECK (
      (
        visit_type = 'one-time'
        AND recurring_preferences IS NULL
      )
      OR (
        visit_type = 'recurring'
        AND recurring_preferences IS NOT NULL
        AND char_length(recurring_preferences) BETWEEN 1 AND 2000
      )
    ),
  CONSTRAINT pilot_visit_requests_service_ids_check
    CHECK (
      cardinality(service_ids) BETWEEN 1 AND 18
      AND service_ids <@ ARRAY[
        'S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09',
        'S10', 'S12', 'S13', 'S14', 'S15', 'S16', 'S17', 'S18', 'S19'
      ]::text[]
    ),
  CONSTRAINT pilot_visit_requests_subtotal_nonnegative
    CHECK (subtotal_cents >= 0),
  CONSTRAINT pilot_visit_requests_minimum_check
    CHECK (minimum_cents IN (6000, 8000)),
  CONSTRAINT pilot_visit_requests_currency_cad
    CHECK (currency = 'CAD'),
  CONSTRAINT pilot_visit_requests_marketing_consent_false
    CHECK (marketing_consent = false),
  CONSTRAINT pilot_visit_requests_quote_description_check
    CHECK (
      (
        quote_required = false
        AND flexible_description IS NULL
      )
      OR (
        quote_required = true
        AND flexible_description IS NOT NULL
        AND char_length(flexible_description) BETWEEN 1 AND 2000
      )
    ),
  CONSTRAINT pilot_visit_requests_purpose_len
    CHECK (char_length(request_contact_purpose) BETWEEN 1 AND 500),
  CONSTRAINT pilot_visit_requests_privacy_version_len
    CHECK (char_length(privacy_policy_version) BETWEEN 1 AND 40),
  CONSTRAINT pilot_visit_requests_source_path_check
    CHECK (source_path = '/our-support'),
  CONSTRAINT pilot_visit_requests_notification_status_check
    CHECK (notification_status IN ('pending', 'sent', 'failed')),
  CONSTRAINT pilot_visit_requests_notification_error_len
    CHECK (notification_error IS NULL OR char_length(notification_error) <= 500),
  CONSTRAINT pilot_visit_requests_notification_sent_at_check
    CHECK (
      notification_sent_at IS NULL
      OR notification_status = 'sent'
    ),
  CONSTRAINT pilot_visit_requests_notification_error_check
    CHECK (
      notification_error IS NULL
      OR notification_status = 'failed'
    )
);

CREATE INDEX pilot_visit_requests_created_at_idx
  ON public.pilot_visit_requests (created_at DESC);

ALTER TABLE public.pilot_visit_requests ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.pilot_visit_requests FROM PUBLIC;
REVOKE ALL ON TABLE public.pilot_visit_requests FROM anon;
REVOKE ALL ON TABLE public.pilot_visit_requests FROM authenticated;
GRANT ALL ON TABLE public.pilot_visit_requests TO service_role;
