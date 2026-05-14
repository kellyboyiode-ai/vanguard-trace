import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AIInsightBox,
  BentoWidget,
  GlobeView,
  SectionHeader,
  TrackingTimeline,
  VanguardHeroScene,
} from '../components/index.js';
import { fadeInUp, staggerContainer } from '../animations/motionPresets.js';
import {
  radarSpin,
  nodeFloat,
  panelReveal,
} from '../animations/vanguardTraceMotion.js';
import { ShellLayout } from '../layouts/index.js';
import { useOperationsStore } from '../store/index.js';

const overviewStatusFeed = [
  'Status stream active: Global route updates synchronized.',
  'Service reliability: On-time trend remains within target window.',
  'Operational alerts: Exception queue monitored in real time.',
  'Checkpoint updates: Proof-of-delivery events syncing continuously.',
];

const radarStatuses = ['LOCKED', 'TRACKING', 'SWEEPING', 'CONFIRMED'];

const overviewTimeline = [
  {
    label: 'Port Arrival',
    meta: 'Freight manifest validated at terminal gate',
  },
  { label: 'Risk Scan', meta: 'Anomaly engine reports low-severity variance' },
  { label: 'Hub Transfer', meta: 'Air-to-ground handoff queued for dispatch' },
];

function formatUtcTime(date) {
  const hh = String(date.getUTCHours()).padStart(2, '0');
  const mm = String(date.getUTCMinutes()).padStart(2, '0');
  const ss = String(date.getUTCSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}Z`;
}

function buildRadarTelemetry(step) {
  const now = new Date();
  const status = radarStatuses[step % radarStatuses.length];
  const signal = (95.4 + ((step * 0.37) % 4.3)).toFixed(1);
  const contacts = 8 + (step % 7);
  const bearing = String((44 + step * 11) % 360).padStart(3, '0');
  const sweepDelta = (0.14 + ((step * 0.03) % 0.48)).toFixed(2);

  return {
    station: `STN-07 // ${status}`,
    signal: `SIGNAL ${signal}% // UTC ${formatUtcTime(now)}`,
    contacts: `CONTACTS ${contacts}`,
    bearing: `BEARING ${bearing} DEG`,
    delta: `SCAN DELTA ${sweepDelta}s`,
  };
}

