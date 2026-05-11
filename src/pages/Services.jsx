import { ShellLayout } from '../layouts/index.js';

export default function Services() {
  return (
    <ShellLayout
      eyebrow="Services"
      title="Logistics service modules"
      description="Compose shipment intelligence, compliance checks, and monitoring services based on operational needs."
    >
      <div className="panel-grid single-column">
        <section className="panel">
          <div className="panel-header">
            <h2>Service availability</h2>
            <p>Current module health and status</p>
          </div>

          <div className="settings-grid">
            <div>
              <span>Monitoring API</span>
              <strong>Operational</strong>
            </div>
            <div>
              <span>Risk engine</span>
              <strong>Operational</strong>
            </div>
            <div>
              <span>Event webhook gateway</span>
              <strong>Degraded</strong>
            </div>
          </div>
        </section>
      </div>
    </ShellLayout>
  );
}
