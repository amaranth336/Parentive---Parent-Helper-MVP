-- Durable rate-limit windows for Founding Helper application POSTs.
-- Service-role only. No public read/write policies.

CREATE TABLE public.helper_application_rate_limits (
  rate_key text PRIMARY KEY,
  window_started_at timestamptz NOT NULL,
  hit_count integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT helper_application_rate_limits_hit_count_nonneg
    CHECK (hit_count >= 0),
  CONSTRAINT helper_application_rate_limits_key_len
    CHECK (char_length(rate_key) BETWEEN 1 AND 200)
);

ALTER TABLE public.helper_application_rate_limits ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.helper_application_rate_limits FROM PUBLIC;
REVOKE ALL ON TABLE public.helper_application_rate_limits FROM anon;
REVOKE ALL ON TABLE public.helper_application_rate_limits FROM authenticated;
GRANT ALL ON TABLE public.helper_application_rate_limits TO service_role;

-- Zero policies for anon/authenticated. Service role only.
