import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  Globe,
  MapPin,
  Package,
  Pause,
  Play,
  Radar,
  Search,
  ShieldAlert,
  Truck,
} from 'lucide-react';
import { VanguardHeroScene } from '../components/index.js';
import {
  HOME_LOCATION_LOOKUP_BASE_URL,
  HOME_LOCATION_QUICK_LINK,
  HOME_MANAGE_SHIPMENT_LINKS,
  HOME_PROMO_IFRAME_URL,
  HOME_QUICK_TRACK_BASE_URL,
  HOME_SAILING_SCHEDULE_BASE_URL,
  HOME_TOOLBOX_TABS,
  HOME_TOP_TOOLS,
} from '../constants/externalLinks.js';
import { countryOptions } from '../constants/countryOptions.js';
import { vanguardTraceHero } from '../data/index.js';
import { ShellLayout } from '../layouts/index.js';
import { submitQuoteRequest } from '../services/quoteService.js';
import {
  fetchSailingDestinations,
  fetchSailingOrigins,
} from '../services/sailingsService.js';
import '../styles/homeLayout.css';
import '../styles/vanguardTraceHero.css';
// Minimal, vanishing, agency-grade Section 4/5 metrics
const sectionIntelMetrics = [
  { label: 'Active shipments', value: '1,284' },
  { label: 'At-risk lanes', value: '07' },
  { label: 'Integrity score', value: '98.4%' },
  { label: 'Live alerts', value: '12' },
];

const agencyIntelAlert = {
  message: 'Risk channel elevated on North Atlantic lane.',
  update: 'Last update: 40 seconds ago.',
};

