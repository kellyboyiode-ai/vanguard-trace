import { motion } from 'framer-motion';
import {
  Globe,
  Package as PackageIcon,
  Radar,
  Shield,
  Terminal,
  Truck,
} from 'lucide-react';
import {
  panelReveal,
  nodeFloat,
  radarSpin,
} from '../animations/vanguardTraceMotion.js';
import {
  movingNodes,
  terminalEvents,
  vanguardTraceHero,
} from '../data/vanguardTraceContent.js';

const iconCards = [
  { id: 'radar', label: 'Radar', Icon: Radar },
  { id: 'shield', label: 'Shield', Icon: Shield },
  { id: 'truck', label: 'Truck', Icon: Truck },
  { id: 'package', label: 'Package', Icon: PackageIcon },
  { id: 'globe', label: 'Globe', Icon: Globe },
  { id: 'terminal', label: 'Terminal', Icon: Terminal },
];

export default function VanguardHeroScene() {
  return (
    <motion.section
      className="vt-hero"
      initial="initial"
      animate="animate"
      variants={panelReveal}
    >
      <div className="vt-backdrop" aria-hidden="true">
        <div className="vt-grid" />

        <div className="vt-map">
          <svg viewBox="0 0 1200 520" role="presentation" focusable="false">
            <path
              d="M80 220 L180 160 L280 170 L360 140 L430 200 L510 190 L610 215 L710 185 L780 210 L870 180 L930 205 L1030 190"
              fill="none"
              stroke="rgba(122, 225, 255, 0.54)"
              strokeWidth="3"
            />
            <path
              d="M180 300 L290 270 L380 290 L450 260 L520 290 L650 270 L730 300 L810 285 L900 315 L1010 300"
              fill="none"
              stroke="rgba(74, 154, 255, 0.44)"
              strokeWidth="3"
            />
            <path
              d="M220 370 L300 350 L390 360 L500 330 L620 350 L740 340 L830 355 L930 340"
              fill="none"
              stroke="rgba(91, 171, 255, 0.4)"
              strokeWidth="3"
            />
          </svg>
        </div>

        <div className="vt-radar">
          <span className="vt-radar-icon" aria-hidden="true">
            <Radar size={16} strokeWidth={1.75} />
          </span>

          <motion.div
            className="vt-radar-sweep"
            variants={radarSpin}
            animate="animate"
          />
        </div>

        {movingNodes.map((node) => (
          <motion.span
            key={node.id}
            className={node.id === 'af' ? 'vt-node vt-node-warning' : 'vt-node'}
            style={{ top: node.top, left: node.left }}
            variants={nodeFloat}
            initial="initial"
            animate="animate"
            transition={{ delay: node.delay }}
          />
        ))}
      </div>

      <div className="vt-content">
        <div className="vt-icon-dock" aria-label="Core monitoring icon set">
          {iconCards.map(({ id, label, Icon }) => (
            <span key={id} className="vt-icon-chip" title={label}>
              <Icon size={14} strokeWidth={2} aria-hidden="true" />
              <span>{label}</span>
            </span>
          ))}
        </div>

        <div className="vt-tag-grid">
          {vanguardTraceHero.tags.map((tag) => (
            <span key={tag} className="vt-tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="vt-terminal" aria-label="Live terminal telemetry">
          <p className="vt-terminal-head">
            <Terminal size={14} strokeWidth={2} aria-hidden="true" />
            <span>VANGUARD_TRACE::SESSION_ACTIVE</span>
          </p>
          {terminalEvents.map((event) => (
            <p key={event} className="vt-terminal-line">
              {event}
            </p>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
