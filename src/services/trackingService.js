import { supabase, supabaseState } from '../lib/supabase.js';

const demoSummary = {
  inTransit: 128,
  delayed: 6,
  deliveredToday: 43,
};

const demoShipmentsByCode = {
  'VGX-44591': {
    trackingCode: 'VGX-44591',
    status: 'VERIFIED',
    location: 'ROTTERDAM PORT',
    eta: '3 DAYS',
  },
  'VGX-20391': {
    trackingCode: 'VGX-20391',
    status: 'VERIFIED',
    location: 'ROTTERDAM',
    eta: '2 DAYS',
  },
  'VGX-44291': {
    trackingCode: 'VGX-44291',
    status: 'IN TRANSIT',
    location: 'NORTH SEA CORRIDOR',
    eta: '4 DAYS',
  },
};

function normalizeTrackingCode(code) {
  return String(code || '')
    .trim()
    .toUpperCase();
}

function mapShipmentRow(row) {
  return {
    trackingCode: row.tracking_code,
    status: String(row.status || 'UNKNOWN').toUpperCase(),
    location: String(row.location || 'UNSPECIFIED').toUpperCase(),
    eta: String(row.eta || 'TBD').toUpperCase(),
  };
}

function isExpectedMissingRowError(error) {
  return (
    error &&
    (error.code === 'PGRST116' ||
      String(error.message || '')
        .toLowerCase()
        .includes('no rows'))
  );
}

export async function getTrackingSummary() {
  if (!supabaseState.ready || !supabase) {
    return { source: 'demo', summary: demoSummary };
  }

  try {
    const [inTransitResult, delayedResult, deliveredResult] = await Promise.all(
      [
        supabase
          .from('shipments')
          .select('id', { head: true, count: 'exact' })
          .eq('status', 'IN TRANSIT'),
        supabase
          .from('shipments')
          .select('id', { head: true, count: 'exact' })
          .eq('status', 'DELAYED'),
        supabase
          .from('shipments')
          .select('id', { head: true, count: 'exact' })
          .eq('status', 'DELIVERED TODAY'),
      ],
    );

    const errors = [
      inTransitResult.error,
      delayedResult.error,
      deliveredResult.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      throw errors[0];
    }

    return {
      source: 'supabase',
      summary: {
        inTransit: inTransitResult.count || 0,
        delayed: delayedResult.count || 0,
        deliveredToday: deliveredResult.count || 0,
      },
    };
  } catch {
    return { source: 'demo', summary: demoSummary };
  }
}

export async function getTrackingByCode(code) {
  const normalizedCode = normalizeTrackingCode(code);

  if (!normalizedCode) {
    return {
      source: 'demo',
      data: null,
      error: 'Enter a tracking code to continue.',
    };
  }

  if (supabaseState.ready && supabase) {
    const { data, error } = await supabase
      .from('shipments')
      .select('tracking_code, status, location, eta')
      .eq('tracking_code', normalizedCode)
      .limit(1)
      .single();

    if (error && !isExpectedMissingRowError(error)) {
      return {
        source: 'supabase',
        data: null,
        error: 'Could not fetch live tracking right now. Using demo mode.',
      };
    }

    if (data) {
      return {
        source: 'supabase',
        data: mapShipmentRow(data),
        error: null,
      };
    }
  }

  const demoMatch = demoShipmentsByCode[normalizedCode];

  if (demoMatch) {
    return { source: 'demo', data: demoMatch, error: null };
  }

  return {
    source: 'demo',
    data: null,
    error: 'Tracking code was not found.',
  };
}
