/**
 * Database types for Parentive.
 *
 * Do not reintroduce support_requests types here as part of ordinary work.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type EarlyAccessRegistrationRow = {
  id: string;
  first_name: string;
  email: string;
  postal_code: string;
  postal_fsa: string;
  service_interests: string[];
  service_interest_other: string | null;
  frequency: string | null;
  frequency_other: string | null;
  service_area_status: string;
  service_area_community: string | null;
  pilot_contact_consent: boolean;
  pilot_contact_consented_at: string;
  pilot_contact_purpose: string;
  marketing_consent: boolean;
  marketing_consented_at: string | null;
  marketing_consent_purpose: string | null;
  privacy_policy_version: string;
  source_path: string;
  created_at: string;
  updated_at: string;
};

export type EarlyAccessRegistrationInsert = {
  id?: string;
  first_name: string;
  email: string;
  postal_code: string;
  postal_fsa: string;
  service_interests?: string[];
  service_interest_other?: string | null;
  frequency?: string | null;
  frequency_other?: string | null;
  service_area_status: string;
  service_area_community?: string | null;
  pilot_contact_consent: boolean;
  pilot_contact_consented_at: string;
  pilot_contact_purpose: string;
  marketing_consent?: boolean;
  marketing_consented_at?: string | null;
  marketing_consent_purpose?: string | null;
  privacy_policy_version: string;
  source_path?: string;
  created_at?: string;
  updated_at?: string;
};

export type EarlyAccessRegistrationUpdate = {
  id?: string;
  first_name?: string;
  email?: string;
  postal_code?: string;
  postal_fsa?: string;
  service_interests?: string[];
  service_interest_other?: string | null;
  frequency?: string | null;
  frequency_other?: string | null;
  service_area_status?: string;
  service_area_community?: string | null;
  pilot_contact_consent?: boolean;
  pilot_contact_consented_at?: string;
  pilot_contact_purpose?: string;
  marketing_consent?: boolean;
  marketing_consented_at?: string | null;
  marketing_consent_purpose?: string | null;
  privacy_policy_version?: string;
  source_path?: string;
  created_at?: string;
  updated_at?: string;
};

export type HelperApplicationRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  telephone: string;
  postal_code: string;
  postal_fsa: string;
  interest_keys: string[];
  interested_in_child_support: boolean;
  garden_capability: boolean;
  experience_text: string;
  motivation_text: string;
  available_days: string[];
  preferred_time_blocks: string[];
  preferred_weekly_hours: string;
  age_18_confirmed: boolean;
  work_eligible_canada: boolean;
  has_own_vehicle: boolean;
  screening_acknowledgement: boolean;
  document_original_filename: string;
  document_content_type: string;
  document_byte_size: number;
  document_storage_path: string;
  application_consent: boolean;
  application_consented_at: string;
  application_consent_purpose: string;
  future_opportunities_consent: boolean;
  future_opportunities_consented_at: string | null;
  future_opportunities_consent_purpose: string | null;
  privacy_policy_version: string;
  status: string;
  source_path: string;
  created_at: string;
  updated_at: string;
};

export type HelperApplicationInsert = {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  telephone: string;
  postal_code: string;
  postal_fsa: string;
  interest_keys: string[];
  interested_in_child_support: boolean;
  garden_capability: boolean;
  experience_text: string;
  motivation_text: string;
  available_days: string[];
  preferred_time_blocks: string[];
  preferred_weekly_hours: string;
  age_18_confirmed: boolean;
  work_eligible_canada: boolean;
  has_own_vehicle: boolean;
  screening_acknowledgement: boolean;
  document_original_filename: string;
  document_content_type: string;
  document_byte_size: number;
  document_storage_path: string;
  application_consent: boolean;
  application_consented_at: string;
  application_consent_purpose: string;
  future_opportunities_consent?: boolean;
  future_opportunities_consented_at?: string | null;
  future_opportunities_consent_purpose?: string | null;
  privacy_policy_version: string;
  status?: string;
  source_path?: string;
  created_at?: string;
  updated_at?: string;
};

export type HelperApplicationUpdate = {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  telephone?: string;
  postal_code?: string;
  postal_fsa?: string;
  interest_keys?: string[];
  interested_in_child_support?: boolean;
  garden_capability?: boolean;
  experience_text?: string;
  motivation_text?: string;
  available_days?: string[];
  preferred_time_blocks?: string[];
  preferred_weekly_hours?: string;
  age_18_confirmed?: boolean;
  work_eligible_canada?: boolean;
  has_own_vehicle?: boolean;
  screening_acknowledgement?: boolean;
  document_original_filename?: string;
  document_content_type?: string;
  document_byte_size?: number;
  document_storage_path?: string;
  application_consent?: boolean;
  application_consented_at?: string;
  application_consent_purpose?: string;
  future_opportunities_consent?: boolean;
  future_opportunities_consented_at?: string | null;
  future_opportunities_consent_purpose?: string | null;
  privacy_policy_version?: string;
  status?: string;
  source_path?: string;
  created_at?: string;
  updated_at?: string;
};

export type HelperApplicationRateLimitRow = {
  rate_key: string;
  window_started_at: string;
  hit_count: number;
  updated_at: string;
};

export type HelperApplicationRateLimitInsert = {
  rate_key: string;
  window_started_at: string;
  hit_count?: number;
  updated_at?: string;
};

export type HelperApplicationRateLimitUpdate = {
  rate_key?: string;
  window_started_at?: string;
  hit_count?: number;
  updated_at?: string;
};

export type Database = {
  public: {
    Tables: {
      early_access_registrations: {
        Row: EarlyAccessRegistrationRow;
        Insert: EarlyAccessRegistrationInsert;
        Update: EarlyAccessRegistrationUpdate;
        Relationships: [];
      };
      helper_applications: {
        Row: HelperApplicationRow;
        Insert: HelperApplicationInsert;
        Update: HelperApplicationUpdate;
        Relationships: [];
      };
      helper_application_rate_limits: {
        Row: HelperApplicationRateLimitRow;
        Insert: HelperApplicationRateLimitInsert;
        Update: HelperApplicationRateLimitUpdate;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
