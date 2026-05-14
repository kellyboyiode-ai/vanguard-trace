import { motion } from 'framer-motion';

export default function TrackingTimeline({ steps = [] }) {
  return (
    <ol className="vt-tracking-timeline" aria-label="Shipment timeline">
      {steps.map((step, index) => (
        <motion.li
          key={`${step.label}-${index}`}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.24, delay: index * 0.06 }}
        >
          <span className="vt-timeline-dot" aria-hidden="true" />
          <div>
            <strong>{step.label}</strong>
            <p>{step.meta}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
