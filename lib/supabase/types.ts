/**
 * Supabase Database Types
 * 
 * Type definitions for the Parentive support requests database schema.
 */

export type SupportRequestStatus =
  | 'submitted'
  | 'under_review'
  | 'needs_information'
  | 'accepted'
  | 'declined'
  | 'waitlisted'
  | 'scheduled'
  | 'completed'
  | 'cancelled';

export type PreferredTimeWindow = 'morning' | 'afternoon' | 'evening' | 'flexible';
export type Recurrence = 'one-time' | 'weekly' | 'biweekly' | 'monthly' | 'flexible';
export type PreferredContactMethod = 'email' | 'text' | 'either';
export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'flexible';

/**
 * Support request record
 */
export interface SupportRequest {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Request status and metadata
  status: SupportRequestStatus;
  internal_notes?: string | null;
  
  // Step 1: Services
  selected_services: string[]; // service slugs
  flexible_support_description?: string | null;
  service_notes?: string | null;
  
  // Step 2: Timing
  preferred_date?: string | null;
  alternate_date?: string | null;
  date_flexible: boolean;
  preferred_time_window: PreferredTimeWindow;
  recurrence: Recurrence;
  preferred_weekdays?: Weekday[] | null;
  arrival_notification_preference?: 'yes' | 'no' | 'no-preference' | null;
  
  // Step 3: Household context
  postal_code: string;
  municipality?: string | null;
  in_service_area: boolean;
  has_pets: boolean;
  pet_details?: string | null;
  access_considerations?: string | null;
  household_notes?: string | null;
  
  // Food service conditional
  ingredients_available?: 'yes' | 'not-sure' | 'not-applicable' | null;
  recipe_text?: string | null;
  recipe_url?: string | null;
  recipe_file_url?: string | null;
  food_allergies_present: boolean;
  food_allergy_details?: string | null;
  food_service_notes?: string | null;
  
  // Child support conditional
  number_of_children?: number | null;
  children_ages?: string[] | null;
  expected_activities?: string | null;
  child_routine_context?: string | null;
  child_support_assessment?: string | null;
  parent_remains_onsite_confirmed: boolean;
  
  // Step 4: Contact
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  preferred_contact_method: PreferredContactMethod;
  
  // Consent
  contact_consent: boolean;
  marketing_consent: boolean;
}

/**
 * Supabase database schema
 */
export interface Database {
  public: {
    Tables: {
      support_requests: {
        Row: SupportRequest;
        Insert: Omit<SupportRequest, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SupportRequest, 'id' | 'created_at'>>;
      };
    };
  };
}
