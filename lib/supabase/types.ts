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

export type Database = {
  public: {
    Tables: {
      early_access_registrations: {
        Row: EarlyAccessRegistrationRow;
        Insert: EarlyAccessRegistrationInsert;
        Update: EarlyAccessRegistrationUpdate;
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
