import { createClient } from '@supabase/supabase-js';

/**
 * Robustly retrieves environment variables from various possible sources.
 * Prioritizes process.env as per the environment guidelines.
 */
const getEnvVar = (key: string): string => {
  // 1. Try process.env (standard in this execution context)
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] as string;
    }
  } catch (e) {
    // process.env might not be accessible in all scopes
  }

  // 2. Try import.meta.env (Vite standard)
  try {
    const metaEnv = (import.meta as any).env;
    if (metaEnv && metaEnv[key]) {
      return metaEnv[key] as string;
    }
  } catch (e) {
    // import.meta.env might not be defined
  }

  return '';
};

// Check for both prefixed and non-prefixed versions
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || getEnvVar('SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || getEnvVar('SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "CRITICAL: Supabase credentials are missing. " +
    "Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment variables."
  );
}

/**
 * Initialize the Supabase client.
 * We provide a fallback string to prevent 'supabaseUrl is required' initialization crash,
 * allowing the UI to render so the user can see error states or instructions.
 */
export const supabase = createClient(
  supabaseUrl || 'https://missing-supabase-url.supabase.co',
  supabaseAnonKey || 'missing-supabase-anon-key'
);
