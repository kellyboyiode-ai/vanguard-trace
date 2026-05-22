const premiumMediaModules = import.meta.glob(
  '../assets/premium_photo_1677535563096_116abf37d186/*.{jpg,jpeg,webp,avif}',
  {
    eager: true,
    import: 'default',
  },
);

function toAltText() {
  return 'Vanguard Trace logistics media';
}

export const allPremiumMedia = Object.entries(premiumMediaModules)
  .map(([path, src]) => {
    const fileName = path.split('/').pop() || path;
    const id = fileName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    return {
      id,
      src,
      alt: toAltText(),
    };
  })
  .sort((left, right) => left.id.localeCompare(right.id));

const HOME_TRANSMISSION_COUNT = 12;

const HOME_TRANSMISSION_PHASES = [
  0.02, 0.1, 0.18, 0.27, 0.35, 0.43, 0.52, 0.61, 0.7, 0.79, 0.88, 0.97,
];

function buildCuratedTransmissionSet(media, count) {
  if (media.length <= count) {
    return media;
  }

  const selectedIndexes = new Set(
    HOME_TRANSMISSION_PHASES.map((phase) =>
      Math.min(media.length - 1, Math.floor((media.length - 1) * phase)),
    ),
  );

  const curated = [];

  for (const index of selectedIndexes) {
    if (curated.length >= count) {
      break;
    }
    curated.push(media[index]);
  }

  if (curated.length < count) {
    for (const asset of media) {
      if (curated.length >= count) {
        break;
      }
      if (!curated.some((entry) => entry.id === asset.id)) {
        curated.push(asset);
      }
    }
  }

  return curated;
}

export const homeTransmissionMedia = buildCuratedTransmissionSet(
  allPremiumMedia,
  HOME_TRANSMISSION_COUNT,
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

const PAGE_DISTRIBUTION_WEIGHTS = {
  home: 3,
  overview: 2,
  about: 1,
  contact: 1,
  intel: 2,
  operations: 2,
  services: 2,
  tracking: 2,
  traces: 2,
  settings: 1,
  login: 1,
  signup: 1,
  'pending-approval': 1,
  'admin-approvals': 1,
  'not-found': 1,
};

export const pageDistributionOrder = PAGE_KEYS.flatMap((pageKey) =>
  Array.from(
    { length: PAGE_DISTRIBUTION_WEIGHTS[pageKey] || 1 },
    () => pageKey,
  ),
);

const homeTransmissionIds = new Set(
  homeTransmissionMedia.map((asset) => asset.id),
);

const remainingMedia = allPremiumMedia.filter(
  (asset) => !homeTransmissionIds.has(asset.id),
);

const pageMediaBuckets = PAGE_KEYS.reduce((acc, pageKey) => {
  acc[pageKey] = [];
  return acc;
}, {});

remainingMedia.forEach((asset, index) => {
  const pageKey =
    pageDistributionOrder[index % pageDistributionOrder.length] ||
    PAGE_KEYS[index % PAGE_KEYS.length];
  pageMediaBuckets[pageKey].push(asset);
});

export function getPageMedia(pageKey) {
  return pageMediaBuckets[pageKey] || [];
}

export function getMediaCoverageSummary() {
  const perPageCounts = PAGE_KEYS.map((pageKey) => ({
    pageKey,
    count: getPageMedia(pageKey).length,
    weight: PAGE_DISTRIBUTION_WEIGHTS[pageKey] || 1,
  }));

  const assignedCount = perPageCounts.reduce(
    (total, page) => total + page.count,
    0,
  );

  return {
    total: allPremiumMedia.length,
    transmissionCount: homeTransmissionMedia.length,
    assignedCount,
    unassignedCount:
      allPremiumMedia.length - homeTransmissionMedia.length - assignedCount,
    pageDistributionOrder,
    perPageCounts,
  };
}
