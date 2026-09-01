/**
 * Supabase Helper Applications Types
 * 
 * Type definitions for the Parentive helper applications database schema.
 */

export type HelperApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'interview_scheduled'
  | 'assessment_scheduled'
  | 'awaiting_references'
  | 'reference_check_in_progress'
  | 'background_check_pending'
  | 'background_check_in_progress'
  | 'conditionally_accepted'
  | 'accepted'
  | 'declined'
  | 'withdrawn'
  | 'waitlisted';

export type AvailabilityWindow =
  | 'weekday_morning'
  | 'weekday_afternoon'
  | 'weekday_evening'
  | 'saturday'
  | 'sunday'
  | 'open_flexible';

export type HelperContactMethod = 'email' | 'text' | 'phone' | 'either';

/**
 * Helper application record
 */
export interface HelperApplication {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Application status and metadata
  status: HelperApplicationStatus;
  internal_notes?: string | null;
  hiring_stage?: string | null;
  
  // Personal information
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  preferred_contact_method: HelperContactMethod;
  
  // Location and transportation
  postal_code: string;
  municipality?: string | null;
  has_valid_drivers_license: boolean;
  has_reliable_vehicle: boolean;
  has_appropriate_insurance: boolean;
  
  // Employment eligibility
  age_18_or_over: boolean;
  legally_eligible_to_work_in_canada: boolean;
  
  // Availability
  availability_windows: AvailabilityWindow[];
  desired_weekly_hours_min?: number | null;
  desired_weekly_hours_max?: number | null;
  availability_notes?: string | null;
  
  // Experience and background
  relevant_experience?: string | null;
  why_interested?: string | null;
  strengths?: string | null;
  
  // Child support capability
  interested_in_child_support: boolean;
  child_support_experience?: string | null;
  child_engagement_approach?: string | null;
  
  // Additional qualifications
  has_first_aid_certification: boolean;
  first_aid_certification_details?: string | null;
  has_food_safety_certification: boolean;
  food_safety_certification_details?: string | null;
  additional_certifications?: string | null;
  
  // Work preferences and considerations
  physical_capabilities_confirmed: boolean;
  task_restrictions?: string | null;
  additional_information?: string | null;
  
  // Supporting documents
  resume_file_url?: string | null;
  cover_letter_file_url?: string | null;
  additional_document_urls?: string[] | null;
  
  // References
  references_provided: boolean;
  references_data?: any | null; // JSONB field
  
  // Consent and acknowledgments
  application_consent: boolean;
  pilot_hours_acknowledgment: boolean;
  founding_helper_interest_confirmed: boolean;
  
  // Marketing and sourcing
  how_did_you_hear_about_us?: string | null;
  marketing_consent: boolean;
}

/**
 * Extended database schema with helper applications
 */
export interface HelperDatabase {
  public: {
    Tables: {
      helper_applications: {
        Row: HelperApplication;
        Insert: Omit<HelperApplication, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<HelperApplication, 'id' | 'created_at'>>;
      };
    };
  };
}
