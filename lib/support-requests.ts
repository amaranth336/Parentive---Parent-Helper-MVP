/**
 * Support Request Storage
 * 
 * Handles persistence of support requests.
 * Uses Supabase when configured, falls back to file-based storage for development.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { SupportRequest } from './supabase/types';
import { createServerClient } from './supabase/client';

const DATA_DIR = path.join(process.cwd(), 'data');
const REQUESTS_FILE = path.join(DATA_DIR, 'support-requests.json');

interface RequestsDatabase {
  requests: SupportRequest[];
}

/**
 * Ensure the data directory and file exist
 */
async function ensureRequestsFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(REQUESTS_FILE);
  } catch {
    await fs.writeFile(
      REQUESTS_FILE,
      JSON.stringify({ requests: [] }, null, 2),
      'utf-8'
    );
  }
}

/**
 * Read requests from file-based storage
 */
async function readRequestsFromFile(): Promise<RequestsDatabase> {
  await ensureRequestsFile();
  const raw = await fs.readFile(REQUESTS_FILE, 'utf-8');
  try {
    const parsed = JSON.parse(raw) as RequestsDatabase;
    if (!parsed.requests) return { requests: [] };
    return parsed;
  } catch {
    return { requests: [] };
  }
}

/**
 * Write requests to file-based storage
 */
async function writeRequestsToFile(db: RequestsDatabase): Promise<void> {
  await ensureRequestsFile();
  await fs.writeFile(REQUESTS_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

/**
 * Create a new support request
 */
export async function createSupportRequest(
  data: Omit<SupportRequest, 'id' | 'created_at' | 'updated_at'>
): Promise<SupportRequest> {
  const supabase = createServerClient();
  
  // Try Supabase first
  if (supabase) {
    try {
      const { data: request, error } = await (supabase as any)
        .from('support_requests')
        .insert([data])
        .select()
        .single();
      
      if (!error && request) {
        return request as SupportRequest;
      }
      
      console.error('Supabase insert error:', error);
    } catch (err) {
      console.error('Supabase error:', err);
    }
    // Fall through to file-based storage
  }
  
  // Fallback to file-based storage
  const db = await readRequestsFromFile();
  const now = new Date().toISOString();
  const request: SupportRequest = {
    ...data,
    id: randomUUID(),
    created_at: now,
    updated_at: now,
  };
  
  db.requests.push(request);
  await writeRequestsToFile(db);
  
  return request;
}

/**
 * Get a support request by ID
 */
export async function getSupportRequest(id: string): Promise<SupportRequest | null> {
  const supabase = createServerClient();
  
  if (supabase) {
    const { data, error } = await supabase
      .from('support_requests')
      .select('*')
      .eq('id', id)
      .single();
    
    if (!error && data) {
      return data;
    }
  }
  
  // Fallback to file-based storage
  const db = await readRequestsFromFile();
  return db.requests.find((r) => r.id === id) || null;
}

/**
 * List all support requests (for internal use only)
 */
export async function listSupportRequests(): Promise<SupportRequest[]> {
  const supabase = createServerClient();
  
  if (supabase) {
    const { data, error } = await supabase
      .from('support_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      return data;
    }
  }
  
  // Fallback to file-based storage
  const db = await readRequestsFromFile();
  return db.requests.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
