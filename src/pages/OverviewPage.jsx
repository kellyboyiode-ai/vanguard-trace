import { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader, VanguardHeroScene } from '../components/index.js';
import { terminalEvents } from '../data/vanguardTraceContent.js';
import { fadeInUp, staggerContainer } from '../animations/motionPresets.js';
import { nodeFloat, panelReveal } from '../animations/vanguardTraceMotion.js';
import { ShellLayout } from '../layouts/index.js';

const telemetryWidgets = [
  {
    id: 'lane-encryption',
    label: 'Lane telemetry',
    value: 'Live coverage active',
    detail: '11 major corridors with continuous status refresh.',
  },
  {
    id: 'risk-detection',
    label: 'Transit watch',
    value: 'Advisory / North Atlantic',
    detail: 'Weather and delay advisory updated in the last 40 seconds.',
  },
  {
    id: 'ops-integrity',
    label: 'Delivery integrity',
    value: '98.4% confirmed',
    detail: 'Milestone checks synced across customs and handoff points.',
  },
];

export default function OverviewPage() {
  // Section 2: Tracking input state
  const [trackingCode, setTrackingCode] = useState('VX-2047-INTL');
  const [trackingResult, setTrackingResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [trackingMessage, setTrackingMessage] = useState('');

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
      eyebrow="Vanguard Operations"
      title="Global Shipment Monitoring"
      description="A modern logistics operations console for real-time shipment tracking, route visibility, and delivery assurance."
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
            <div className="agency-radar-sweep" />
            <span className="agency-radar-label">LIVE MAP</span>
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
          {terminalEvents.map((evt, i) => (
            <motion.li
              key={evt}
              className="agency-terminal-line"
              variants={fadeInUp}
            >
              {evt}
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          className="agency-telemetry-grid"
          variants={staggerContainer}
        >
          {telemetryWidgets.map((item) => (
            <motion.article
              key={item.id}
              className="agency-telemetry-card"
              variants={fadeInUp}
              whileHover={{ y: -3 }}
            >
              <p className="agency-telemetry-label">{item.label}</p>
              <h3>{item.value}</h3>
              <p className="agency-telemetry-detail">{item.detail}</p>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

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
          title="Logistics Services"
          subtitle="Visibility, reliability, and route performance for global shipments."
        />
        <div className="agency-services-grid">
          <motion.div
            className="agency-service-card"
            variants={fadeInUp}
            whileHover={{ y: -4 }}
          >
            <div className="agency-service-icon agency-service-secure" />
            <h3>Secure Tracking</h3>
            <p>Tamper-aware visibility from origin through final delivery.</p>
          </motion.div>
          <motion.div
            className="agency-service-card"
            variants={fadeInUp}
            whileHover={{ y: -4 }}
          >
            <div className="agency-service-icon agency-service-integrity" />
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
            <div className="agency-service-icon agency-service-route" />
            <h3>Route Intelligence</h3>
            <p>Corridor scoring with geopolitical and weather overlays.</p>
          </motion.div>
          <motion.div
            className="agency-service-card"
            variants={fadeInUp}
            whileHover={{ y: -4 }}
          >
            <div className="agency-service-icon agency-service-risk" />
            <h3>Risk Monitoring</h3>
            <p>
              Delay and exception monitoring for proactive route management.
            </p>
          </motion.div>
        </div>
      </motion.section>
    </ShellLayout>
  );
}
