import { ShellLayout } from '../layouts/index.js';

export default function Operations() {
  return (
    <ShellLayout
      eyebrow="Operations"
      title="Operational control center"
      description="Coordinate teams, route decisions, and response workflows from a single operations panel."
    >
      <div className="panel-grid single-column">
        <section className="panel">
          <div className="panel-header">
            <h2>Operations queue</h2>
            <p>Priority actions awaiting review</p>
          </div>

          <ul className="route-list">
            <li>
              <span>Reroute approval</span>
              <span>3 open</span>
            </li>
            <li>
              <span>Customs clearance checks</span>
              <span>9 open</span>
            </li>
            <li>
              <span>Carrier handoff audits</span>
              <span>5 open</span>
            </li>
          </ul>
        </section>
      </div>
    </ShellLayout>
  );
}
