import { supabase, supabaseState } from '../lib/supabase.js';

export async function listReports(limit = 20) {
  if (!supabaseState.ready || !supabase) {
    return { data: [], source: 'local', error: null };
  }

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  return {
    data: data || [],
    source: 'supabase',
    error,
  };
}

export async function createReport(reportInput) {
  if (!supabaseState.ready || !supabase) {
    return {
      data: null,
      source: 'local',
      error: new Error('Supabase is not configured for report creation.'),
    };
  }

  const { data, error } = await supabase
    .from('reports')
    .insert(reportInput)
    .select()
    .single();

  return {
    data: data || null,
    source: 'supabase',
    error,
  };
}
