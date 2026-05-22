import { motion } from 'framer-motion';
import { getPageMedia } from '../data/premiumMediaLibrary.js';
import { useAdaptiveMotion } from '../hooks/useAdaptiveMotion.js';

const galleryVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: 'easeOut',
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 14,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
    },
  },
};

export default function PageMediaGallery({
  pageKey,
  title = 'Mission Visual Intelligence',
  compact = false,
}) {
  const { reducedMotion } = useAdaptiveMotion();
  const media = getPageMedia(pageKey);

  if (!media.length) {
    return null;
  }

  return (
    <motion.section
      className={
        compact
          ? 'vt-media-gallery vt-media-gallery-compact'
          : 'vt-media-gallery'
      }
      aria-label={`${title} for ${pageKey}`}
      initial={reducedMotion ? false : 'hidden'}
      whileInView={reducedMotion ? undefined : 'visible'}
      viewport={reducedMotion ? undefined : { once: true, amount: 0.35 }}
      variants={galleryVariants}
    >
      <motion.div className="panel-header" variants={itemVariants}>
        <h2>{title}</h2>
        <p>{`${media.length} assigned assets`}</p>
      </motion.div>

      <div className="vt-media-grid">
        {media.map((asset) => (
          <motion.figure
            key={asset.id}
            className="vt-media-tile"
            variants={itemVariants}
            whileHover={
              reducedMotion
                ? undefined
                : {
                    y: -4,
                    scale: 1.015,
                  }
            }
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <img
              src={asset.src}
              alt={asset.alt}
              loading="lazy"
              decoding="async"
            />
          </motion.figure>
        ))}
      </div>
    </motion.section>
  );
}
