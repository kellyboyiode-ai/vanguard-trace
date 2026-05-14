import { useEffect } from 'react';
import { supabase, supabaseState } from '../lib/supabase.js';
import { fetchRecentIntelligence } from '../services/index.js';
import { useOperationsStore } from '../store/operationsStore.js';

async function fetchKpiSnapshot() {
  if (!supabaseState.ready || !supabase) {
    return null;
  }

  const [shipmentsResponse, delayedResponse, riskResponse] = await Promise.all([
    supabase.from('shipments').select('id', { count: 'exact', head: true }),
    supabase
      .from('shipments')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'DELAYED'),
    supabase
      .from('intel_alerts')
      .select('risk_score')
      .order('created_at', { ascending: false })
      .limit(12),
  ]);

  const activeShipments = shipmentsResponse.count || 0;
  const delayedShipments = delayedResponse.count || 0;
  const riskRows = riskResponse.data || [];

  const riskIndex = riskRows.length
    ? Math.round(
        riskRows.reduce((sum, item) => sum + Number(item.risk_score || 0), 0) /
          riskRows.length,
      )
    : 0;

  return {
    activeShipments,
    delayedShipments,
    riskIndex,
  };
}

export function useLiveOpsEngine() {
  const pushEvent = useOperationsStore((state) => state.pushEvent);
  const applySimulationTick = useOperationsStore(
    (state) => state.applySimulationTick,
  );
  const setKpis = useOperationsStore((state) => state.setKpis);
  const setInsights = useOperationsStore((state) => state.setInsights);
  const pushInsight = useOperationsStore((state) => state.pushInsight);
  const setRealtimeConnected = useOperationsStore(
    (state) => state.setRealtimeConnected,
  );
  const setTelemetrySource = useOperationsStore(
    (state) => state.setTelemetrySource,
  );

  useEffect(() => {
    if (supabaseState.ready && supabase) {
      setTelemetrySource('supabase');
      return undefined;
    }

    const simulationTimer = setInterval(() => {
      applySimulationTick();
    }, 3200);

    return () => clearInterval(simulationTimer);
  }, [applySimulationTick, setTelemetrySource]);

  useEffect(() => {
    let cancelled = false;

    async function hydrateIntelligence() {
      const result = await fetchRecentIntelligence(6);
      if (cancelled) {
        return;
      }

      if (result.rows?.length) {
        setInsights(
          result.rows.map(
            (row) => row.headline || row.advisory || 'Signal detected.',
          ),
        );
      }
    }

    hydrateIntelligence();

    return () => {
      cancelled = true;
    };
  }, [setInsights]);

  useEffect(() => {
    if (!supabaseState.ready || !supabase) {
      setRealtimeConnected(false);
      return undefined;
    }

    let mounted = true;

    const refreshKpis = async () => {
      const snapshot = await fetchKpiSnapshot();
      if (mounted && snapshot) {
        setKpis(snapshot);
      }
    };

    refreshKpis();
    const poller = setInterval(refreshKpis, 15000);

    const channel = supabase
      .channel('vanguardtrace-live-ops')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'operations_events',
        },
        (payload) => {
          const row = payload.new || {};
          pushEvent({
            id: row.id,
            type: row.event_type || 'operations_event',
            severity: row.severity || 'medium',
            message: row.title || 'Operations event received.',
            at: row.created_at,
          });
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'intel_signals',
        },
        (payload) => {
          const row = payload.new || {};
          pushInsight(row.headline || row.advisory || 'AI signal received.');
        },
      )
      .subscribe((status) => {
        setRealtimeConnected(status === 'SUBSCRIBED');
      });

    return () => {
      mounted = false;
      clearInterval(poller);
      setRealtimeConnected(false);
      supabase.removeChannel(channel);
    };
  }, [pushEvent, pushInsight, setKpis, setRealtimeConnected]);
}
