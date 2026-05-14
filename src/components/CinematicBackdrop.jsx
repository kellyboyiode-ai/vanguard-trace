import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  cinematicFallbackMedia,
  cinematicRouteMedia,
} from '../data/cinematicMedia.js';
import { useAdaptiveMotion } from '../hooks/useAdaptiveMotion.js';

export default function CinematicBackdrop() {
  const location = useLocation();
  const { reducedMotion } = useAdaptiveMotion();
  const mediaSet = useMemo(
    () => cinematicRouteMedia[location.pathname] || cinematicFallbackMedia,
    [location.pathname],
  );
  const [sceneIndex, setSceneIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      return undefined;
    }

    const timer = setInterval(() => {
      setSceneIndex((current) => (current + 1) % mediaSet.length);
    }, 6800);

    return () => clearInterval(timer);
  }, [mediaSet.length, reducedMotion]);

  useEffect(() => {
    const preload = mediaSet.map((entry) => {
      const image = new Image();
      image.src = entry.asset;
      return image;
    });

    return () => {
      preload.forEach((image) => {
        image.src = '';
      });
    };
  }, [mediaSet]);

  const activeScene = mediaSet[sceneIndex % mediaSet.length];

  return (
    <div className="vt-cinematic-backdrop" aria-hidden="true">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${location.pathname}-${activeScene.id}`}
          className={`vt-scene ${activeScene.tone}`}
          style={{ backgroundImage: `url(${activeScene.asset})` }}
          initial={{
            opacity: 0,
            filter: reducedMotion ? 'blur(5px)' : 'blur(18px)',
            scale: reducedMotion ? 1.01 : 1.08,
          }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
          exit={{
            opacity: 0,
            filter: reducedMotion ? 'blur(5px)' : 'blur(16px)',
            scale: reducedMotion ? 1 : 1.04,
          }}
          transition={{
            duration: reducedMotion ? 0.42 : 0.9,
            ease: 'easeInOut',
          }}
        >
          <div className="vt-scene-overlay vt-scene-overlay-a" />
          <div className="vt-scene-overlay vt-scene-overlay-b" />
        </motion.div>
      </AnimatePresence>
      <div className="vt-cinematic-grid" />
      <div className="vt-cinematic-radial" />
      <p className="vt-cinematic-caption">{activeScene.headline}</p>
    </div>
  );
}
