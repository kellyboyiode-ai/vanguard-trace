import heroPortImage from '../assets/timelab-sWOvgOOFk1g-unsplash.jpg';

export const allPremiumMedia = [
  {
    id: 'vt-night-port',
    src: heroPortImage,
    alt: 'Nighttime container port operations with stacked freight and active crane lanes',
  },
  {
    id: 'vt-global-map',
    src: '/media/global-map.svg',
    alt: 'Global route intelligence map for Vanguard Trace operations',
  },
  {
    id: 'vt-satellite-network',
    src: '/media/satellite-network.svg',
    alt: 'Satellite telemetry network for Vanguard Trace shipment visibility',
  },
  {
    id: 'vt-analytics-stream',
    src: '/media/analytics-stream.svg',
    alt: 'Operational analytics stream in the Vanguard Trace command center',
  },
  {
    id: 'vt-port-operations',
    src: '/media/port-operations.svg',
    alt: 'Port operations interface for Vanguard Trace logistics monitoring',
  },
  {
    id: 'vt-air-cargo',
    src: '/media/air-cargo.svg',
    alt: 'Air cargo network view for Vanguard Trace corridor management',
  },
  {
    id: 'vt-warehouse-grid',
    src: '/media/warehouse-grid.svg',
    alt: 'Warehouse grid telemetry for Vanguard Trace fulfillment operations',
  },
  {
    id: 'vt-truck-fleet',
    src: '/media/truck-fleet.svg',
    alt: 'Truck fleet corridor visualization for Vanguard Trace dispatch operations',
  },
  {
    id: 'vt-cyber-grid',
    src: '/media/cyber-grid.svg',
    alt: 'Cyber grid security layer for Vanguard Trace monitoring systems',
  },
].sort((left, right) => left.id.localeCompare(right.id));

const mediaIndex = new Map(allPremiumMedia.map((asset) => [asset.id, asset]));

function pickMedia(...ids) {
  return ids.map((id) => mediaIndex.get(id)).filter(Boolean);
}

export const homeTransmissionMedia = pickMedia(
  'vt-night-port',
  'vt-global-map',
  'vt-satellite-network',
  'vt-analytics-stream',
  'vt-port-operations',
  'vt-air-cargo',
  'vt-warehouse-grid',
  'vt-truck-fleet',
  'vt-cyber-grid',
);

export const PAGE_KEYS = [
  'home',
  'overview',
  'about',
  'contact',
  'intel',
  'operations',
  'services',
  'tracking',
  'traces',
  'settings',
  'login',
  'signup',
  'pending-approval',
  'admin-approvals',
  'not-found',
];

export const pageDistributionOrder = [...PAGE_KEYS];

const pageMediaBuckets = {
  home: pickMedia('vt-night-port', 'vt-global-map', 'vt-analytics-stream'),
  overview: pickMedia('vt-global-map', 'vt-analytics-stream', 'vt-cyber-grid'),
  about: pickMedia('vt-night-port', 'vt-warehouse-grid'),
  contact: pickMedia('vt-global-map', 'vt-satellite-network'),
  intel: pickMedia(
    'vt-analytics-stream',
    'vt-cyber-grid',
    'vt-satellite-network',
  ),
  operations: pickMedia(
    'vt-truck-fleet',
    'vt-warehouse-grid',
    'vt-port-operations',
  ),
  services: pickMedia('vt-air-cargo', 'vt-port-operations', 'vt-cyber-grid'),
  tracking: pickMedia('vt-global-map', 'vt-truck-fleet', 'vt-night-port'),
  traces: pickMedia(
    'vt-satellite-network',
    'vt-analytics-stream',
    'vt-port-operations',
  ),
  settings: pickMedia('vt-cyber-grid', 'vt-analytics-stream'),
  login: pickMedia('vt-cyber-grid'),
  signup: pickMedia('vt-satellite-network'),
  'pending-approval': pickMedia('vt-warehouse-grid'),
  'admin-approvals': pickMedia('vt-cyber-grid', 'vt-night-port'),
  'not-found': pickMedia('vt-global-map'),
};

export function getPageMedia(pageKey) {
  return pageMediaBuckets[pageKey] || [];
}

export function getMediaCoverageSummary() {
  const perPageCounts = PAGE_KEYS.map((pageKey) => ({
    pageKey,
    count: getPageMedia(pageKey).length,
    weight: getPageMedia(pageKey).length || 1,
  }));

  const assignedCount = perPageCounts.reduce(
    (total, page) => total + page.count,
    0,
  );

  return {
    total: allPremiumMedia.length,
    transmissionCount: homeTransmissionMedia.length,
    assignedCount,
    unassignedCount: 0,
    pageDistributionOrder,
    perPageCounts,
  };
}
