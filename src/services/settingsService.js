import { supabase, supabaseState } from '../lib/supabase.js';

export async function getSettings(userId) {
  if (!supabaseState.ready || !supabase || !userId) {
    return { data: null, source: 'local', error: null };
  }

  const { data, error } = await supabase
    .from('customer_settings')
    .select('*')
    .eq('customer_id', userId)
    .single();

  return { data: data || null, source: 'supabase', error };
}

export async function upsertSettings(userId, settings) {
  if (!supabaseState.ready || !supabase || !userId) {
    return {
      data: null,
      source: 'local',
      error: new Error('Supabase is not configured for settings.'),
    };
  }

  const row = {
    customer_id: userId,
    alert_threshold_ms: settings.alertThresholdMs,
    report_retention_days: settings.retentionDays,
    weekly_digest_enabled: settings.weeklyDigestEnabled,
    preferred_corridor: settings.preferredCorridor,
  };

  const { data, error } = await supabase
    .from('customer_settings')
    .upsert(row, { onConflict: 'customer_id' })
    .select()
    .single();

  return { data: data || null, source: 'supabase', error };
}
