import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

const sceneMap = {
  '/': ['scene-globe', 'scene-satellite', 'scene-port'],
  '/home': ['scene-port', 'scene-air', 'scene-warehouse'],
  '/tracking': ['scene-container', 'scene-corridor', 'scene-radar'],
  '/operations': ['scene-truck', 'scene-terminal', 'scene-radar'],
  '/services': ['scene-cyber', 'scene-grid', 'scene-satellite'],
  '/intel': ['scene-dataflow', 'scene-cyber', 'scene-globe'],
  '/contact': ['scene-network', 'scene-office', 'scene-grid'],
  '/about': ['scene-orbit', 'scene-grid', 'scene-network'],
  '/traces': ['scene-radar', 'scene-globe', 'scene-dataflow'],
  '/settings': ['scene-cyber', 'scene-grid', 'scene-orbit'],
};

function resolveScenes(pathname) {
  return sceneMap[pathname] || ['scene-globe', 'scene-grid', 'scene-orbit'];
}

export default function CinematicBackdrop() {
  const location = useLocation();
  const scenes = useMemo(
    () => resolveScenes(location.pathname),
    [location.pathname],
  );
  const [sceneIndex, setSceneIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSceneIndex((current) => (current + 1) % scenes.length);
    }, 6400);

    return () => clearInterval(timer);
  }, [scenes.length]);

  return (
    <div className="vt-cinematic-backdrop" aria-hidden="true">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${location.pathname}-${sceneIndex}`}
          className={`vt-scene ${scenes[sceneIndex % scenes.length]}`}
          initial={{ opacity: 0, filter: 'blur(18px)', scale: 1.08 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
          exit={{ opacity: 0, filter: 'blur(16px)', scale: 1.04 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      </AnimatePresence>
      <div className="vt-cinematic-grid" />
      <div className="vt-cinematic-radial" />
    </div>
  );
}
