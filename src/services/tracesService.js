import { supabase, supabaseState } from '../lib/supabase.js';

const TRACKED_ROUTES = ['checkout', 'search', 'account'];

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

export async function getTraceTimeline() {
  if (!supabaseState.ready || !supabase) {
    return { data: null, source: 'local', error: null };
  }

  const { data, error } = await supabase
    .from('trace_events')
    .select('route_name, metric_value, recorded_at')
    .eq('metric_name', 'response_time_ms')
    .order('recorded_at', { ascending: true });

  if (error) return { data: null, source: 'supabase', error };

  // Pivot rows into { hour, checkout, search, account }
  const hourMap = new Map();
  (data || []).forEach((row) => {
    const route = row.route_name?.replace('/', '').toLowerCase();
    if (!TRACKED_ROUTES.includes(route)) return;
    const hour = new Date(row.recorded_at).toISOString().slice(11, 16); // "HH:MM"
    if (!hourMap.has(hour)) hourMap.set(hour, { hour, checkout: [], search: [], account: [] });
    hourMap.get(hour)[route].push(row.metric_value);
  });

  const timeline = Array.from(hourMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([hour, buckets]) => ({
      hour,
      checkout: median(buckets.checkout),
      search: median(buckets.search),
      account: median(buckets.account),
    }));

  return { data: timeline, source: 'supabase', error: null };
}

export async function getRouteMedians() {
  if (!supabaseState.ready || !supabase) {
    return { data: null, source: 'local', error: null };
  }

  const { data, error } = await supabase
    .from('trace_events')
    .select('route_name, metric_value')
    .eq('metric_name', 'response_time_ms');

  if (error) return { data: null, source: 'supabase', error };

  const routeBuckets = {};
  (data || []).forEach((row) => {
    const route = row.route_name;
    if (!routeBuckets[route]) routeBuckets[route] = [];
    routeBuckets[route].push(row.metric_value);
  });

  const medians = Object.entries(routeBuckets).map(([route, values]) => ({
    route,
    median: median(values),
  }));

  return { data: medians, source: 'supabase', error: null };
}
