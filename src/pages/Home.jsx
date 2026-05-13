import { useMemo, useState } from 'react';
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
  Ship,
  Truck,
} from 'lucide-react';
import { VanguardHeroScene } from '../components/index.js';
import { vanguardTraceHero } from '../data/index.js';
import { ShellLayout } from '../layouts/index.js';
import '../styles/homeLayout.css';
import '../styles/vanguardTraceHero.css';

const topTools = [
  {
    title: 'Vanguard ADESSO',
    description: 'Quote, book, and manage LCL in one workflow.',
    url: 'https://portal.vanguardlogistics.com/apps/ui/#/adesso',
  },
  {
    title: 'FCL Rate Search',
    description: 'Search full-container rates in Avanti.',
    url: 'https://avanti.vanguardlogistics.com/',
  },
  {
    title: 'Shiprite',
    description: 'LTL quoting and lane planning.',
    url: 'https://portal.vanguardlogistics.com/apps/shiprite-on-demand/',
  },
];

const toolboxTabs = [
  {
    id: 'quotation',
    label: 'Quotation Tools',
    Icon: Package,
    tools: [
      {
        name: 'Vanguard ADESSO',
        desc: 'Quote, book, and manage LCL online with door-to-door visibility.',
        url: 'https://portal.vanguardlogistics.com/apps/ui/#/adesso',
      },
      {
        name: 'FCL Rate Search',
        desc: 'Full-container search and booking planning.',
        url: 'https://avanti.vanguardlogistics.com/',
      },
      {
        name: 'IMO 2020 Rate Search',
        desc: 'Compare rate structures with fuel and compliance context.',
        url: 'https://portal.vanguardlogistics.com/apps/ui/#/imo',
      },
    ],
  },
  {
    id: 'shipping',
    label: 'Shipping Tools',
    Icon: Ship,
    tools: [
      {
        name: 'Ocean Booking',
        desc: 'Place bookings and monitor booking readiness.',
        url: 'https://portal.vanguardlogistics.com/apps/ocean-booking/',
      },
      {
        name: 'Sailing Schedule',
        desc: 'Interactive origin-to-destination schedule lookup.',
        url: 'https://portal.vanguardlogistics.com/apps/sailing-schedule/',
      },
      {
        name: 'Solas VGM',
        desc: 'Submit VGM details with audit-ready confirmations.',
        url: 'https://portal.vanguardlogistics.com/apps/verified-gross-mass/',
      },
    ],
  },
  {
    id: 'tracking',
    label: 'Tracking Tools',
    Icon: Radar,
    tools: [
      {
        name: 'Track & Trace',
        desc: 'Deep shipment visibility across checkpoints and handoffs.',
        url: 'https://portal.vanguardlogistics.com/apps/track-shipment/',
      },
      {
        name: 'Quick Track',
        desc: 'Immediate status checks by booking reference.',
        url: 'https://www.vanguardlogistics.com/tracking-results?tracking=',
      },
      {
        name: 'Statusmate',
        desc: 'Schedule recurring shipment status reports.',
        url: 'https://portal.vanguardlogistics.com/apps/shipment-status/',
      },
    ],
  },
  {
    id: 'documentation',
    label: 'Documentation Tools',
    Icon: ShieldAlert,
    tools: [
      {
        name: 'Documentation Portal',
        desc: 'Review, upload, and download shipment documents.',
        url: 'https://portal.vanguardlogistics.com/apps/documentation/',
      },
      {
        name: 'Create SLI',
        desc: 'Submit shipping instructions with structured fields.',
        url: 'https://portal.vanguardlogistics.com/apps/create-sli/',
      },
      {
        name: 'Cargo Release Order',
        desc: 'Manage import release documentation workflows.',
        url: 'https://portal.vanguardlogistics.com/apps/cargo-release-order/',
      },
    ],
  },
];

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