// Animation presets (inline for minimal import)
const nodeFloat = {
  initial: { y: 0, opacity: 0.85 },
  animate: {
    y: [-1, 1, -1],
    opacity: [0.78, 0.92, 0.78],
    transition: {
      duration: 5,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};
const radarSpin = {
  animate: {
    rotate: 360,
    transition: {
      duration: 18,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};
const panelReveal = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: 'easeOut',
    },
  },
};

const topTools = HOME_TOP_TOOLS;
const manageShipmentLinks = HOME_MANAGE_SHIPMENT_LINKS;
const locationQuickLink = HOME_LOCATION_QUICK_LINK;
const toolboxTabs = HOME_TOOLBOX_TABS;

const serviceModules = [
  {
    name: 'Secure Tracking',
    description: 'Clear shipment visibility from origin through delivery.',
    Icon: Truck,
  },
  {
    name: 'Cargo Integrity',
    description: 'Package condition updates and documented handoff history.',
    Icon: Package,
  },
  {
    name: 'Route Intelligence',
    description: 'Route updates with weather and transit delay context.',
    Icon: Globe,
  },
  {
    name: 'Status Monitoring',
    description: 'Simple status checks for exceptions and delivery changes.',
    Icon: Radar,
  },
];

const regions = [
  'Africa',
  'Asia',
  'Europe',
  'Indian Subcontinent',
  'Latin America',
  'Middle East',
  'South Pacific',
  'USA & Canada',
];

const locationSuggestions = [
  'Los Angeles, US',
  'Long Beach, US',
  'New York, US',
  'Rotterdam, NL',
  'Hamburg, DE',
  'Dubai, AE',
  'Singapore, SG',
  'Hong Kong, HK',
];

const promoIframeUrl = import.meta.env.VITE_PROMO_IFRAME_URL || HOME_PROMO_IFRAME_URL;

const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

function findSailingOption(rawValue, options) {
  const value = String(rawValue || '')
    .trim()
    .toLowerCase();

  if (!value || !Array.isArray(options) || options.length === 0) {
    return null;
  }

  const exact = options.find((item) => item.label.toLowerCase() === value);
  if (exact) {
    return exact;
  }

  const prefix = options.find((item) =>
    item.label.toLowerCase().startsWith(value),
  );
  if (prefix) {
    return prefix;
  }

  return options[0] || null;
}

export default function Home() {
  const [cookieAccepted, setCookieAccepted] = useState(() => {
    const stored = localStorage.getItem('vt-cookie-ok');
    return stored === 'true';
  });
  const [cookiePreferencesOpen, setCookiePreferencesOpen] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState(() => {
    const stored = localStorage.getItem('vt-cookie-preferences');
    if (!stored) {
      return { necessary: true, analytics: false, marketing: false };
    }

    try {
      const parsed = JSON.parse(stored);
      return {
        necessary: true,
        analytics: Boolean(parsed.analytics),
        marketing: Boolean(parsed.marketing),
      };
    } catch {
      return { necessary: true, analytics: false, marketing: false };
    }
  });
  const [heroPlaying, setHeroPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState('quotation');
  const [activeTool, setActiveTool] = useState('Vanguard ADESSO');
  const [quickTrack, setQuickTrack] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originCode, setOriginCode] = useState('');
  const [destinationCode, setDestinationCode] = useState('');
  const [originOptions, setOriginOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [sailingLookupError, setSailingLookupError] = useState('');
  const originLookupTimer = useRef(null);
  const destinationLookupTimer = useRef(null);
  const [departureDate, setDepartureDate] = useState('');
  const [departureAnchor] = useState(() => Date.now());
  const [region, setRegion] = useState(regions[0]);
  const [promoEmail, setPromoEmail] = useState('');
  const [openModal, setOpenModal] = useState(null);
  const [openToolbarCard, setOpenToolbarCard] = useState('quote-book');
  const [quoteCaptchaToken, setQuoteCaptchaToken] = useState('');

  const activeTabData = useMemo(
    () => toolboxTabs.find((tab) => tab.id === activeTab) ?? toolboxTabs[0],
    [activeTab],
  );

  const activeToolData = useMemo(() => {
    return (
      activeTabData.tools.find((tool) => tool.name === activeTool) ??
      activeTabData.tools[0]
    );
  }, [activeTabData, activeTool]);

  const departureWarning = useMemo(() => {
    if (!departureDate) {
      return '';
    }

    const departure = new Date(`${departureDate}T00:00:00`);
    if (Number.isNaN(departure.getTime())) {
      return '';
    }

    const hoursUntilDeparture =
      (departure.getTime() - departureAnchor) / (1000 * 60 * 60);

    if (hoursUntilDeparture < 0) {
      return 'Selected departure date is in the past.';
    }

    if (hoursUntilDeparture < 72) {
      return 'Heads-up: departures within 72 hours may have limited schedule options.';
    }

    return '';
  }, [departureAnchor, departureDate]);

  const minDepartureDate = useMemo(
    () => new Date().toISOString().slice(0, 10),
    [],
  );

  const fallbackSailingOptions = useMemo(
    () =>
      locationSuggestions.map((item) => ({
        code: item,
        label: item,
        value: item,
      })),
    [],
  );

  const selectedOriginLabel = useMemo(() => {
    const source = originOptions.length
      ? originOptions
      : fallbackSailingOptions;

    return (
      source.find(
        (item) => item.label.toLowerCase() === origin.trim().toLowerCase(),
      )?.label || ''
    );
  }, [fallbackSailingOptions, origin, originOptions]);

  const selectedDestinationLabel = useMemo(() => {
    const source = destinationOptions.length
      ? destinationOptions
      : fallbackSailingOptions;

    return (
      source.find(
        (item) => item.label.toLowerCase() === destination.trim().toLowerCase(),
      )?.label || ''
    );
  }, [destination, destinationOptions, fallbackSailingOptions]);

  function handleAcceptCookies() {
    const acceptedPrefs = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem(
      'vt-cookie-preferences',
      JSON.stringify(acceptedPrefs),
    );
    localStorage.setItem('vt-cookie-ok', 'true');
    setCookiePreferences(acceptedPrefs);
    setCookieAccepted(true);
  }

  function handleRejectNonEssentialCookies() {
    const rejectedPrefs = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    localStorage.setItem(
      'vt-cookie-preferences',
      JSON.stringify(rejectedPrefs),
    );
    localStorage.setItem('vt-cookie-ok', 'true');
    setCookiePreferences(rejectedPrefs);
    setCookieAccepted(true);
  }

  function handleSaveCookiePreferences() {
    localStorage.setItem(
      'vt-cookie-preferences',
      JSON.stringify(cookiePreferences),
    );
    localStorage.setItem('vt-cookie-ok', 'true');
    setCookieAccepted(true);
    setCookiePreferencesOpen(false);
  }

  function handleServiceSearch(event) {
    event.preventDefault();

    if (!originCode || !destinationCode || !departureDate) {
      toast.error(
        'Select a valid origin, destination, and departure date to search sailing routes.',
      );
      return;
    }

    if (departureDate < minDepartureDate) {
      toast.error('Departure date must be today or later.');
      return;
    }

    const target = new URL(HOME_SAILING_SCHEDULE_BASE_URL);
    target.searchParams.set('origin', originCode);
    target.searchParams.set('destination', destinationCode);
    target.searchParams.set('departureDate', departureDate);
    window.open(target.toString(), '_blank', 'noopener,noreferrer');

    toast.success(
      `Searching route: ${originCode.toUpperCase()} -> ${destinationCode.toUpperCase()} on ${departureDate}`,
    );
  }

  function handleQuickTrack(event) {
    event.preventDefault();
    if (!quickTrack.trim()) {
      toast.error('Enter a booking number to continue.');
      return;
    }

    const target = `${HOME_QUICK_TRACK_BASE_URL}${encodeURIComponent(
      quickTrack.trim(),
    )}`;

    window.open(target, '_blank', 'noopener,noreferrer');
  }

  function handleRegionLookup(event) {
    event.preventDefault();
    const target = `${HOME_LOCATION_LOOKUP_BASE_URL}${encodeURIComponent(
      region,
    )}`;
    window.open(target, '_blank', 'noopener,noreferrer');
  }

  function handlePromoSubmit(event) {
    event.preventDefault();
    if (!promoEmail.trim()) {
      toast.error('Enter an email to join updates.');
      return;
    }

    setOpenModal('promo');
  }

  async function handleQuoteSubmit(event, quoteType) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await submitQuoteRequest({
      quoteType,
      origin: form.get('origin'),
      destination: form.get('destination'),
      targetDate: form.get('targetDate'),
      name: form.get('name'),
      city: form.get('city'),
      country: form.get('country'),
      email: form.get('email'),
      phone: form.get('phone'),
      company: form.get('company'),
      commodity: form.get('commodity'),
      incoterm: form.get('incoterm'),
      notes: form.get('notes'),
      termsAccepted: form.get('termsAccepted') === 'on',
      recaptchaEnabled: Boolean(recaptchaSiteKey),
      captchaToken: quoteCaptchaToken,
      captchaAccepted: form.get('captchaAccepted') === 'on',
    });

    if (!result.accepted) {
      toast.error(result.error || 'Quote request failed. Please retry.');
      return;
    }

    toast.success(
      `${quoteType} quote request submitted (${result.source === 'supabase' ? 'live' : 'local'} mode).`,
    );
    event.currentTarget.reset();
    setQuoteCaptchaToken('');
    setOpenModal(null);
  }

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setOpenModal(null);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (originLookupTimer.current) {
      clearTimeout(originLookupTimer.current);
    }

    if (origin.trim().length < 2) {
      return;
    }

    originLookupTimer.current = setTimeout(async () => {
      try {
        const items = await fetchSailingOrigins(origin);
        setOriginOptions(items);
        setSailingLookupError('');
      } catch {
        setOriginOptions(
          locationSuggestions.map((item) => ({
            code: item,
            label: item,
            value: item,
          })),
        );
        setSailingLookupError(
          'Live origin lookup unavailable. Showing fallback suggestions.',
        );
      }
    }, 280);

    return () => {
      if (originLookupTimer.current) {
        clearTimeout(originLookupTimer.current);
      }
    };
  }, [origin]);

  useEffect(() => {
    if (destinationLookupTimer.current) {
      clearTimeout(destinationLookupTimer.current);
    }

    if (!originCode || destination.trim().length < 2) {
      return;
    }

    destinationLookupTimer.current = setTimeout(async () => {
      try {
        const items = await fetchSailingDestinations(destination, originCode);
        setDestinationOptions(items);
        setSailingLookupError('');
      } catch {
        setDestinationOptions(
          locationSuggestions.map((item) => ({
            code: item,
            label: item,
            value: item,
          })),
        );
        setSailingLookupError(
          'Live destination lookup unavailable. Showing fallback suggestions.',
        );
      }
    }, 280);

    return () => {
      if (destinationLookupTimer.current) {
        clearTimeout(destinationLookupTimer.current);
      }
    };
  }, [destination, originCode]);

  return (
    <ShellLayout
      eyebrow={vanguardTraceHero.eyebrow}
      title={vanguardTraceHero.title}
      description={vanguardTraceHero.subtitle}
    >
      {!cookieAccepted && (
        <section
          className="home-cookie-banner"
          role="dialog"
          aria-label="Cookie Notice"
        >
          <div>
            <h3>This Website Uses Cookies</h3>
            <p>
              We use cookies to enhance your experience and analyze site usage.
            </p>
          </div>
          <div className="home-cookie-actions">
            <button type="button" onClick={handleAcceptCookies}>
              Got It
            </button>
            <button type="button" onClick={handleRejectNonEssentialCookies}>
              Reject Optional
            </button>
            <button
              type="button"
              onClick={() => setCookiePreferencesOpen(true)}
            >
              Manage Preferences
            </button>
          </div>
        </section>
      )}

      <a href="#home-main-content" className="home-skip-link">
        Skip Navigation
      </a>

      <div id="home-main-content" className="home-layout">
        <section className="home-hero" aria-label="Vanguard hero">
          <div className="home-hero-media" data-paused={!heroPlaying}>
            <VanguardHeroScene />
            <div className="home-hero-overlay" />
            <button
              type="button"
              className="home-hero-toggle"
              onClick={() => setHeroPlaying((state) => !state)}
              aria-label="Play or pause hero animation"
            >
              {heroPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
          </div>
        </section>

        <section className="home-toolbar" aria-label="Shipping tools">
          <article
            className={
              openToolbarCard === 'quote-book'
                ? 'home-toolbar-card home-toolbar-card-open'
                : 'home-toolbar-card'
            }
          >
            <button
              type="button"
              className="home-toolbar-heading"
              onClick={() =>
                setOpenToolbarCard((current) =>
                  current === 'quote-book' ? '' : 'quote-book',
                )
              }
              aria-expanded={openToolbarCard === 'quote-book'}
            >
              <h3>Quote and Book</h3>
            </button>
            <div className="home-toolbar-grid">
              {topTools.map((tool) => (
                <a
                  key={tool.title}
                  href={tool.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <strong>{tool.title}</strong>
                  <span>{tool.description}</span>
                </a>
              ))}
              <button type="button" onClick={() => setOpenModal('air')}>
                <strong>AIR</strong>
                <span>Open airfreight quote request form.</span>
              </button>
              <button type="button" onClick={() => setOpenModal('fcl')}>
                <strong>FCL Form</strong>
                <span>Open full-container quote request form.</span>
              </button>
            </div>
          </article>

          <article
            className={
              openToolbarCard === 'find-service'
                ? 'home-toolbar-card home-toolbar-card-open'
                : 'home-toolbar-card'
            }
          >
            <button
              type="button"
              className="home-toolbar-heading"
              onClick={() =>
                setOpenToolbarCard((current) =>
                  current === 'find-service' ? '' : 'find-service',
                )
              }
              aria-expanded={openToolbarCard === 'find-service'}
            >
              <h3>Find a Service</h3>
            </button>
            <form className="home-inline-form" onSubmit={handleServiceSearch}>
              <input
                type="text"
                placeholder="Origin"
                value={origin}
                id="home-origin-input"
                onChange={(event) => {
                  const nextOrigin = event.target.value;
                  setOrigin(nextOrigin);
                  setOriginCode('');
                  setDestination('');
                  setDestinationCode('');
                  setDestinationOptions([]);
                  setSailingLookupError('');

                  if (nextOrigin.trim().length < 2) {
                    setOriginOptions([]);
                  }
                }}
                onBlur={() => {
                  const originSource = originOptions.length
                    ? originOptions
                    : fallbackSailingOptions;
                  const matchedOrigin = findSailingOption(origin, originSource);

                  if (!matchedOrigin) {
                    return;
                  }

                  setOrigin(matchedOrigin.label);
                  setOriginCode(matchedOrigin.code || matchedOrigin.value);
                  setDestination('');
                  setDestinationCode('');
                  setDestinationOptions([]);
                }}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== 'Tab') {
                    return;
                  }

                  const originSource = originOptions.length
                    ? originOptions
                    : fallbackSailingOptions;
                  const matchedOrigin = findSailingOption(origin, originSource);

                  if (!matchedOrigin) {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                    }
                    toast.error(
                      'Select an origin from the available suggestions.',
                    );
                    return;
                  }

                  setOrigin(matchedOrigin.label);
                  setOriginCode(matchedOrigin.code || matchedOrigin.value);
                  setDestination('');
                  setDestinationCode('');
                  setDestinationOptions([]);

                  if (event.key === 'Enter') {
                    event.preventDefault();
                    const destinationInput = document.getElementById(
                      'home-destination-input',
                    );
                    destinationInput?.focus();
                  }
                }}
                aria-label="Service origin"
                list="home-origin-options"
              />
              <datalist id="home-origin-options">
                {originOptions.map((item) => (
                  <option key={`origin-${item.code}`} value={item.label} />
                ))}
              </datalist>
              <input
                type="text"
                placeholder="Destination"
                value={destination}
                id="home-destination-input"
                onChange={(event) => {
                  const nextDestination = event.target.value;
                  setDestination(nextDestination);
                  setDestinationCode('');

                  if (nextDestination.trim().length < 2) {
                    setDestinationOptions([]);
                  }
                }}
                onBlur={() => {
                  const destinationSource = destinationOptions.length
                    ? destinationOptions
                    : fallbackSailingOptions;
                  const matchedDestination = findSailingOption(
                    destination,
                    destinationSource,
                  );

                  if (!matchedDestination) {
                    return;
                  }

                  setDestination(matchedDestination.label);
                  setDestinationCode(
                    matchedDestination.code || matchedDestination.value,
                  );
                }}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== 'Tab') {
                    return;
                  }

                  const destinationSource = destinationOptions.length
                    ? destinationOptions
                    : fallbackSailingOptions;
                  const matchedDestination = findSailingOption(
                    destination,
                    destinationSource,
                  );

                  if (!matchedDestination) {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                    }
                    toast.error(
                      'Select a destination from the available suggestions.',
                    );
                    return;
                  }

                  setDestination(matchedDestination.label);
                  setDestinationCode(
                    matchedDestination.code || matchedDestination.value,
                  );
                }}
                aria-label="Service destination"
                list="home-destination-options"
                disabled={!originCode}
              />
              <datalist id="home-destination-options">
                {destinationOptions.map((item) => (
                  <option key={`destination-${item.code}`} value={item.label} />
                ))}
              </datalist>
              <input
                type="date"
                value={departureDate}
                onChange={(event) => setDepartureDate(event.target.value)}
                aria-label="Departure date"
                min={minDepartureDate}
              />
              <button type="submit">
                <Search size={16} />
              </button>
            </form>
            {sailingLookupError && (
              <p className="home-inline-warning" role="status">
                {sailingLookupError}
              </p>
            )}
            {origin.trim() && !selectedOriginLabel && (
              <p className="home-inline-warning" role="status">
                Choose an origin from the suggestion list.
              </p>
            )}
            {originCode && destination.trim() && !selectedDestinationLabel && (
              <p className="home-inline-warning" role="status">
                Choose a destination from the suggestion list.
              </p>
            )}
            {departureWarning && (
              <p className="home-inline-warning" role="status">
                {departureWarning}
              </p>
            )}
          </article>

          <article
            className={
              openToolbarCard === 'manage-shipment'
                ? 'home-toolbar-card home-toolbar-card-open'
                : 'home-toolbar-card'
            }
          >
            <button
              type="button"
              className="home-toolbar-heading"
              onClick={() =>
                setOpenToolbarCard((current) =>
                  current === 'manage-shipment' ? '' : 'manage-shipment',
                )
              }
              aria-expanded={openToolbarCard === 'manage-shipment'}
            >
              <h3>Manage a Shipment</h3>
            </button>
            <form className="home-inline-form" onSubmit={handleQuickTrack}>
              <input
                type="text"
                placeholder="Booking number"
                value={quickTrack}
                onChange={(event) => setQuickTrack(event.target.value)}
                aria-label="Booking number"
              />
              <button type="submit">
                <ArrowRight size={16} />
              </button>
            </form>
            <div className="home-toolbar-links">
              {manageShipmentLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <strong>{link.title}</strong>
                  <span>{link.description}</span>
                </a>
              ))}
            </div>
          </article>

          <article
            className={
              openToolbarCard === 'locations'
                ? 'home-toolbar-card home-toolbar-card-open'
                : 'home-toolbar-card'
            }
          >
            <button
              type="button"
              className="home-toolbar-heading"
              onClick={() =>
                setOpenToolbarCard((current) =>
                  current === 'locations' ? '' : 'locations',
                )
              }
              aria-expanded={openToolbarCard === 'locations'}
            >
              <h3>Our Locations</h3>
            </button>
            <form className="home-inline-form" onSubmit={handleRegionLookup}>
              <select
                value={region}
                onChange={(event) => setRegion(event.target.value)}
              >
                {regions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <button type="submit">
                <MapPin size={16} />
              </button>
            </form>
            <div className="home-toolbar-links">
              <a href={locationQuickLink.url} target="_blank" rel="noreferrer">
                <strong>{locationQuickLink.title}</strong>
                <span>{locationQuickLink.description}</span>
              </a>
            </div>
          </article>
        </section>

        <section className="home-section" aria-label="Toolbox explorer">
          <h2>Explore Vanguard Tools</h2>
          <div className="home-toolbox-tabs">
            {toolboxTabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                className={id === activeTab ? 'home-tab active' : 'home-tab'}
                onClick={() => {
                  setActiveTab(id);
                  setActiveTool(
                    toolboxTabs.find((tab) => tab.id === id)?.tools[0]?.name ??
                      '',
                  );
                }}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
          <div className="home-toolbox-content">
            <ul className="home-tool-list" aria-label="Selected tool category">
              {activeTabData.tools.map((tool) => (
                <li key={tool.name}>
                  <button
                    type="button"
                    className={
                      tool.name === activeToolData.name ? 'active' : ''
                    }
                    onClick={() => setActiveTool(tool.name)}
                  >
                    {tool.name}
                  </button>
                </li>
              ))}
            </ul>
            <article className="home-tool-detail">
              <h3>{activeToolData.name}</h3>
              <p>{activeToolData.desc}</p>
              <a href={activeToolData.url} target="_blank" rel="noreferrer">
                Go to Tool
              </a>
            </article>
          </div>
        </section>

        <section className="home-section" aria-label="Services grid">
          <h2>Efficiency with LCL</h2>
          <div className="home-services-grid">
            {serviceModules.map(({ name, description, Icon }) => (
              <article key={name} className="home-service-card">
                <div className="home-service-head">
                  <Icon size={18} strokeWidth={2} aria-hidden="true" />
                  <h3>{name}</h3>
                </div>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <motion.section
          className="home-section home-section-blend"
          aria-label="Live operations map"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.25 }}
          variants={panelReveal}
        >
          <p className="home-section-kicker">Section 4</p>
          <h2>Live operations map</h2>
          <div
            className="home-ops-map"
            role="img"
            aria-label="Live global operations map"
          >
            <div className="home-ops-grid" />
            <motion.div className="home-ops-sweep" variants={radarSpin} />
            <motion.div
              className="home-ops-point home-ops-point-primary"
              style={{ top: '36%', left: '22%' }}
              variants={nodeFloat}
            />
            <motion.div
              className="home-ops-point"
              style={{ top: '42%', left: '47%' }}
              variants={nodeFloat}
            />
            <motion.div
              className="home-ops-point"
              style={{ top: '58%', left: '64%' }}
              variants={nodeFloat}
            />
            <motion.div
              className="home-ops-point home-ops-point-alert"
              style={{ top: '30%', left: '78%' }}
              variants={nodeFloat}
            />
          </div>
        </motion.section>

        <motion.section
          className="home-section home-section-blend"
          aria-label="Intelligence metrics"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={panelReveal}
        >
          <p className="home-section-kicker">Section 5</p>
          <h2>Intelligence metrics</h2>
          <div className="home-intel-grid">
            {sectionIntelMetrics.map((metric) => (
              <motion.article
                key={metric.label}
                className="home-intel-card"
                variants={nodeFloat}
              >
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </motion.article>
            ))}
          </div>
          <div className="home-intel-alert">
            <ShieldAlert size={18} strokeWidth={2} aria-hidden="true" />
            <p>
              {agencyIntelAlert.message} {agencyIntelAlert.update}
            </p>
          </div>
        </motion.section>

        <section
          className="home-ease-strip"
          aria-label="Ease of doing business"
        >
          <div>
            <h2>Ease of Doing Business</h2>
            <p>
              From deep shipping expertise to reliable global operations,
              Vanguard provides visibility, efficiency, and control at every
              checkpoint.
            </p>
          </div>
          <a href="/about">Learn More</a>
        </section>

        <section className="home-promo" aria-label="Updates and alerts">
          <h2>Get Updates and Alerts</h2>
          <p>
            Receive important lane updates, advisories, and service releases.
          </p>
          <form onSubmit={handlePromoSubmit}>
            <input
              type="email"
              placeholder="Enter email address"
              value={promoEmail}
              onChange={(event) => setPromoEmail(event.target.value)}
            />
            <button type="submit">Join List</button>
          </form>
        </section>
      </div>

      {openModal === 'promo' && (
        <div
          className="home-modal-backdrop"
          role="presentation"
          onClick={() => setOpenModal(null)}
        >
          <article
            className="home-modal"
            role="dialog"
            aria-label="Get Updates and Alerts"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <h3>Get Updates and Alerts</h3>
              <button type="button" onClick={() => setOpenModal(null)}>
                X
              </button>
            </header>
            <iframe
              title="Updates signup"
              src={`${promoIframeUrl}?email=${encodeURIComponent(promoEmail)}`}
              loading="lazy"
              className="home-promo-iframe"
            />
          </article>
        </div>
      )}

      {openModal === 'air' && (
        <QuoteModal
          title="Airfreight Quoting Tool"
          quoteType="AIR"
          captchaToken={quoteCaptchaToken}
          recaptchaSiteKey={recaptchaSiteKey}
          onCaptchaChange={(value) => setQuoteCaptchaToken(value || '')}
          onClose={() => {
            setQuoteCaptchaToken('');
            setOpenModal(null);
          }}
          onSubmit={(event) => handleQuoteSubmit(event, 'AIR')}
        />
      )}

      {openModal === 'fcl' && (
        <QuoteModal
          title="Request an FCL Quote"
          quoteType="FCL"
          captchaToken={quoteCaptchaToken}
          recaptchaSiteKey={recaptchaSiteKey}
          onCaptchaChange={(value) => setQuoteCaptchaToken(value || '')}
          onClose={() => {
            setQuoteCaptchaToken('');
            setOpenModal(null);
          }}
          onSubmit={(event) => handleQuoteSubmit(event, 'FCL')}
        />
      )}

      {cookiePreferencesOpen && (
        <div
          className="home-modal-backdrop"
          role="presentation"
          onClick={() => setCookiePreferencesOpen(false)}
        >
          <article
            className="home-modal"
            role="dialog"
            aria-label="Cookie Preferences"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <h3>Cookie Preferences</h3>
              <button
                type="button"
                onClick={() => setCookiePreferencesOpen(false)}
              >
                X
              </button>
            </header>
            <div className="home-cookie-preferences">
              <label>
                <input type="checkbox" checked disabled />
                <span>Necessary Cookies (always active)</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={cookiePreferences.analytics}
                  onChange={(event) =>
                    setCookiePreferences((current) => ({
                      ...current,
                      analytics: event.target.checked,
                    }))
                  }
                />
                <span>Performance and Analytics Cookies</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={cookiePreferences.marketing}
                  onChange={(event) =>
                    setCookiePreferences((current) => ({
                      ...current,
                      marketing: event.target.checked,
                    }))
                  }
                />
                <span>Marketing Cookies</span>
              </label>
            </div>
            <div className="home-cookie-preferences-actions">
              <button type="button" onClick={handleSaveCookiePreferences}>
                Save Preferences
              </button>
            </div>
          </article>
        </div>
      )}
    </ShellLayout>
  );
}

function QuoteModal({
  title,
  quoteType,
  captchaToken,
  recaptchaSiteKey,
  onCaptchaChange,
  onClose,
  onSubmit,
}) {
  const minTargetDate = useMemo(
    () => new Date().toISOString().slice(0, 10),
    [],
  );

  return (
    <div className="home-modal-backdrop" role="presentation" onClick={onClose}>
      <article
        className="home-modal home-modal-quote"
        role="dialog"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <h3>{title}</h3>
          <button type="button" onClick={onClose}>
            X
          </button>
        </header>
        <form className="home-quote-form" onSubmit={onSubmit}>
          <input name="origin" type="text" placeholder="Origin" required />
          <input
            name="destination"
            type="text"
            placeholder="Destination"
            required
          />
          <input name="targetDate" type="date" min={minTargetDate} required />
          <input name="name" type="text" placeholder="Name" required />
          <input name="city" type="text" placeholder="City" required />
          <select name="country" required defaultValue="">
            <option value="" disabled>
              Country
            </option>
            {countryOptions.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          <input name="email" type="email" placeholder="Email" required />
          <input name="phone" type="tel" placeholder="Phone" required />
          <input name="company" type="text" placeholder="Company" />
          <select name="commodity" required defaultValue="">
            <option value="" disabled>
              Commodity Type
            </option>
            <option value="general">General Cargo</option>
            <option value="hazmat">Hazmat</option>
            <option value="perishable">Perishable</option>
            <option value="oversized">Oversized</option>
          </select>
          <select name="incoterm" required defaultValue="">
            <option value="" disabled>
              Incoterm
            </option>
            <option value="EXW">EXW</option>
            <option value="FOB">FOB</option>
            <option value="CIF">CIF</option>
            <option value="DAP">DAP</option>
          </select>
          <textarea
            name="notes"
            rows={3}
            placeholder={`${quoteType} quote notes and additional requirements`}
          />
          <label className="home-quote-check">
            <input name="termsAccepted" type="checkbox" required />
            <span>I accept terms and conditions for quote submission.</span>
          </label>
          {recaptchaSiteKey ? (
            <div className="home-quote-recaptcha">
              <ReCAPTCHA
                sitekey={recaptchaSiteKey}
                onChange={onCaptchaChange}
                onExpired={() => onCaptchaChange('')}
                onErrored={() => onCaptchaChange('')}
              />
            </div>
          ) : (
            <label className="home-quote-check">
              <input name="captchaAccepted" type="checkbox" required />
              <span>I am not a robot (verification check).</span>
            </label>
          )}
          <div className="home-quote-actions">
            <button
              type="submit"
              disabled={Boolean(recaptchaSiteKey) && !captchaToken}
            >
              Submit
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </article>
    </div>
  );
}
