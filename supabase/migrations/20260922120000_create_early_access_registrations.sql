-- Early-access waitlist registrations.
-- Writes are server-only via the service role. No public insert policy.

CREATE TABLE public.early_access_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  email text NOT NULL UNIQUE,
  postal_code text NOT NULL,
  postal_fsa text NOT NULL,
  service_interests text[] NOT NULL DEFAULT '{}',
  service_interest_other text,
  frequency text,
  frequency_other text,
  service_area_status text NOT NULL,
  service_area_community text,
  pilot_contact_consent boolean NOT NULL,
  pilot_contact_consented_at timestamptz NOT NULL,
  pilot_contact_purpose text NOT NULL,
  marketing_consent boolean NOT NULL DEFAULT false,
  marketing_consented_at timestamptz,
  marketing_consent_purpose text,
  privacy_policy_version text NOT NULL,
  source_path text NOT NULL DEFAULT '/early-access',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT early_access_registrations_first_name_len
    CHECK (char_length(first_name) BETWEEN 1 AND 80),
  CONSTRAINT early_access_registrations_email_len
    CHECK (char_length(email) BETWEEN 5 AND 254),
  CONSTRAINT early_access_registrations_postal_len
    CHECK (char_length(postal_code) = 7),
  CONSTRAINT early_access_registrations_postal_fsa_len
    CHECK (char_length(postal_fsa) = 3),
  CONSTRAINT early_access_registrations_other_len
    CHECK (service_interest_other IS NULL OR char_length(service_interest_other) <= 500),
  CONSTRAINT early_access_registrations_freq_other_len
    CHECK (frequency_other IS NULL OR char_length(frequency_other) <= 120),
  CONSTRAINT early_access_registrations_status_check
    CHECK (service_area_status IN ('in_pilot', 'outside_pilot', 'unknown')),
  CONSTRAINT early_access_registrations_frequency_check
    CHECK (
      frequency IS NULL
      OR frequency IN ('one_time', 'weekly', 'biweekly', 'monthly', 'other')
    ),
  CONSTRAINT early_access_registrations_interests_check
    CHECK (
      service_interests <@ ARRAY[
        'home_laundry',
        'kitchen_meal',
        'family',
        'flexible',
        'other_support'
      ]::text[]
    ),
  CONSTRAINT early_access_registrations_other_only_when_selected
    CHECK (
      service_interest_other IS NULL
      OR 'other_support' = ANY (service_interests)
    ),
  CONSTRAINT early_access_registrations_freq_other_only_when_other
    CHECK (frequency_other IS NULL OR frequency = 'other'),
  CONSTRAINT early_access_registrations_community_check
    CHECK (
      service_area_community IS NULL
      OR service_area_community IN (
        'East Gwillimbury',
        'Newmarket',
        'Aurora',
        'Georgina',
        'Whitchurch-Stouffville',
        'Uxbridge'
      )
    ),
  CONSTRAINT early_access_registrations_community_when_pilot
    CHECK (
      service_area_community IS NULL
      OR service_area_status = 'in_pilot'
    ),
  CONSTRAINT early_access_registrations_pilot_consent_true
    CHECK (pilot_contact_consent = true),
  CONSTRAINT early_access_registrations_marketing_pair
    CHECK (
      (
        marketing_consent = false
        AND marketing_consented_at IS NULL
        AND marketing_consent_purpose IS NULL
      )
      OR (
        marketing_consent = true
        AND marketing_consented_at IS NOT NULL
        AND marketing_consent_purpose IS NOT NULL
      )
    )
);

CREATE INDEX early_access_registrations_postal_fsa_idx
  ON public.early_access_registrations (postal_fsa);

CREATE INDEX early_access_registrations_created_at_idx
  ON public.early_access_registrations (created_at DESC);

ALTER TABLE public.early_access_registrations ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.early_access_registrations FROM PUBLIC;
REVOKE ALL ON TABLE public.early_access_registrations FROM anon;
REVOKE ALL ON TABLE public.early_access_registrations FROM authenticated;
GRANT ALL ON TABLE public.early_access_registrations TO service_role;

-- Zero policies for anon/authenticated. Service role writes only.
