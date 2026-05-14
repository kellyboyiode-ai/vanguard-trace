export const cinematicRouteMedia = {
  '/': [
    {
      id: 'overview-map',
      asset: '/media/global-map.svg',
      tone: 'scene-globe',
      headline: 'Global route matrix synchronized',
    },
    {
      id: 'overview-sat',
      asset: '/media/satellite-network.svg',
      tone: 'scene-satellite',
      headline: 'Satellite telemetry handshake active',
    },
    {
      id: 'overview-analytics',
      asset: '/media/analytics-stream.svg',
      tone: 'scene-dataflow',
      headline: 'Operational data stream updating',
    },
  ],
  '/home': [
    {
      id: 'home-port',
      asset: '/media/port-operations.svg',
      tone: 'scene-port',
      headline: 'Port throughput and berth intelligence',
    },
    {
      id: 'home-air',
      asset: '/media/air-cargo.svg',
      tone: 'scene-air',
      headline: 'Air cargo lane orchestration online',
    },
    {
      id: 'home-warehouse',
      asset: '/media/warehouse-grid.svg',
      tone: 'scene-warehouse',
      headline: 'Warehouse grid and scanning live',
    },
  ],
  '/tracking': [
    {
      id: 'tracking-map',
      asset: '/media/global-map.svg',
      tone: 'scene-corridor',
      headline: 'Route progression stream acquired',
    },
    {
      id: 'tracking-fleet',
      asset: '/media/truck-fleet.svg',
      tone: 'scene-truck',
      headline: 'Ground corridor deviations monitored',
    },
    {
      id: 'tracking-radar',
      asset: '/media/cyber-grid.svg',
      tone: 'scene-radar',
      headline: 'Radar lock on shipment trajectory',
    },
  ],
  '/operations': [
    {
      id: 'ops-fleet',
      asset: '/media/truck-fleet.svg',
      tone: 'scene-truck',
      headline: 'Fleet dispatch board in motion',
    },
    {
      id: 'ops-warehouse',
      asset: '/media/warehouse-grid.svg',
      tone: 'scene-terminal',
      headline: 'Terminal workflow with handoff events',
    },
    {
      id: 'ops-map',
      asset: '/media/global-map.svg',
      tone: 'scene-globe',
      headline: 'Multi-modal route balancing active',
    },
  ],
  '/services': [
    {
      id: 'services-cyber',
      asset: '/media/cyber-grid.svg',
      tone: 'scene-cyber',
      headline: 'Security perimeter and service mesh',
    },
    {
      id: 'services-air',
      asset: '/media/air-cargo.svg',
      tone: 'scene-satellite',
      headline: 'Aviation corridor service coverage',
    },
  ],
  '/intel': [
    {
      id: 'intel-stream',
      asset: '/media/analytics-stream.svg',
      tone: 'scene-dataflow',
      headline: 'Forecast engine signal propagation',
    },
    {
      id: 'intel-grid',
      asset: '/media/cyber-grid.svg',
      tone: 'scene-grid',
      headline: 'Anomaly detection lattice active',
    },
  ],
  '/traces': [
    {
      id: 'traces-sat',
      asset: '/media/satellite-network.svg',
      tone: 'scene-orbit',
      headline: 'Trace chain orbital relay online',
    },
    {
      id: 'traces-port',
      asset: '/media/port-operations.svg',
      tone: 'scene-port',
      headline: 'Container trace graph compiling',
    },
  ],
  '/settings': [
    {
      id: 'settings-cyber',
      asset: '/media/cyber-grid.svg',
      tone: 'scene-cyber',
      headline: 'Security controls and policy locks',
    },
  ],
};

export const cinematicFallbackMedia = [
  {
    id: 'fallback-globe',
    asset: '/media/global-map.svg',
    tone: 'scene-globe',
    headline: 'Operational backdrop standby',
  },
  {
    id: 'fallback-stream',
    asset: '/media/analytics-stream.svg',
    tone: 'scene-dataflow',
    headline: 'Telemetry stream synchronization',
  },
];
