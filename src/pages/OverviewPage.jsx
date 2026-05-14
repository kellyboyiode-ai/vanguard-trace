import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SectionHeader,
  StatCard,
  TraceFeedItem,
  VanguardHeroScene,
} from '../components/index.js';
import { dashboardStats, traceFeed } from '../data/index.js';
import { terminalEvents } from '../data/vanguardTraceContent.js';
import { ShellLayout } from '../layouts/index.js';
import { fadeInUp, staggerContainer, radarSpin } from '../animations/index.js';

export default function OverviewPage() {
  // Tracking input state
  const [trackingCode, setTrackingCode] = useState('VX-2047-INTL');
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  // Fake tracking handler for demo
  function handleTrackSubmit(e) {
    e.preventDefault();
    setTrackingLoading(true);
    setTrackingError('');
    setTimeout(() => {
      if (trackingCode.trim().toUpperCase() === 'VX-2047-INTL') {
        setTrackingResult({
          id: 'VX-2047-INTL',
          status: 'In Transit',
          location: 'PACIFIC-CORRIDOR',
          eta: 'ETA -00:18',
          seal: 'Intact',
          temp: 'Controlled',
        });
        setTrackingError('');
      } else {
        setTrackingResult(null);
        setTrackingError('Shipment not found.');
      }
      setTrackingLoading(false);
    }, 900);
  }

  return (
    <ShellLayout
      eyebrow="VANGUARD_TRACE::SESSION_ACTIVE"
      title="Global Shipment Monitoring with Advanced Logistics Infrastructure"
      description="The highest-grade, cyber-intelligence logistics platform for worldwide crime syndicate disruption and secure supply chain operations."
    >
      {/* Section 1: Hero Animation + Terminal */}
      <motion.div
        className="cyber-hero-section"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <VanguardHeroScene />
        <motion.div className="cyber-terminal" variants={fadeInUp}>
          <div className="cyber-terminal-bg">
            <div className="cyber-terminal-radar">
              <motion.div
                className="cyber-radar-sweep"
                variants={radarSpin}
                animate="animate"
              />
              <span className="cyber-terminal-icon">🛡️</span>
              <span className="cyber-terminal-icon">🚚</span>
              <span className="cyber-terminal-icon">📦</span>
              <span className="cyber-terminal-icon">🌐</span>
            </div>
            <div className="cyber-terminal-lines">
              {terminalEvents.map((line, i) => (
                <span key={i} className="cyber-terminal-line">
                  {line}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Section 2: Tracking Input */}
      <motion.section className="cyber-track-section panel" variants={fadeInUp}>
        <SectionHeader
          title="Track a Shipment"
          subtitle="Track by shipment ID, airway bill, or container number"
        />
        <form
          className="cyber-track-form"
          onSubmit={handleTrackSubmit}
          autoComplete="off"
        >
          <input
            className="cyber-track-input"
            type="text"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            placeholder="e.g. VX-2047-INTL"
            aria-label="Tracking code"
            disabled={trackingLoading}
          />
          <button
            className="cyber-track-btn"
            type="submit"
            disabled={trackingLoading || !trackingCode.trim()}
          >
            {trackingLoading ? 'Tracking...' : 'Track shipment'}
          </button>
        </form>
        {trackingResult && (
          <div className="cyber-track-result">
            <strong>{trackingResult.id}</strong> — {trackingResult.status} @{' '}
            {trackingResult.location} | {trackingResult.eta} | Seal:{' '}
            {trackingResult.seal} | Temp: {trackingResult.temp}
          </div>
        )}
        {trackingError && (
          <div className="cyber-track-error">{trackingError}</div>
        )}
      </motion.section>

      {/* Section 3: Services Grid */}
      <motion.section
        className="cyber-services-section panel"
        variants={fadeInUp}
      >
        <SectionHeader
          title="Agency Services"
          subtitle="Secure Tracking, Cargo Integrity, Route Intelligence, Risk Monitoring"
        />
        <div className="cyber-services-grid">
          <div className="cyber-service-card">
            <h3>Secure Tracking</h3>
            <p>Tamper-aware visibility from origin through final delivery.</p>
          </div>
          <div className="cyber-service-card">
            <h3>Cargo Integrity</h3>
            <p>
              Package state intelligence with anomaly alerts and chain logs.
            </p>
          </div>
          <div className="cyber-service-card">
            <h3>Route Intelligence</h3>
            <p>Corridor scoring with geopolitical and weather overlays.</p>
          </div>
          <div className="cyber-service-card">
            <h3>Risk Monitoring</h3>
            <p>
              Radar-based threat scans for incident detection and escalation.
            </p>
          </div>
        </div>
      </motion.section>
    </ShellLayout>
  );
}
