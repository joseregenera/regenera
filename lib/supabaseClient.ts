import { createClient } from '@supabase/supabase-js';

/**
 * Safely retrieves environment variables. 
 * In browser-native ESM (implied by importmap usage), import.meta.env is undefined.
 * The preview environment typically shims process.env for injected variables.
 */
const getEnvVar = (key: string): string => {
  // Check process.env first (common in shimmed environments)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  
  // Fallback to import.meta.env for standard Vite builds
  const meta = import.meta as any;
  if (meta.env && meta.env[key]) {
    return meta.env[key] as string;
  }

  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// We provide default placeholder strings if keys are missing to prevent 
// initialization crashes, allowing the UI to load and display appropriate errors.
const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export default supabase;