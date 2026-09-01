-- Parentive Support Requests Schema
-- 
-- This schema supports the Request Parentive Support flow (Linear 008).
-- It stores structured support requests during pre-launch and includes
-- conditional fields for food services and child support services.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Support request statuses
CREATE TYPE support_request_status AS ENUM (
  'submitted',
  'under_review',
  'needs_information',
  'accepted',
  'declined',
  'waitlisted',
  'scheduled',
  'completed',
  'cancelled'
);

-- Time window preferences
CREATE TYPE preferred_time_window AS ENUM (
  'morning',
  'afternoon',
  'evening',
  'flexible'
);

-- Recurrence options
CREATE TYPE recurrence_type AS ENUM (
  'one-time',
  'weekly',
  'biweekly',
  'monthly',
  'flexible'
);

-- Contact method preferences
CREATE TYPE contact_method AS ENUM (
  'email',
  'text',
  'either'
);

-- Weekday selections
CREATE TYPE weekday AS ENUM (
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
  'flexible'
);

-- Main support requests table
CREATE TABLE support_requests (
  -- Primary key and timestamps
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Status and internal metadata
  status support_request_status NOT NULL DEFAULT 'submitted',
  internal_notes TEXT,
  
  -- Step 1: Services
  selected_services TEXT[] NOT NULL, -- array of service slugs
  flexible_support_description TEXT,
  service_notes TEXT,
  
  -- Step 2: Timing
  preferred_date DATE,
  alternate_date DATE,
  date_flexible BOOLEAN NOT NULL DEFAULT false,
  preferred_time_window preferred_time_window NOT NULL,
  recurrence recurrence_type NOT NULL,
  preferred_weekdays weekday[],
  arrival_notification_preference TEXT CHECK (arrival_notification_preference IN ('yes', 'no', 'no-preference')),
  
  -- Step 3: Household context
  postal_code VARCHAR(10) NOT NULL,
  municipality VARCHAR(255),
  in_service_area BOOLEAN NOT NULL DEFAULT false,
  has_pets BOOLEAN NOT NULL DEFAULT false,
  pet_details TEXT,
  access_considerations TEXT,
  household_notes TEXT,
  
  -- Conditional: Food services
  ingredients_available TEXT CHECK (ingredients_available IN ('yes', 'not-sure', 'not-applicable')),
  recipe_text TEXT,
  recipe_url TEXT,
  recipe_file_url TEXT,
  food_allergies_present BOOLEAN NOT NULL DEFAULT false,
  food_allergy_details TEXT,
  food_service_notes TEXT,
  
  -- Conditional: Child support services
  number_of_children INTEGER CHECK (number_of_children >= 0),
  children_ages TEXT[], -- array of age descriptions
  expected_activities TEXT,
  child_routine_context TEXT,
  child_support_assessment TEXT,
  parent_remains_onsite_confirmed BOOLEAN NOT NULL DEFAULT false,
  
  -- Step 4: Contact information
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile VARCHAR(50) NOT NULL,
  preferred_contact_method contact_method NOT NULL,
  
  -- Consent
  contact_consent BOOLEAN NOT NULL DEFAULT false,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT contact_consent_required CHECK (contact_consent = true)
);

-- Indexes for common queries
CREATE INDEX idx_support_requests_status ON support_requests(status);
CREATE INDEX idx_support_requests_created_at ON support_requests(created_at DESC);
CREATE INDEX idx_support_requests_email ON support_requests(email);
CREATE INDEX idx_support_requests_postal_code ON support_requests(postal_code);
CREATE INDEX idx_support_requests_in_service_area ON support_requests(in_service_area);

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_support_requests_updated_at
  BEFORE UPDATE ON support_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for customer submissions)
-- In production, consider adding rate limiting via API route
CREATE POLICY "Allow anonymous insert" ON support_requests
  FOR INSERT
  WITH CHECK (true);

-- Prevent public reads (only internal/authenticated access should read)
-- This prevents customers from querying other requests
CREATE POLICY "Prevent public reads" ON support_requests
  FOR SELECT
  USING (false);

-- Prevent public updates/deletes
CREATE POLICY "Prevent public updates" ON support_requests
  FOR UPDATE
  USING (false);

CREATE POLICY "Prevent public deletes" ON support_requests
  FOR DELETE
  USING (false);

-- Storage bucket for recipe uploads
-- Create a private bucket for recipe files
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-uploads', 'recipe-uploads', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for recipe uploads
-- Allow authenticated uploads (API will use service role)
CREATE POLICY "Allow authenticated recipe uploads"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'recipe-uploads');

-- Prevent public reads of recipe files
CREATE POLICY "Prevent public recipe reads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'recipe-uploads' AND false);

-- Comments for documentation
COMMENT ON TABLE support_requests IS 'Customer support requests submitted through the Request Parentive Support flow';
COMMENT ON COLUMN support_requests.selected_services IS 'Array of service slugs from the catalogue';
COMMENT ON COLUMN support_requests.in_service_area IS 'Whether the postal code is within the current service area';
COMMENT ON COLUMN support_requests.recipe_file_url IS 'Storage path to uploaded recipe file (if any)';
COMMENT ON COLUMN support_requests.contact_consent IS 'Required consent for Parentive to contact customer about request';
COMMENT ON COLUMN support_requests.marketing_consent IS 'Optional consent for marketing communications';
