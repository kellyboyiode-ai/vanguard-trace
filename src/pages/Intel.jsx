import { ShellLayout } from '../layouts/index.js';

export default function Intel() {
  return (
    <ShellLayout
      eyebrow="Intel"
      title="Threat and route intelligence"
      description="Monitor global events, corridor alerts, and shipment risk signals in one operational view."
    >
      <div className="panel-grid single-column">
        <section className="panel">
          <div className="panel-header">
            <h2>Intelligence feed</h2>
            <p>Correlated from route telemetry and external advisories</p>
          </div>

          <div className="settings-grid">
            <div>
              <span>Active advisories</span>
              <strong>4</strong>
            </div>
            <div>
              <span>High-risk corridors</span>
              <strong>2</strong>
            </div>
            <div>
              <span>Last sync</span>
              <strong>2 min ago</strong>
            </div>
          </div>
        </section>
      </div>
    </ShellLayout>
  );
}
