import { motion } from 'framer-motion';
import { getPageMedia } from '../data/premiumMediaLibrary.js';
import { useAdaptiveMotion } from '../hooks/useAdaptiveMotion.js';

const galleryVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: 0.09,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.42, ease: 'easeOut' },
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
      viewport={reducedMotion ? undefined : { once: true, amount: 0.3 }}
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
                    y: -7,
                    scale: 1.03,
                  }
            }
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
            <motion.img
              src={asset.src}
              alt={asset.alt}
              loading="lazy"
              decoding="async"
              animate={
                reducedMotion
                  ? undefined
                  : {
                      scale: [1.03, 1.09, 1.04, 1.03],
                      x: [0, -8, 6, 0],
                      y: [0, -4, 3, 0],
                      filter: [
                        'saturate(0.82) contrast(1.08) brightness(0.78) hue-rotate(-8deg)',
                        'saturate(0.96) contrast(1.12) brightness(0.88) hue-rotate(-4deg)',
                        'saturate(0.9) contrast(1.1) brightness(0.83) hue-rotate(-6deg)',
                        'saturate(0.82) contrast(1.08) brightness(0.78) hue-rotate(-8deg)',
                      ],
                    }
              }
              transition={
                reducedMotion
                  ? undefined
                  : {
                      duration: 13.5,
                      ease: 'easeInOut',
                      repeat: Infinity,
                    }
              }
            />
            <motion.span
              className="vt-media-sweep"
              aria-hidden="true"
              animate={
                reducedMotion
                  ? undefined
                  : {
                      x: ['-120%', '160%'],
                      opacity: [0, 0.34, 0],
                    }
              }
              transition={
                reducedMotion
                  ? undefined
                  : {
                      duration: 4.8,
                      repeat: Infinity,
                      ease: 'linear',
                    }
              }
            />
            <motion.span
              className="vt-media-pulse"
              aria-hidden="true"
              animate={
                reducedMotion
                  ? undefined
                  : {
                      scale: [0.9, 1.08, 0.9],
                      opacity: [0.16, 0.32, 0.16],
                    }
              }
              transition={
                reducedMotion
                  ? undefined
                  : {
                      duration: 3.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
              }
            />
          </motion.figure>
        ))}
      </div>
    </motion.section>
  );
}
