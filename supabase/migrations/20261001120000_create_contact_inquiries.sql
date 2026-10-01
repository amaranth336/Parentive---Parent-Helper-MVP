-- Contact form inquiries.
-- Writes are server-only via the service role. No public insert/read policies.
-- Multiple inquiries per email are allowed.
-- Client IP, user agent, and privacy-notice version are not stored.

CREATE TABLE public.contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  notification_status text NOT NULL DEFAULT 'pending',
  notification_error text,
  notification_sent_at timestamptz,

  CONSTRAINT contact_inquiries_name_len
    CHECK (char_length(name) BETWEEN 1 AND 80),
  CONSTRAINT contact_inquiries_email_len
    CHECK (char_length(email) BETWEEN 5 AND 254),
  CONSTRAINT contact_inquiries_phone_len
    CHECK (phone IS NULL OR char_length(phone) BETWEEN 1 AND 30),
  CONSTRAINT contact_inquiries_message_len
    CHECK (char_length(message) BETWEEN 1 AND 5000),
  CONSTRAINT contact_inquiries_notification_status_check
    CHECK (notification_status IN ('pending', 'sent', 'failed')),
  CONSTRAINT contact_inquiries_notification_error_len
    CHECK (notification_error IS NULL OR char_length(notification_error) <= 500),
  CONSTRAINT contact_inquiries_notification_sent_at_check
    CHECK (
      notification_sent_at IS NULL
      OR notification_status = 'sent'
    ),
  CONSTRAINT contact_inquiries_notification_error_check
    CHECK (
      notification_error IS NULL
      OR notification_status = 'failed'
    )
);

CREATE INDEX contact_inquiries_created_at_idx
  ON public.contact_inquiries (created_at DESC);

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.contact_inquiries FROM PUBLIC;
REVOKE ALL ON TABLE public.contact_inquiries FROM anon;
REVOKE ALL ON TABLE public.contact_inquiries FROM authenticated;
GRANT ALL ON TABLE public.contact_inquiries TO service_role;

-- Zero policies for anon/authenticated. Service role writes only.
