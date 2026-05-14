import { isSupabaseReady, supabase } from '../lib/supabase.js';

function safeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function predictDelayRisk({ congestionIndex = 0, weatherRisk = 0, customsLoad = 0 }) {
  const weighted =
    safeNumber(congestionIndex) * 0.5 +
    safeNumber(weatherRisk) * 0.3 +
    safeNumber(customsLoad) * 0.2;

  if (weighted >= 70) {
    return {
      level: 'high',
      message: 'Potential high delay probability. Consider alternate corridor.',
    };
  }

  if (weighted >= 45) {
    return {
      level: 'medium',
      message: 'Moderate delay risk detected. Increase monitoring cadence.',
    };
  }

  return {
    level: 'low',
    message: 'Delay risk is currently within acceptable operational range.',
  };
}

export function summarizeOperations({ activeShipments = 0, delayedShipments = 0, riskIndex = 0 }) {
  if (delayedShipments > 12 || riskIndex > 35) {
    return 'Operational posture: caution. Route optimization and alert escalation recommended.';
  }

  if (delayedShipments > 6 || riskIndex > 24) {
    return 'Operational posture: watch. Minor instability detected in selected corridors.';
  }

  return `Operational posture: stable. ${activeShipments} active shipments are within monitored thresholds.`;
}

export async function fetchRecentIntelligence(limit = 8) {
  if (!isSupabaseReady() || !supabase) {
    return {
      source: 'demo',
      rows: [],
      error: null,
    };
  }

  const { data, error } = await supabase
    .from('intel_signals')
    .select('id, signal_type, severity, headline, advisory, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  return {
    source: 'supabase',
    rows: data || [],
    error: error?.message || null,
  };
}
