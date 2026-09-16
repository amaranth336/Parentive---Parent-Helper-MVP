-- Parentive Helper Applications Schema
-- 
-- This schema supports the "Join the Hive" Helper recruitment flow (Linear 009).
-- It stores structured helper applications including availability, experience,
-- qualifications, and supporting documents.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Application statuses
CREATE TYPE helper_application_status AS ENUM (
  'submitted',
  'under_review',
  'interview_scheduled',
  'assessment_scheduled',
  'awaiting_references',
  'reference_check_in_progress',
  'background_check_pending',
  'background_check_in_progress',
  'conditionally_accepted',
  'accepted',
  'declined',
  'withdrawn',
  'waitlisted'
);

-- Availability windows
CREATE TYPE availability_window AS ENUM (
  'weekday_morning',
  'weekday_afternoon',
  'weekday_evening',
  'saturday',
  'sunday',
  'open_flexible'
);

-- Contact method preferences
CREATE TYPE helper_contact_method AS ENUM (
  'email',
  'text',
  'phone',
  'either'
);

-- Main helper applications table
CREATE TABLE helper_applications (
  -- Primary key and timestamps
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Application status and internal metadata
  status helper_application_status NOT NULL DEFAULT 'submitted',
  internal_notes TEXT,
  hiring_stage VARCHAR(100), -- e.g., 'phone_screen', 'in_person_interview', 'practical_assessment'
  
  -- Personal information
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile VARCHAR(50) NOT NULL,
  preferred_contact_method helper_contact_method NOT NULL,
  
  -- Location and transportation
  postal_code VARCHAR(10) NOT NULL,
  municipality VARCHAR(255),
  has_valid_drivers_license BOOLEAN NOT NULL DEFAULT false,
  has_reliable_vehicle BOOLEAN NOT NULL DEFAULT false,
  has_appropriate_insurance BOOLEAN NOT NULL DEFAULT false,
  
  -- Employment eligibility
  age_18_or_over BOOLEAN NOT NULL DEFAULT false,
  legally_eligible_to_work_in_canada BOOLEAN NOT NULL DEFAULT false,
  
  -- Availability
  availability_windows availability_window[] NOT NULL,
  desired_weekly_hours_min INTEGER CHECK (desired_weekly_hours_min >= 0 AND desired_weekly_hours_min <= 168),
  desired_weekly_hours_max INTEGER CHECK (desired_weekly_hours_max >= 0 AND desired_weekly_hours_max <= 168),
  availability_notes TEXT,
  
  -- Experience and background
  relevant_experience TEXT, -- Open-ended description of relevant experience
  why_interested TEXT, -- Why they're interested in becoming a Parentive Helper
  strengths TEXT, -- What they'd bring to the role
  
  -- Child support capability
  interested_in_child_support BOOLEAN NOT NULL DEFAULT false,
  child_support_experience TEXT,
  child_engagement_approach TEXT,
  
  -- Additional qualifications
  has_first_aid_certification BOOLEAN NOT NULL DEFAULT false,
  first_aid_certification_details TEXT,
  has_food_safety_certification BOOLEAN NOT NULL DEFAULT false,
  food_safety_certification_details TEXT,
  additional_certifications TEXT,
  
  -- Work preferences and considerations
  physical_capabilities_confirmed BOOLEAN NOT NULL DEFAULT false,
  task_restrictions TEXT, -- Any legitimate restrictions (religious, ethical, safety, capability)
  additional_information TEXT,
  
  -- Supporting documents (stored file paths)
  resume_file_url TEXT,
  cover_letter_file_url TEXT,
  additional_document_urls TEXT[], -- Array of additional document URLs
  
  -- References (to be collected post-initial application or in follow-up)
  references_provided BOOLEAN NOT NULL DEFAULT false,
  references_data JSONB, -- Flexible structure for reference information
  
  -- Consent and acknowledgments
  application_consent BOOLEAN NOT NULL DEFAULT false,
  pilot_hours_acknowledgment BOOLEAN NOT NULL DEFAULT false,
  founding_helper_interest_confirmed BOOLEAN NOT NULL DEFAULT false,
  
  -- Marketing and sourcing
  how_did_you_hear_about_us TEXT,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT application_consent_required CHECK (application_consent = true),
  CONSTRAINT valid_weekly_hours CHECK (
    (desired_weekly_hours_max IS NULL AND desired_weekly_hours_min IS NULL) OR
    (desired_weekly_hours_max >= desired_weekly_hours_min)
  ),
  CONSTRAINT driver_requirements CHECK (
    (has_valid_drivers_license = true AND has_reliable_vehicle = true AND has_appropriate_insurance = true) OR
    (has_valid_drivers_license = false AND has_reliable_vehicle = false AND has_appropriate_insurance = false)
  )
);

-- Indexes for common queries
CREATE INDEX idx_helper_applications_status ON helper_applications(status);
CREATE INDEX idx_helper_applications_created_at ON helper_applications(created_at DESC);
CREATE INDEX idx_helper_applications_email ON helper_applications(email);
CREATE INDEX idx_helper_applications_postal_code ON helper_applications(postal_code);
CREATE INDEX idx_helper_applications_child_support ON helper_applications(interested_in_child_support) WHERE interested_in_child_support = true;

-- Updated timestamp trigger
CREATE TRIGGER update_helper_applications_updated_at
  BEFORE UPDATE ON helper_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE helper_applications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for applicant submissions)
CREATE POLICY "Allow anonymous application submission" ON helper_applications
  FOR INSERT
  WITH CHECK (true);

-- Prevent public reads (only internal/authenticated access should read)
CREATE POLICY "Prevent public reads" ON helper_applications
  FOR SELECT
  USING (false);

-- Prevent public updates/deletes
CREATE POLICY "Prevent public updates" ON helper_applications
  FOR UPDATE
  USING (false);

CREATE POLICY "Prevent public deletes" ON helper_applications
  FOR DELETE
  USING (false);

-- Storage bucket for application documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('helper-application-documents', 'helper-application-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for application documents
CREATE POLICY "Allow authenticated document uploads"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'helper-application-documents');

CREATE POLICY "Prevent public document reads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'helper-application-documents' AND false);

-- Comments for documentation
COMMENT ON TABLE helper_applications IS 'Helper employment applications submitted through the Join the Hive recruitment flow';
COMMENT ON COLUMN helper_applications.hiring_stage IS 'Current stage in the hiring pipeline';
COMMENT ON COLUMN helper_applications.availability_windows IS 'Array of availability time windows';
COMMENT ON COLUMN helper_applications.relevant_experience IS 'Open-ended description of relevant experience from various backgrounds';
COMMENT ON COLUMN helper_applications.interested_in_child_support IS 'Whether applicant is interested in and suitable for child-support assignments';
COMMENT ON COLUMN helper_applications.task_restrictions IS 'Any legitimate task restrictions (religious, ethical, safety, capability)';
COMMENT ON COLUMN helper_applications.founding_helper_interest_confirmed IS 'Applicant understands and is interested in Founding Helper positioning';
COMMENT ON COLUMN helper_applications.pilot_hours_acknowledgment IS 'Applicant acknowledges flexible pilot hours with no guaranteed minimums';
