/**
 * Server-only Supabase service-role client.
 *
 * Import this from API routes, submit, and other server modules only.
 * Never import from client components, createBrowserClient, or lib/supabase/index.ts.
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