const intelMetrics = [
  { label: 'Active shipments', value: '1,284' },
  { label: 'At-risk lanes', value: '07' },
  { label: 'Integrity score', value: '98.4%' },
  { label: 'Live alerts', value: '12' },
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

export default function Home() {
  const [cookieAccepted, setCookieAccepted] = useState(
    () => localStorage.getItem('vt-cookie-ok') === 'true',
  );
  const [heroPlaying, setHeroPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState('quotation');
  const [activeTool, setActiveTool] = useState('Vanguard ADESSO');
  const [quickTrack, setQuickTrack] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [region, setRegion] = useState(regions[0]);
  const [promoEmail, setPromoEmail] = useState('');
  const [openModal, setOpenModal] = useState(null);

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

  function handleAcceptCookies() {
    localStorage.setItem('vt-cookie-ok', 'true');
    setCookieAccepted(true);
  }

  function handleServiceSearch(event) {
    event.preventDefault();

    if (!origin.trim() || !destination.trim()) {
      toast.error('Add both origin and destination to search sailing routes.');
      return;
    }

    toast.success(
      `Searching route: ${origin.toUpperCase()} -> ${destination.toUpperCase()}`,
    );
  }

  function handleQuickTrack(event) {
    event.preventDefault();
    if (!quickTrack.trim()) {
      toast.error('Enter a booking number to continue.');
      return;
    }

    const target = `https://www.vanguardlogistics.com/tracking-results?tracking=${encodeURIComponent(
      quickTrack.trim(),
    )}`;

    window.open(target, '_blank', 'noopener,noreferrer');
  }

  function handleRegionLookup(event) {
    event.preventDefault();
    toast.success(`Opening locations for ${region}.`);
  }

  function handlePromoSubmit(event) {
    event.preventDefault();
    if (!promoEmail.trim()) {
      toast.error('Enter an email to join updates.');
      return;
    }

    setOpenModal('promo');
  }

  function handleQuoteSubmit(event, quoteType) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const originValue = `${form.get('origin') ?? ''}`.trim();
    const destinationValue = `${form.get('destination') ?? ''}`.trim();
    const emailValue = `${form.get('email') ?? ''}`.trim();

    if (!originValue || !destinationValue || !emailValue) {
      toast.error('Complete required fields before submitting quote request.');
      return;
    }

    toast.success(`${quoteType} quote request submitted successfully.`);
    event.currentTarget.reset();
    setOpenModal(null);
  }

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
          <button type="button" onClick={handleAcceptCookies}>
            Got it
          </button>
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
          <article className="home-toolbar-card">
            <h3>Quote and Book</h3>
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
                <strong>Airfreight Quote</strong>
                <span>Open air quote request form.</span>
              </button>
              <button type="button" onClick={() => setOpenModal('fcl')}>
                <strong>FCL Quote</strong>
                <span>Open full-container quote request form.</span>
              </button>
            </div>
          </article>

          <article className="home-toolbar-card">
            <h3>Find a Service</h3>
            <form className="home-inline-form" onSubmit={handleServiceSearch}>
              <input
                type="text"
                placeholder="Origin"
                value={origin}
                onChange={(event) => setOrigin(event.target.value)}
                aria-label="Service origin"
              />
              <input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                aria-label="Service destination"
              />
              <button type="submit">
                <Search size={16} />
              </button>
            </form>
          </article>

          <article className="home-toolbar-card">
            <h3>Manage a Shipment</h3>
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
          </article>

          <article className="home-toolbar-card">
            <h3>Our Locations</h3>
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

        <section className="home-section" aria-label="Live operations map">
          <h2>24/7 Track and Manage Your Shipments</h2>
          <div
            className="home-ops-map"
            role="img"
            aria-label="Live logistics operations map"
          >
            <div className="home-ops-grid" />
            <div className="home-ops-sweep" />
            <div
              className="home-ops-point home-ops-point-primary"
              style={{ top: '34%', left: '23%' }}
            />
            <div
              className="home-ops-point"
              style={{ top: '44%', left: '49%' }}
            />
            <div
              className="home-ops-point"
              style={{ top: '58%', left: '67%' }}
            />
            <div
              className="home-ops-point home-ops-point-alert"
              style={{ top: '30%', left: '79%' }}
            />
          </div>
        </section>

        <section className="home-section" aria-label="Intelligence metrics">
          <h2>Service metrics</h2>
          <div className="home-intel-grid">
            {intelMetrics.map((metric) => (
              <article key={metric.label} className="home-intel-card">
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </article>
            ))}
          </div>
          <div className="home-intel-alert">
            <ShieldAlert size={18} strokeWidth={2} aria-hidden="true" />
            <p>
              One lane update requires manual review. Last update: 40 seconds
              ago.
            </p>
          </div>
        </section>

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

        <section className="home-promo" aria-label="Promotions">
          <h2>Get Updates and Promotions</h2>
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
            aria-label="Get Updates and Promotions"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <h3>Get Updates and Promotions</h3>
              <button type="button" onClick={() => setOpenModal(null)}>
                X
              </button>
            </header>
            <p>
              Thank you. We have added {promoEmail || 'your email'} to promotion
              updates.
            </p>
          </article>
        </div>
      )}

      {openModal === 'air' && (
        <QuoteModal
          title="Airfreight Quoting Tool"
          onClose={() => setOpenModal(null)}
          onSubmit={(event) => handleQuoteSubmit(event, 'AIR')}
        />
      )}

      {openModal === 'fcl' && (
        <QuoteModal
          title="Request an FCL Quote"
          onClose={() => setOpenModal(null)}
          onSubmit={(event) => handleQuoteSubmit(event, 'FCL')}
        />
      )}
    </ShellLayout>
  );
}

function QuoteModal({ title, onClose, onSubmit }) {
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
          <input name="targetDate" type="date" required />
          <input name="name" type="text" placeholder="Name" required />
          <input name="city" type="text" placeholder="City" required />
          <input name="email" type="email" placeholder="Email" required />
          <input name="phone" type="tel" placeholder="Phone" required />
          <input name="company" type="text" placeholder="Company" />
          <div className="home-quote-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </article>
    </div>
  );
}
