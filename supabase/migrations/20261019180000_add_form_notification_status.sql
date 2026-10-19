-- Record Resend admin-notification outcome for new early-access
-- registrations and helper applications. Same columns and checks as
-- contact_inquiries. Existing rows stay pending and are not emailed.

ALTER TABLE public.early_access_registrations
  ADD COLUMN notification_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN notification_error text,
  ADD COLUMN notification_sent_at timestamptz;

ALTER TABLE public.early_access_registrations
  ADD CONSTRAINT early_access_registrations_notification_status_check
    CHECK (notification_status IN ('pending', 'sent', 'failed')),
  ADD CONSTRAINT early_access_registrations_notification_error_len
    CHECK (notification_error IS NULL OR char_length(notification_error) <= 500),
  ADD CONSTRAINT early_access_registrations_notification_sent_at_check
    CHECK (
      notification_sent_at IS NULL
      OR notification_status = 'sent'
    ),
  ADD CONSTRAINT early_access_registrations_notification_error_check
    CHECK (
      notification_error IS NULL
      OR notification_status = 'failed'
    );

ALTER TABLE public.helper_applications
  ADD COLUMN notification_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN notification_error text,
  ADD COLUMN notification_sent_at timestamptz;

ALTER TABLE public.helper_applications
  ADD CONSTRAINT helper_applications_notification_status_check
    CHECK (notification_status IN ('pending', 'sent', 'failed')),
  ADD CONSTRAINT helper_applications_notification_error_len
    CHECK (notification_error IS NULL OR char_length(notification_error) <= 500),
  ADD CONSTRAINT helper_applications_notification_sent_at_check
    CHECK (
      notification_sent_at IS NULL
      OR notification_status = 'sent'
    ),
  ADD CONSTRAINT helper_applications_notification_error_check
    CHECK (
      notification_error IS NULL
      OR notification_status = 'failed'
    );
