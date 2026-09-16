/**
 * Minimal empty Database placeholder.
 *
 * Table definitions will be added when a schema is introduced via migration.
 * Do not reintroduce support_requests types here as part of ordinary work.
 */

export type Database = {
  public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
