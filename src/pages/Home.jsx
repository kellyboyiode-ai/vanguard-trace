import { Globe, Package, Radar, ShieldAlert, Truck } from 'lucide-react';
import { VanguardHeroScene } from '../components/index.js';
import { vanguardTraceHero } from '../data/index.js';
import { ShellLayout } from '../layouts/index.js';
import '../styles/homeLayout.css';
import '../styles/vanguardTraceHero.css';

const serviceModules = [
  {
    name: 'Secure Tracking',
    description: 'Tamper-aware visibility from origin through final delivery.',
    Icon: Truck,
  },
  {
    name: 'Cargo Integrity',
    description:
      'Package state intelligence with anomaly alerts and chain logs.',
    Icon: Package,
  },
  {
    name: 'Route Intelligence',
    description: 'Corridor scoring with geopolitical and weather overlays.',
    Icon: Globe,
  },
  {
    name: 'Risk Monitoring',
    description:
      'Radar-based threat scans for incident detection and escalation.',
    Icon: Radar,
  },
];

const intelMetrics = [
  { label: 'Active shipments', value: '1,284' },
  { label: 'At-risk lanes', value: '07' },
  { label: 'Integrity score', value: '98.4%' },
  { label: 'Live alerts', value: '12' },
];

export default function Home() {
  return (
    <ShellLayout
      eyebrow={vanguardTraceHero.eyebrow}
      title={vanguardTraceHero.title}
      description={vanguardTraceHero.subtitle}
    >
      <div className="home-layout">
        <section className="home-section" aria-label="Hero animation">
          <div className="home-section-label">Section 1</div>
          <h2>Hero animation</h2>
          <VanguardHeroScene />
        </section>

        <section className="home-section" aria-label="Shipment tracking input">
          <div className="home-section-label">Section 2</div>
          <h2>Shipment tracking input</h2>

          <form
            className="home-track-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor="shipment-reference" className="home-track-label">
              Track by shipment ID, airway bill, or container number
            </label>

            <div className="home-track-row">
              <input
                id="shipment-reference"
                className="home-track-input"
                type="text"
                placeholder="Example: VX-2047-INTL"
                aria-label="Shipment tracking reference"
              />
              <button type="submit" className="home-track-button">
                Track shipment
              </button>
            </div>
          </form>
        </section>

        <section className="home-section" aria-label="Services grid">
          <div className="home-section-label">Section 3</div>
          <h2>Services grid</h2>

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
          <div className="home-section-label">Section 4</div>
          <h2>Live operations map</h2>

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
          <div className="home-section-label">Section 5</div>
          <h2>Intelligence metrics</h2>

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
              Risk channel elevated on North Atlantic lane. Last update: 40
              seconds ago.
            </p>
          </div>
        </section>
      </div>
    </ShellLayout>
  );
}
