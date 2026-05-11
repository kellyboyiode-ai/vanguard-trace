import { supabase, supabaseState } from '../lib/supabase.js';

export async function uploadDocument(filePath, file) {
  if (!supabaseState.ready || !supabase) {
    return {
      data: null,
      source: 'local',
      error: new Error('Supabase storage is not configured.'),
    };
  }

  const bucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'documents';

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: false });

  return {
    data: data || null,
    source: 'supabase',
    error,
  };
}
