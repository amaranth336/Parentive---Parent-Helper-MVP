-- Allow the current early-access hand-off options while keeping previously
-- stored interest keys valid for existing rows.

ALTER TABLE public.early_access_registrations
  DROP CONSTRAINT early_access_registrations_interests_check;

ALTER TABLE public.early_access_registrations
  ADD CONSTRAINT early_access_registrations_interests_check
  CHECK (
    service_interests <@ ARRAY[
      'home_laundry',
      'kitchen_meal',
      'family',
      'flexible',
      'other_support',
      'home_tidying',
      'laundry',
      'meal_prep',
      'light_organization',
      'light_cleaning',
      'occasional_child_engagement',
      'other'
    ]::text[]
  );

ALTER TABLE public.early_access_registrations
  DROP CONSTRAINT early_access_registrations_other_only_when_selected;

ALTER TABLE public.early_access_registrations
  ADD CONSTRAINT early_access_registrations_other_only_when_selected
  CHECK (
    service_interest_other IS NULL
    OR 'other_support' = ANY (service_interests)
    OR 'other' = ANY (service_interests)
  );
