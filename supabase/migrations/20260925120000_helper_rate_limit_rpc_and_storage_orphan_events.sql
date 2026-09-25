-- Atomic helper-application rate-limit RPC + storage orphan events.
-- Additive only. Reuses helper_application_rate_limits from 20260924160000.
-- Service-role only. No public policies.

-- ---------------------------------------------------------------------------
-- 1) Atomic rate-limit check
-- Returns true = LIMITED (deny), false = ALLOWED.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.check_helper_application_rate_limit(
  p_rate_key text,
  p_max_requests integer DEFAULT 3,
  p_window_ms bigint DEFAULT 600000
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_key text;
  v_now timestamptz := clock_timestamp();
  v_window_ms bigint;
  v_row public.helper_application_rate_limits%ROWTYPE;
BEGIN
  IF p_rate_key IS NULL
     OR char_length(p_rate_key) < 1
     OR char_length(p_rate_key) > 200 THEN
    RAISE EXCEPTION 'invalid rate key length';
  END IF;

  IF p_max_requests IS NULL OR p_max_requests < 1 THEN
    RAISE EXCEPTION 'invalid p_max_requests';
  END IF;

  v_key := p_rate_key;
  v_window_ms := GREATEST(COALESCE(p_window_ms, 600000), 1);

  LOOP
    SELECT *
      INTO v_row
      FROM public.helper_application_rate_limits
     WHERE rate_key = v_key
     FOR UPDATE;

    IF NOT FOUND THEN
      BEGIN
        INSERT INTO public.helper_application_rate_limits (
          rate_key,
          window_started_at,
          hit_count,
          updated_at
        ) VALUES (
          v_key,
          v_now,
          1,
          v_now
        );
        RETURN false; -- ALLOWED
      EXCEPTION
        WHEN unique_violation THEN
          -- Concurrent insert won the race; retry with a row lock.
          CONTINUE;
      END;
    END IF;

    -- Fixed window expired → reset and count this request as the first hit.
    IF (EXTRACT(EPOCH FROM (v_now - v_row.window_started_at)) * 1000) >= v_window_ms THEN
      UPDATE public.helper_application_rate_limits
         SET window_started_at = v_now,
             hit_count = 1,
             updated_at = v_now
       WHERE rate_key = v_key;
      RETURN false; -- ALLOWED
    END IF;

    -- Already at capacity → LIMITED without incrementing.
    IF v_row.hit_count >= p_max_requests THEN
      RETURN true; -- LIMITED
    END IF;

    UPDATE public.helper_application_rate_limits
       SET hit_count = v_row.hit_count + 1,
           updated_at = v_now
     WHERE rate_key = v_key;

    RETURN false; -- ALLOWED
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.check_helper_application_rate_limit(text, integer, bigint)
  FROM PUBLIC;
REVOKE ALL ON FUNCTION public.check_helper_application_rate_limit(text, integer, bigint)
  FROM anon;
REVOKE ALL ON FUNCTION public.check_helper_application_rate_limit(text, integer, bigint)
  FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.check_helper_application_rate_limit(text, integer, bigint)
  FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.check_helper_application_rate_limit(text, integer, bigint)
  FROM anon;
REVOKE EXECUTE ON FUNCTION public.check_helper_application_rate_limit(text, integer, bigint)
  FROM authenticated;
GRANT EXECUTE ON FUNCTION public.check_helper_application_rate_limit(text, integer, bigint)
  TO service_role;

-- ---------------------------------------------------------------------------
-- 2) Orphan storage cleanup events (ops reconciliation; no PII)
-- ---------------------------------------------------------------------------

CREATE TABLE public.helper_application_storage_orphan_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket text NOT NULL DEFAULT 'helper-application-documents',
  storage_path text NOT NULL,
  reason text NOT NULL,
  attempt_count integer NOT NULL,
  error_excerpt text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT helper_application_storage_orphan_events_attempt_count_pos
    CHECK (attempt_count >= 1),
  CONSTRAINT helper_application_storage_orphan_events_status_check
    CHECK (status IN ('pending', 'resolved')),
  CONSTRAINT helper_application_storage_orphan_events_path_len
    CHECK (char_length(storage_path) BETWEEN 10 AND 200)
);

ALTER TABLE public.helper_application_storage_orphan_events ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.helper_application_storage_orphan_events FROM PUBLIC;
REVOKE ALL ON TABLE public.helper_application_storage_orphan_events FROM anon;
REVOKE ALL ON TABLE public.helper_application_storage_orphan_events FROM authenticated;
GRANT ALL ON TABLE public.helper_application_storage_orphan_events TO service_role;

-- Zero policies for anon/authenticated. Service role only.
