-- Oak Ridges (L4E) and King Township (L7B) are now pilot communities.
-- Existing rows stay valid: this only widens the allowed community names.

ALTER TABLE public.early_access_registrations
  DROP CONSTRAINT early_access_registrations_community_check;

ALTER TABLE public.early_access_registrations
  ADD CONSTRAINT early_access_registrations_community_check
    CHECK (
      service_area_community IS NULL
      OR service_area_community IN (
        'East Gwillimbury',
        'Newmarket',
        'Aurora',
        'Georgina',
        'Whitchurch-Stouffville',
        'Uxbridge',
        'Bradford',
        'Oak Ridges',
        'King Township'
      )
    );
