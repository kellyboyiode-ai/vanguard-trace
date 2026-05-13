const LEGACY_API_BASE = 'https://www.vanguardlogistics.com';

function normalizeLocationItem(item) {
  if (!item) {
    return null;
  }

  if (typeof item === 'string') {
    return {
      code: item,
      label: item,
      value: item,
    };
  }

  const code = String(item.code || item.portCode || item.value || '').trim();
  const city = String(item.city || item.location || item.name || '').trim();
  const country = String(item.country || item.countryCode || '').trim();
  const label =
    String(item.label || '').trim() ||
    [city, country].filter(Boolean).join(', ') ||
    code;

  if (!label) {
    return null;
  }

  return {
    code: code || label,
    label,
    value: String(item.value || label).trim(),
  };
}

async function fetchSailingEndpoint(endpoint, params) {
  const baseUrl =
    String(import.meta.env.VITE_LEGACY_API_BASE || '').trim() ||
    LEGACY_API_BASE;
  const url = new URL(endpoint, baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim()) {
      url.searchParams.set(key, String(value).trim());
    }
  });

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    credentials: 'omit',
  });

  if (!response.ok) {
    throw new Error(`Sailing API failed (${response.status}).`);
  }

  const payload = await response.json();
  const rawItems = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.results)
      ? payload.results
      : Array.isArray(payload?.items)
        ? payload.items
        : [];

  return rawItems.map(normalizeLocationItem).filter(Boolean);
}

export async function fetchSailingOrigins(searchTerm) {
  return fetchSailingEndpoint('/api/sailings/origin', {
    origin: searchTerm,
  });
}

export async function fetchSailingDestinations(searchTerm, originCode) {
  return fetchSailingEndpoint('/api/sailings/destination', {
    destination: searchTerm,
    origin: originCode,
  });
}
