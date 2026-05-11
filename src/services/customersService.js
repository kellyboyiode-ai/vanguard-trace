import { supabase, supabaseState } from '../lib/supabase.js';

export async function getCustomerProfile(userId) {
  if (!supabaseState.ready || !supabase || !userId) {
    return { data: null, source: 'local', error: null };
  }

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', userId)
    .single();

  return {
    data: data || null,
    source: 'supabase',
    error,
  };
}

export async function upsertCustomerProfile(profile) {
  if (!supabaseState.ready || !supabase) {
    return {
      data: null,
      source: 'local',
      error: new Error('Supabase is not configured for customer profiles.'),
    };
  }

  const { data, error } = await supabase
    .from('customers')
    .upsert(profile)
    .select()
    .single();

  return {
    data: data || null,
    source: 'supabase',
    error,
  };
}
