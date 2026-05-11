import { NavLink } from 'react-router-dom';
import { SectionHeader, StatCard, TraceFeedItem } from '../components/index.js';
import { dashboardStats, traceFeed } from '../data/index.js';
import { ShellLayout } from '../layouts/index.js';

export default function OverviewPage() {
  return (
    <ShellLayout
      eyebrow="Vanguard Trace"
      title="Command center for global freight security"
      description="Real-time shipment monitoring, risk intelligence, and operational coordination across ports, carriers, and last-mile networks."
    >
      <div className="stats-grid">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <div className="panel-grid">
        <section className="panel">
          <SectionHeader
            title="Live shipment events"
            subtitle="Updated 2 minutes ago"
          />

          <div className="feed">
            {traceFeed.map((item) => (
              <TraceFeedItem
                key={item.title}
                title={item.title}
                description={item.description}
                status={item.status}
              />
            ))}
          </div>
        </section>

        <aside className="panel callout">
          <p className="panel-kicker">Next step</p>
          <h2>Monitor your first shipment</h2>
          <p>
            Connect tracking data sources, set risk thresholds, and enable real-time
            alerts across your logistics network.
          </p>
          <NavLink to="/tracking" className="button-link">
            Start tracking
          </NavLink>
        </aside>
      </div>
    </ShellLayout>
  );
}
