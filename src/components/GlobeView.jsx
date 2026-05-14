import { motion } from 'framer-motion';

const defaultRoutes = [
  { label: 'Lagos -> Rotterdam', status: 'stable' },
  { label: 'Shenzhen -> Dubai', status: 'watch' },
  { label: 'Houston -> Singapore', status: 'priority' },
];

export default function GlobeView({ routes = defaultRoutes }) {
  return (
    <section className="vt-globe-view" aria-label="Global 3D logistics tracking">
      <div className="vt-globe-orbit">
        <motion.div
          className="vt-globe-core"
          animate={{ rotate: 360 }}
          transition={{ duration: 46, repeat: Infinity, ease: 'linear' }}
        />
        <span className="vt-globe-glow" />
        <span className="vt-globe-ring vt-ring-a" />
        <span className="vt-globe-ring vt-ring-b" />
      </div>

      <ul className="vt-globe-routes">
        {routes.map((route) => (
          <li key={route.label} className={`vt-route-${route.status}`}>
            <span className="vt-route-pulse" aria-hidden="true" />
            {route.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
