import { createClient } from '@supabase/supabase-js';

/**
 * Static references to Vite environment variables.
 * Optional chaining prevents "Cannot read properties of undefined" if import.meta.env is not initialized.
 */
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

/**
 * Validation flag for UI components to show misconfiguration banners.
 */
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

/**
 * The Supabase client instance.
 * We use a descriptive placeholder URL to prevent the createClient constructor from throwing,
 * which allows the React application to boot and render the error UI in Wizard.tsx.
 * The services check isSupabaseConfigured before attempting any real network requests.
 */
const supabase = createClient(
  supabaseUrl || 'https://missing-configuration.supabase.co',
  supabaseAnonKey || 'missing-configuration-key'
);

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.error(
    "FATAL: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. " +
    "Check your Vercel Environment Variables and redeploy."
  );
}

export default supabase;