export default function OverviewPage() {
  const liveKpis = useOperationsStore((state) => state.kpis);
  // Section 2: Tracking input state
  const [trackingCode, setTrackingCode] = useState('VX-2047-INTL');
  const [trackingResult, setTrackingResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [trackingMessage, setTrackingMessage] = useState('');
  const [radarTelemetry, setRadarTelemetry] = useState(() =>
    buildRadarTelemetry(0),
  );

  useEffect(() => {
    let step = 0;

    const telemetryTimer = setInterval(() => {
      step += 1;
      setRadarTelemetry(buildRadarTelemetry(step));
    }, 1000);

    return () => clearInterval(telemetryTimer);
  }, []);

  // Demo tracking handler (replace with real API if needed)
  function handleTrackSubmit(e) {
    e.preventDefault();
    setIsSearching(true);
    setTrackingMessage('');
    setTimeout(() => {
      if (trackingCode.trim().toUpperCase() === 'VX-2047-INTL') {
        setTrackingResult({
          id: 'VX-2047-INTL',
          status: 'STABLE',
          location: 'PACIFIC CORRIDOR',
          eta: '12h 42m',
        });
        setTrackingMessage('');
      } else {
        setTrackingResult(null);
        setTrackingMessage('Shipment not found. Try VX-2047-INTL.');
      }
      setIsSearching(false);
    }, 900);
  }

  return (
    <ShellLayout
      eyebrow="VANGUARD_TRACE::SESSION_ACTIVE"
      title="Global Shipment Monitoring with Advanced Trace Infrastructure"
      description="A modern trace intelligence platform delivering secure shipment visibility, route analytics, and reliable global operations support."
    >
      {/* Section 1: Hero + Animated Telemetry */}
      <motion.section
        className="agency-hero dark"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div className="agency-hero-scene" variants={panelReveal}>
          <VanguardHeroScene />
          <div className="agency-hero-scene-overlay" />
        </motion.div>

        <div className="agency-hero-row">
          {/* Animated Radar */}
          <motion.div
            className="agency-radar"
            variants={panelReveal}
            animate="animate"
            initial="initial"
          >
            <div className="agency-radar-grid" />
            <motion.div
              className="agency-radar-sweep"
              variants={radarSpin}
              animate="animate"
            />
            <span className="agency-radar-ring agency-radar-ring-a" />
            <span className="agency-radar-ring agency-radar-ring-b" />
            <motion.span
              className="agency-radar-blip agency-radar-blip-a"
              animate={{ opacity: [0.15, 1, 0.15], scale: [0.85, 1.2, 0.85] }}
              transition={{
                duration: 1.9,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.span
              className="agency-radar-blip agency-radar-blip-b"
              animate={{ opacity: [0.2, 0.95, 0.2], scale: [0.9, 1.15, 0.9] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <div className="agency-radar-starfield" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <span className="agency-radar-core" />
            <span className="agency-radar-label">RADAR</span>
            <div className="agency-radar-readout" aria-label="Station reading">
              <span>{radarTelemetry.station}</span>
              <span>{radarTelemetry.signal}</span>
              <span>{radarTelemetry.contacts}</span>
              <span>{radarTelemetry.bearing}</span>
              <span>{radarTelemetry.delta}</span>
            </div>
          </motion.div>

          {/* Animated Shield */}
          <motion.div
            className="agency-shield"
            variants={nodeFloat}
            animate="animate"
          />
          {/* Animated Truck */}
          <motion.div
            className="agency-truck"
            variants={nodeFloat}
            animate="animate"
          />
          {/* Animated Package */}
          <motion.div
            className="agency-package"
            variants={nodeFloat}
            animate="animate"
          />
          {/* Animated Globe */}
          <motion.div
            className="agency-globe"
            variants={nodeFloat}
            animate="animate"
          />
          {/* Animated Terminal */}
          <motion.div
            className="agency-terminal"
            variants={panelReveal}
            animate="animate"
          />
        </div>

        {/* Animated Telemetry Feed */}
        <motion.ul className="agency-terminal-feed" variants={staggerContainer}>
          {overviewStatusFeed.map((evt) => (
            <motion.li
              key={evt}
              className="agency-terminal-line"
              variants={fadeInUp}
            >
              {evt}
            </motion.li>
          ))}
        </motion.ul>
      </motion.section>

      <section className="vt-bento-grid" aria-label="Overview command widgets">
        <BentoWidget
          size="large"
          pulse
          eyebrow="Global Corridors"
          title="Realtime Earth Tracking"
          note="Live route projection with congestion intelligence"
        >
          <GlobeView />
        </BentoWidget>

        <BentoWidget
          size="medium"
          eyebrow="Operations"
          title="Active Shipments"
          value={String(liveKpis.activeShipments)}
          note="Continuous updates from logistics event stream"
        >
          <AIInsightBox
            title="AI Forecast"
            line="West Africa lane likely to recover by next dispatch window."
          />
        </BentoWidget>

        <BentoWidget
          size="small"
          eyebrow="Delay Pressure"
          title="Delayed"
          value={String(liveKpis.delayedShipments)}
          note="Includes weather and customs-triggered exceptions"
        />

        <BentoWidget
          size="medium"
          eyebrow="Mission Timeline"
          title="Live Event Progression"
          note="Freight transitions and route-state confirmations"
        >
          <TrackingTimeline steps={overviewTimeline} />
        </BentoWidget>
      </section>

      {/* Section 2: Tracking Input */}
      <motion.section
        className="agency-track-panel panel"
        variants={panelReveal}
        initial="initial"
        animate="animate"
      >
        <SectionHeader
          title="Track a Shipment"
          subtitle="Track by shipment ID, airway bill, or container number. Example: VX-2047-INTL"
        />
        <form
          className="agency-track-form"
          onSubmit={handleTrackSubmit}
          autoComplete="off"
        >
          <input
            className="agency-track-input"
            type="text"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            placeholder="Enter shipment ID..."
            aria-label="Shipment ID"
            disabled={isSearching}
          />
          <button
            className="agency-track-btn"
            type="submit"
            disabled={isSearching}
          >
            {isSearching ? 'Tracking...' : 'Track shipment'}
          </button>
        </form>
        {trackingMessage && (
          <div className="agency-track-error">{trackingMessage}</div>
        )}
        {trackingResult && (
          <div className="agency-track-result">
            <dl>
              <div>
                <dt>ID</dt>
                <dd>{trackingResult.id}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{trackingResult.status}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{trackingResult.location}</dd>
              </div>
              <div>
                <dt>ETA</dt>
                <dd>{trackingResult.eta}</dd>
              </div>
            </dl>
          </div>
        )}
      </motion.section>

      {/* Section 3: Services Grid */}
      <motion.section
        className="agency-services panel"
        variants={panelReveal}
        initial="initial"
        animate="animate"
      >
        <SectionHeader
          title="Operational Services"
          subtitle="Advanced shipment security, route insights, and proactive monitoring for global trade corridors."
        />
        <div className="agency-services-grid">
          <motion.div
            className="agency-service-card"
            variants={fadeInUp}
            whileHover={{ y: -4 }}
          >
            <motion.svg
              className="agency-service-icon agency-service-secure"
              viewBox="0 0 64 64"
              width="54"
              height="54"
              animate={{ y: [-2, 2, -2] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.25"
              />
              <path
                d="M 24 30 V 26 C 24 21.6 27.6 18 32 18 C 36.4 18 40 21.6 40 26 V 30"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 20 30 H 44 C 45.7 30 47 31.3 47 33 V 45 C 47 46.7 45.7 48 44 48 H 20 C 18.3 48 17 46.7 17 45 V 33 C 17 31.3 18.3 30 20 30 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="32" cy="39" r="2.5" fill="currentColor" />
              <path
                d="M 32 41.5 V 44"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </motion.svg>
            <h3>Secure Tracking</h3>
            <p>Tamper-aware visibility from origin through final delivery.</p>
          </motion.div>
          <motion.div
            className="agency-service-card"
            variants={fadeInUp}
            whileHover={{ y: -4 }}
          >
            <motion.svg
              className="agency-service-icon agency-service-integrity"
              viewBox="0 0 64 64"
              width="54"
              height="54"
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <circle
                cx="28"
                cy="28"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              />
              <path
                d="M 40 40 L 50 50"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle
                cx="28"
                cy="28"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.3"
              />
            </motion.svg>
            <h3>Cargo Integrity</h3>
            <p>
              Package state intelligence with anomaly alerts and chain logs.
            </p>
          </motion.div>
          <motion.div
            className="agency-service-card"
            variants={fadeInUp}
            whileHover={{ y: -4 }}
          >
            <motion.div
              className="agency-service-icon agency-service-route"
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <h3>Route Intelligence</h3>
            <p>Corridor scoring with geopolitical and weather overlays.</p>
          </motion.div>
          <motion.div
            className="agency-service-card"
            variants={fadeInUp}
            whileHover={{ y: -4 }}
          >
            <motion.div
              className="agency-service-icon agency-service-risk"
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <h3>Risk Monitoring</h3>
            <p>
              Radar-based threat scans for incident detection and escalation.
            </p>
          </motion.div>
        </div>
      </motion.section>
    </ShellLayout>
  );
}
