import { supabase, supabaseState } from '../lib/supabase.js';

export async function listMessages(limit = 30) {
  if (!supabaseState.ready || !supabase) {
    return { data: [], source: 'local', error: null };
  }

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  return {
    data: data || [],
    source: 'supabase',
    error,
  };
}

export async function sendMessage(messageInput) {
  if (!supabaseState.ready || !supabase) {
    return {
      data: null,
      source: 'local',
      error: new Error('Supabase is not configured for messaging.'),
    };
  }

  const { data, error } = await supabase
    .from('messages')
    .insert(messageInput)
    .select()
    .single();

  return {
    data: data || null,
    source: 'supabase',
    error,
  };
}
