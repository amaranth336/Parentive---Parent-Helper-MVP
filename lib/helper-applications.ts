/**
 * Helper Application Storage
 * 
 * Handles persistence of helper applications.
 * Uses Supabase when configured, falls back to file-based storage for development.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { HelperApplication } from './supabase/helper-types';
import { createServerClient } from './supabase/client';

const DATA_DIR = path.join(process.cwd(), 'data');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'helper-applications.json');

interface ApplicationsDatabase {
  applications: HelperApplication[];
}

/**
 * Ensure the data directory and file exist
 */
async function ensureApplicationsFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(APPLICATIONS_FILE);
  } catch {
    await fs.writeFile(
      APPLICATIONS_FILE,
      JSON.stringify({ applications: [] }, null, 2),
      'utf-8'
    );
  }
}

/**
 * Read applications from file-based storage
 */
async function readApplicationsFromFile(): Promise<ApplicationsDatabase> {
  await ensureApplicationsFile();
  const raw = await fs.readFile(APPLICATIONS_FILE, 'utf-8');
  try {
    const parsed = JSON.parse(raw) as ApplicationsDatabase;
    if (!parsed.applications) return { applications: [] };
    return parsed;
  } catch {
    return { applications: [] };
  }
}

/**
 * Write applications to file-based storage
 */
async function writeApplicationsToFile(db: ApplicationsDatabase): Promise<void> {
  await ensureApplicationsFile();
  await fs.writeFile(APPLICATIONS_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

/**
 * Create a new helper application
 */
export async function createHelperApplication(
  data: Omit<HelperApplication, 'id' | 'created_at' | 'updated_at'>
): Promise<HelperApplication> {
  const supabase = createServerClient();
  
  // Try Supabase first
  if (supabase) {
    try {
      const { data: application, error } = await (supabase as any)
        .from('helper_applications')
        .insert([data])
        .select()
        .single();
      
      if (!error && application) {
        return application as HelperApplication;
      }
      
      console.error('Supabase insert error:', error);
    } catch (err) {
      console.error('Supabase error:', err);
    }
    // Fall through to file-based storage
  }
  
  // Fallback to file-based storage
  const db = await readApplicationsFromFile();
  const now = new Date().toISOString();
  const application: HelperApplication = {
    ...data,
    id: randomUUID(),
    created_at: now,
    updated_at: now,
  };
  
  db.applications.push(application);
  await writeApplicationsToFile(db);
  
  return application;
}

/**
 * Get a helper application by ID
 */
export async function getHelperApplication(id: string): Promise<HelperApplication | null> {
  const supabase = createServerClient();
  
  if (supabase) {
    const { data, error } = await supabase
      .from('helper_applications')
      .select('*')
      .eq('id', id)
      .single();
    
    if (!error && data) {
      return data;
    }
  }
  
  // Fallback to file-based storage
  const db = await readApplicationsFromFile();
  return db.applications.find((a) => a.id === id) || null;
}

/**
 * List all helper applications (for internal use only)
 */
export async function listHelperApplications(): Promise<HelperApplication[]> {
  const supabase = createServerClient();
  
  if (supabase) {
    const { data, error } = await supabase
      .from('helper_applications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      return data;
    }
  }
  
  // Fallback to file-based storage
  const db = await readApplicationsFromFile();
  return db.applications.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
