import { createClient } from '@supabase/supabase-js';

/**
 * Retrieves environment variables with multiple fallback strategies.
 * Handles both VITE_ prefixed (local Vite) and non-prefixed (Vercel/Production) variables.
 */
const getEnvValue = (key: string): string | undefined => {
  const noPrefixKey = key.replace('VITE_', '');

  // 1. Check process.env (shimmed in most environments)
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[key]) return process.env[key];
    if (process.env[noPrefixKey]) return process.env[noPrefixKey];
  }

  // 2. Check import.meta.env (Vite standard)
  try {
    const meta = import.meta as any;
    if (meta && meta.env) {
      if (meta.env[key]) return meta.env[key];
      if (meta.env[noPrefixKey]) return meta.env[noPrefixKey];
    }
  } catch (e) {
    // import.meta might not be available in some contexts
  }

  return undefined;
};

const supabaseUrl = getEnvValue('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvValue('VITE_SUPABASE_ANON_KEY');

/**
 * Validation flag for UI usage.
 */
export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

// Initialize the client. We use a fallback string to prevent instantiation error,
// but the isSupabaseConfigured flag protects the application logic.
const supabase = createClient(
  supabaseUrl || 'https://missing-supabase-url.invalid',
  supabaseAnonKey || 'missing-key'
);

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.error(
    "FATAL: Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY or SUPABASE_URL / SUPABASE_ANON_KEY. " +
    "The application cannot communicate with the database. " +
    "Please configure these variables in your deployment environment (e.g., Vercel) and redeploy."
  );
}

export default supabase;