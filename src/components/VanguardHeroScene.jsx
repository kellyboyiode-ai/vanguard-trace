import { motion } from 'framer-motion';
import { panelReveal } from '../animations/vanguardTraceMotion.js';
import heroMark from '../assets/hero.png';
import { heroImage, vanguardTraceHero } from '../data/vanguardTraceContent.js';

const quickStats = [
  { id: 'active', label: 'Active shipments', value: '1,284' },
  { id: 'on-time', label: 'On-time deliveries', value: '97.6%' },
  { id: 'checkpoints', label: 'Updated checkpoints', value: '24/7' },
];

export default function VanguardHeroScene() {
  return (
    <motion.section
      className="vt-hero"
      initial="initial"
      animate="animate"
      variants={panelReveal}
    >
      <div className="vt-media-wrap">
        <img
          className="vt-hero-image"
          src={heroImage.src}
          alt={heroImage.alt}
        />
        <div className="vt-media-frame" aria-hidden="true">
          <span className="vt-frame-pill">VT Live Grid</span>
          <img className="vt-brand-mark" src={heroMark} alt="" />
          <span className="vt-frame-pill">Signal Locked</span>
        </div>
        <div className="vt-hero-scanlines" aria-hidden="true" />
        <div className="vt-media-overlay" aria-hidden="true" />
      </div>

      <div className="vt-content">
        <div className="vt-tag-grid">
          {vanguardTraceHero.tags.map((tag) => (
            <span key={tag} className="vt-tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="vt-quick-grid" aria-label="Operational summary">
          {quickStats.map((stat) => (
            <article key={stat.id} className="vt-quick-card">
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </div>

        <div className="vt-note" role="status" aria-live="polite">
          Daily route updates and proof-of-delivery events refresh
          automatically.
        </div>
      </div>
    </motion.section>
  );
}
