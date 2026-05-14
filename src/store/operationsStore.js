import { create } from 'zustand';

const defaultKpis = {
  activeShipments: 1284,
  delayedShipments: 7,
  fleetOnline: 93,
  riskIndex: 22,
};

const initialEvents = [
  {
    id: 'evt-ops-001',
    type: 'customs_cleared',
    severity: 'low',
    message: 'Customs cleared: VT-203 at Rotterdam gateway.',
    at: new Date().toISOString(),
  },
  {
    id: 'evt-ops-002',
    type: 'delay_detected',
    severity: 'medium',
    message: 'Delay detected: Lagos berth congestion affects VT-774.',
    at: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  },
  {
    id: 'evt-ops-003',
    type: 'route_deviation',
    severity: 'high',
    message: 'Route deviation: Fleet unit NG-44 entered alternate lane.',
    at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export const useOperationsStore = create((set, get) => ({
  commandPaletteOpen: false,
  aiPanelOpen: false,
  realtimeConnected: false,
  telemetrySource: 'simulation',
  kpis: defaultKpis,
  events: initialEvents,
  insights: [
    'Shipment VT-203 may delay due to Lagos port congestion.',
    'Fuel burn is trending 4.1% above baseline on westbound fleet.',
    'North Atlantic lane reliability improved by 2.4% over last cycle.',
  ],
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: Boolean(open) }),
  toggleCommandPalette: () =>
    set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
  setAiPanelOpen: (open) => set({ aiPanelOpen: Boolean(open) }),
  toggleAiPanel: () => set((state) => ({ aiPanelOpen: !state.aiPanelOpen })),
  setRealtimeConnected: (connected) =>
    set({ realtimeConnected: Boolean(connected) }),
  setTelemetrySource: (source) =>
    set({ telemetrySource: source || 'simulation' }),
  setInsights: (lines) =>
    set({
      insights:
        Array.isArray(lines) && lines.length
          ? lines.slice(0, 6)
          : ['No AI insights available at the moment.'],
    }),
  pushInsight: (line) =>
    set((state) => ({
      insights: [line, ...state.insights.filter((item) => item !== line)].slice(
        0,
        6,
      ),
    })),
  pushEvent: (event) =>
    set((state) => ({
      events: [
        {
          id: event.id || `evt-${Date.now()}`,
          type: event.type || 'status',
          severity: event.severity || 'low',
          message: event.message || 'Operational event received.',
          at: event.at || new Date().toISOString(),
        },
        ...state.events,
      ].slice(0, 16),
    })),
  setKpis: (nextKpis) =>
    set((state) => ({
      kpis: {
        ...state.kpis,
        ...nextKpis,
      },
    })),
  applySimulationTick: () => {
    const { kpis } = get();

    set({
      kpis: {
        activeShipments: clamp(
          kpis.activeShipments + Math.round((Math.random() - 0.45) * 10),
          920,
          1650,
        ),
        delayedShipments: clamp(
          kpis.delayedShipments + Math.round((Math.random() - 0.52) * 2),
          2,
          24,
        ),
        fleetOnline: clamp(
          kpis.fleetOnline + Math.round((Math.random() - 0.5) * 2),
          82,
          99,
        ),
        riskIndex: clamp(
          kpis.riskIndex + Math.round((Math.random() - 0.48) * 3),
          8,
          48,
        ),
      },
    });
  },
}));
