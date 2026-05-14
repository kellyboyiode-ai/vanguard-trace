import { motion } from 'framer-motion';
import GlassCard from './GlassCard.jsx';

export default function BentoWidget({
  title,
  eyebrow,
  value,
  note,
  children,
  size = 'medium',
  pulse = false,
}) {
  return (
    <motion.div
      className={`vt-bento-widget vt-bento-${size}`}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <GlassCard className={pulse ? 'is-live' : ''} title={title} eyebrow={eyebrow}>
        {value ? <p className="vt-bento-value">{value}</p> : null}
        {note ? <p className="vt-bento-note">{note}</p> : null}
        {children}
      </GlassCard>
    </motion.div>
  );
}
