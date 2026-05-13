import { supabase, supabaseState } from '../lib/supabase.js';

export async function getOperationsQueue() {
  if (!supabaseState.ready || !supabase) {
    return { data: null, source: 'local', error: null };
  }

  const { data, error } = await supabase
    .from('operations_events')
    .select('title, severity, status')
    .order('severity', { ascending: false });

  if (error) return { data: null, source: 'supabase', error };

  // Group by title + severity, count occurrences
  const map = new Map();
  (data || []).forEach((row) => {
    const key = `${row.title}||${row.severity}`;
    if (!map.has(key)) {
      map.set(key, { task: row.title, severity: row.severity, count: 0 });
    }
    map.get(key).count += 1;
  });

  return { data: Array.from(map.values()), source: 'supabase', error: null };
}
