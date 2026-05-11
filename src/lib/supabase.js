import { createClient } from '@supabase/supabase-js';

function sanitizeEnvValue(value) {
  const cleaned = String(value || '').trim();

  if (!cleaned) {
    return '';
  }

  const placeholders = new Set([
    'your_url',
    'your_key',
    'your_anon_key',
    'your_supabase_url',
    'your_supabase_anon_key',
  ]);

  if (placeholders.has(cleaned.toLowerCase())) {
    return '';
  }

  return cleaned;
}

const supabaseUrl = sanitizeEnvValue(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey = sanitizeEnvValue(
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);
const enableSupabaseFlag =
  String(import.meta.env.VITE_ENABLE_SUPABASE || '')
    .trim()
    .toLowerCase() === 'true';

const hasSupabaseCredentials = Boolean(supabaseUrl && supabaseAnonKey);
const enableSupabase = enableSupabaseFlag || hasSupabaseCredentials;

export const supabaseState = {
  enabled: enableSupabase,
  configured: hasSupabaseCredentials,
  ready: enableSupabase && hasSupabaseCredentials,
};

export const supabase = hasSupabaseCredentials
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function getSupabaseReadinessMessage() {
  if (!supabaseState.enabled) {
    return 'Supabase integration is disabled. Using demo mode.';
  }

  if (!supabaseState.configured) {
    return 'Supabase credentials are missing. Check your environment variables.';
  }

  return 'Supabase integration is enabled.';
}

export function isSupabaseReady() {
  return supabaseState.ready;
}

export function assertSupabaseReady() {
  if (!supabaseState.ready || !supabase) {
    throw new Error(getSupabaseReadinessMessage());
  }
}
