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
              <motion.svg
                className="vt-media-signal-layer"
                viewBox="0 0 400 300"
                aria-hidden="true"
              >
                <motion.path
                  d="M58 112 L186 152 L332 74"
                  className="vt-media-signal-trace"
                  initial={reducedMotion ? false : { pathLength: 0.15, opacity: 0.45 }}
                  animate={
                    reducedMotion
                      ? undefined
                      : {
                          pathLength: [0.2, 1, 0.34, 1],
                          opacity: [0.42, 0.95, 0.56, 0.92],
                        }
                  }
                  transition={
                    reducedMotion
                      ? undefined
                      : {
                          duration: 6,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }
                  }
                />
                <motion.path
                  d="M86 228 L186 152 L286 236"
                  className="vt-media-signal-trace vt-media-signal-trace-secondary"
                  initial={reducedMotion ? false : { pathLength: 0.12, opacity: 0.34 }}
                  animate={
                    reducedMotion
                      ? undefined
                      : {
                          pathLength: [0.14, 0.92, 0.26, 0.92],
                          opacity: [0.25, 0.74, 0.38, 0.7],
                        }
                  }
                  transition={
                    reducedMotion
                      ? undefined
                      : {
                          duration: 7.4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 0.6,
                        }
                  }
                />
                {[{ cx: 58, cy: 112 }, { cx: 186, cy: 152 }, { cx: 332, cy: 74 }].map(
                  (node, index) => (
                    <g key={`${asset.id}-node-${index}`}>
                      <motion.circle
                        cx={node.cx}
                        cy={node.cy}
                        r="4"
                        className="vt-media-signal-node"
                        animate={
                          reducedMotion
                            ? undefined
                            : {
                                opacity: [0.45, 1, 0.45],
                              }
                        }
                        transition={
                          reducedMotion
                            ? undefined
                            : {
                                duration: 2.4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: index * 0.28,
                              }
                        }
                      />
                      <motion.circle
                        cx={node.cx}
                        cy={node.cy}
                        r="8"
                        className="vt-media-signal-node-glow"
                        animate={
                          reducedMotion
                            ? undefined
                            : {
                                scale: [0.7, 1.6, 0.7],
                                opacity: [0.28, 0, 0.28],
                              }
                        }
                        transition={
                          reducedMotion
                            ? undefined
                            : {
                                duration: 2.8,
                                repeat: Infinity,
                                ease: 'easeOut',
                                delay: index * 0.28,
                              }
                        }
                      />
                    </g>
                  ),
                )}
                <motion.circle
                  className="vt-media-signal-packet-trail"
                  r="7"
                  animate={
                    reducedMotion
                      ? undefined
                      : {
                          cx: [58, 186, 332, 58],
                          cy: [112, 152, 74, 112],
                          opacity: [0.2, 0.46, 0.2, 0.2],
                        }
                  }
                  transition={
                    reducedMotion
                      ? undefined
                      : {
                          duration: 3.8,
                          repeat: Infinity,
                          ease: 'linear',
                        }
                  }
                />
                <motion.circle
                  className="vt-media-signal-packet"
                  r="3.3"
                  animate={
                    reducedMotion
                      ? undefined
                      : {
                          cx: [58, 186, 332, 58],
                          cy: [112, 152, 74, 112],
                          opacity: [0.75, 1, 0.75, 0.75],
                        }
                  }
                  transition={
                    reducedMotion
                      ? undefined
                      : {
                          duration: 3.8,
                          repeat: Infinity,
                          ease: 'linear',
                        }
                  }
                />
                <motion.circle
                  className="vt-media-signal-packet-trail vt-media-signal-packet-trail-secondary"
                  r="6"
                  animate={
                    reducedMotion
                      ? undefined
                      : {
                          cx: [86, 186, 286, 86],
                          cy: [228, 152, 236, 228],
                          opacity: [0.16, 0.36, 0.16, 0.16],
                        }
                  }
                  transition={
                    reducedMotion
                      ? undefined
                      : {
                          duration: 4.6,
                          repeat: Infinity,
                          ease: 'linear',
                          delay: 0.75,
                        }
                  }
                />
                <motion.circle
                  className="vt-media-signal-packet vt-media-signal-packet-secondary"
                  r="3"
                  animate={
                    reducedMotion
                      ? undefined
                      : {
                          cx: [86, 186, 286, 86],
                          cy: [228, 152, 236, 228],
                          opacity: [0.68, 0.98, 0.68, 0.68],
                        }
                  }
                  transition={
                    reducedMotion
                      ? undefined
                      : {
                          duration: 4.6,
                          repeat: Infinity,
                          ease: 'linear',
                          delay: 0.75,
                        }
                  }
                />
              </motion.svg>
          </motion.figure>
        ))}
      </div>
    </motion.section>
  );
}
