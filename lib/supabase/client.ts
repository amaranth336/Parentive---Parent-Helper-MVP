/**
 * Supabase Client Configuration
 * 
 * Provides configured Supabase client instances for browser and server contexts.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Create browser-side Supabase client
 * Falls back to mock implementation if credentials not configured
 */
export function createBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Using mock implementation.');
    return null;
  }
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Create server-side Supabase client (for API routes)
 * Falls back to mock implementation if credentials not configured
 */
export function createServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}
