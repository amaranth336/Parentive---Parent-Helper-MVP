-- Founding Helper applications.
-- Writes are server-only via the service role. No public insert/read policies.
-- Separate from early_access_registrations. Multiple applications per email allowed.

CREATE TABLE public.helper_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  telephone text NOT NULL,
  postal_code text NOT NULL,
  postal_fsa text NOT NULL,
  interest_keys text[] NOT NULL,
  interested_in_child_support boolean NOT NULL,
  garden_capability boolean NOT NULL,
  experience_text text NOT NULL,
  motivation_text text NOT NULL,
  available_days text[] NOT NULL,
  preferred_time_blocks text[] NOT NULL,
  preferred_weekly_hours text NOT NULL,
  age_18_confirmed boolean NOT NULL,
  work_eligible_canada boolean NOT NULL,
  has_own_vehicle boolean NOT NULL,
  screening_acknowledgement boolean NOT NULL,
  document_original_filename text NOT NULL,
  document_content_type text NOT NULL,
  document_byte_size integer NOT NULL,
  document_storage_path text NOT NULL,
  application_consent boolean NOT NULL,
  application_consented_at timestamptz NOT NULL,
  application_consent_purpose text NOT NULL,
  future_opportunities_consent boolean NOT NULL DEFAULT false,
  future_opportunities_consented_at timestamptz,
  future_opportunities_consent_purpose text,
  privacy_policy_version text NOT NULL,
  status text NOT NULL DEFAULT 'submitted',
  source_path text NOT NULL DEFAULT '/helpers',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT helper_applications_first_name_len
    CHECK (char_length(first_name) BETWEEN 1 AND 80),
  CONSTRAINT helper_applications_last_name_len
    CHECK (char_length(last_name) BETWEEN 1 AND 80),
  CONSTRAINT helper_applications_email_len
    CHECK (char_length(email) BETWEEN 5 AND 254),
  CONSTRAINT helper_applications_telephone_len
    CHECK (char_length(telephone) BETWEEN 7 AND 30),
  CONSTRAINT helper_applications_postal_len
    CHECK (char_length(postal_code) = 7),
  CONSTRAINT helper_applications_postal_fsa_len
    CHECK (char_length(postal_fsa) = 3),
  CONSTRAINT helper_applications_experience_len
    CHECK (char_length(experience_text) BETWEEN 1 AND 5000),
  CONSTRAINT helper_applications_motivation_len
    CHECK (char_length(motivation_text) BETWEEN 1 AND 5000),
  CONSTRAINT helper_applications_interest_keys_check
    CHECK (
      cardinality(interest_keys) >= 1
      AND interest_keys <@ ARRAY[
        'laundry_household_resets',
        'tidying_organizing',
        'food_kitchen',
        'parent_present_childcare',
        'flexible_household',
        'garden_outdoor'
      ]::text[]
    ),
  CONSTRAINT helper_applications_child_support_sync
    CHECK (
      interested_in_child_support
      = ('parent_present_childcare' = ANY (interest_keys))
    ),
  CONSTRAINT helper_applications_garden_sync
    CHECK (
      garden_capability = ('garden_outdoor' = ANY (interest_keys))
    ),
  CONSTRAINT helper_applications_days_check
    CHECK (
      cardinality(available_days) >= 1
      AND available_days <@ ARRAY[
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
      ]::text[]
    ),
  CONSTRAINT helper_applications_times_check
    CHECK (
      cardinality(preferred_time_blocks) >= 1
      AND preferred_time_blocks <@ ARRAY[
        'mornings',
        'afternoons',
        'evenings',
        'flexible'
      ]::text[]
    ),
  CONSTRAINT helper_applications_hours_check
    CHECK (
      preferred_weekly_hours IN (
        'under_6',
        '6_to_10',
        '11_to_20',
        '21_plus'
      )
    ),
  CONSTRAINT helper_applications_age_18_true
    CHECK (age_18_confirmed = true),
  CONSTRAINT helper_applications_work_eligible_true
    CHECK (work_eligible_canada = true),
  CONSTRAINT helper_applications_vehicle_true
    CHECK (has_own_vehicle = true),
  CONSTRAINT helper_applications_screening_true
    CHECK (screening_acknowledgement = true),
  CONSTRAINT helper_applications_document_size
    CHECK (document_byte_size > 0 AND document_byte_size <= 5242880),
  CONSTRAINT helper_applications_document_type
    CHECK (
      document_content_type IN (
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
    ),
  CONSTRAINT helper_applications_application_consent_true
    CHECK (application_consent = true),
  CONSTRAINT helper_applications_future_pair
    CHECK (
      (
        future_opportunities_consent = false
        AND future_opportunities_consented_at IS NULL
        AND future_opportunities_consent_purpose IS NULL
      )
      OR (
        future_opportunities_consent = true
        AND future_opportunities_consented_at IS NOT NULL
        AND future_opportunities_consent_purpose IS NOT NULL
      )
    ),
  CONSTRAINT helper_applications_status_check
    CHECK (
      status IN (
        'submitted',
        'reviewing',
        'intro_conversation',
        'assessment',
        'references',
        'conditional_offer',
        'background_check',
        'onboarding',
        'hired',
        'declined',
        'waitlisted',
        'withdrawn'
      )
    )
);

CREATE INDEX helper_applications_email_idx
  ON public.helper_applications (email);

CREATE INDEX helper_applications_created_at_idx
  ON public.helper_applications (created_at DESC);

CREATE INDEX helper_applications_status_idx
  ON public.helper_applications (status);

ALTER TABLE public.helper_applications ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.helper_applications FROM PUBLIC;
REVOKE ALL ON TABLE public.helper_applications FROM anon;
REVOKE ALL ON TABLE public.helper_applications FROM authenticated;
GRANT ALL ON TABLE public.helper_applications TO service_role;

-- Zero policies for anon/authenticated. Service role writes only.

INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
VALUES (
  'helper-application-documents',
  'helper-application-documents',
  false,
  5242880,
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]::text[]
)
ON CONFLICT (id) DO NOTHING;

-- No anon/authenticated storage policies. Service role uploads from the API only.
