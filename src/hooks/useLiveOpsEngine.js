import { useEffect } from 'react';
import { supabase, supabaseState } from '../lib/supabase.js';
import { useOperationsStore } from '../store/operationsStore.js';

export function useLiveOpsEngine() {
  const pushEvent = useOperationsStore((state) => state.pushEvent);
  const applySimulationTick = useOperationsStore(
    (state) => state.applySimulationTick,
  );

  useEffect(() => {
    const simulationTimer = setInterval(() => {
      applySimulationTick();
    }, 3200);

    return () => clearInterval(simulationTimer);
  }, [applySimulationTick]);

  useEffect(() => {
    if (!supabaseState.ready || !supabase) {
      return undefined;
    }

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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pushEvent]);
}
