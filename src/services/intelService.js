import { supabase, supabaseState } from '../lib/supabase.js';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function riskToSeverity(score) {
  if (score > 40) return 'High';
  if (score > 25) return 'Medium';
  return 'Low';
}

export async function getIntelAlerts() {
  if (!supabaseState.ready || !supabase) {
    return { data: null, source: 'local', error: null };
  }

  const { data, error } = await supabase
    .from('intel_alerts')
    .select('*')
    .eq('status', 'active')
    .order('risk_score', { ascending: false });

  if (error) return { data: null, source: 'supabase', error };

  const activeAlerts = (data || []).map((row) => ({
    id: row.id,
    corridor: row.corridor,
    severity: riskToSeverity(row.risk_score),
    advisory: row.advisory,
    headline: row.headline,
    riskScore: row.risk_score,
  }));

  return { data: activeAlerts, source: 'supabase', error: null };
}

export async function getIntelRiskTrend() {
  if (!supabaseState.ready || !supabase) {
    return { data: null, source: 'local', error: null };
  }

  const { data, error } = await supabase
    .from('intel_alerts')
    .select('risk_score, created_at')
    .eq('status', 'active');

  if (error) return { data: null, source: 'supabase', error };

  // Aggregate average risk per day-of-week
  const buckets = Array.from({ length: 7 }, () => ({ sum: 0, count: 0 }));
  (data || []).forEach((row) => {
    const day = new Date(row.created_at).getDay();
    buckets[day].sum += row.risk_score;
    buckets[day].count += 1;
  });

  const trend = DAY_LABELS.map((day, i) => ({
    day,
    risk: buckets[i].count > 0 ? Math.round(buckets[i].sum / buckets[i].count) : 0,
  }));

  return { data: trend, source: 'supabase', error: null };
}
