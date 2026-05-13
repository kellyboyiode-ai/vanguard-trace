import { ShellLayout } from '../layouts/index.js';

export default function About() {
  return (
    <ShellLayout
      eyebrow="About Vanguard Trace"
      title="Global freight security reimagined"
      description="Enterprise-grade shipment intelligence for secure supply chains."
    >
      <div className="panel-grid single-column">
        <section className="panel">
          <div className="panel-header">
            <h2>Our mission</h2>
          </div>
          <p>
            Vanguard Trace provides real-time visibility and intelligence for
            global logistics networks. We combine encrypted shipment telemetry,
            geopolitical risk assessment, and predictive routing to protect
            supply chains from disruption and loss.
          </p>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>What we do</h2>
          </div>
          <ul className="route-list">
            <li>
              <span>End-to-end shipment tracking</span>
              <span>Tamper-proof container monitoring and custody chains</span>
            </li>
            <li>
              <span>Risk and threat intelligence</span>
              <span>
                Corridor scoring with geopolitical and regulatory overlays
              </span>
            </li>
            <li>
              <span>Operational coordination</span>
              <span>
                Real-time routing, carrier management, and incident response
              </span>
            </li>
            <li>
              <span>Compliance automation</span>
              <span>Customs, sanctions, and regulatory intelligence feeds</span>
            </li>
          </ul>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Enterprise integration</h2>
          </div>
          <p>
            Vanguard Trace integrates with customs authorities, port operators,
            carrier networks, and regulatory bodies. Our API-first architecture
            enables seamless integration with existing logistics management
            systems and enterprise workflows.
          </p>
        </section>

        <section id="leadership" className="panel">
          <div className="panel-header">
            <h2>Leadership team</h2>
          </div>
          <p>
            Our leadership team brings decades of experience across global
            logistics, supply chain security, and enterprise technology.
          </p>
        </section>

        <section id="history" className="panel">
          <div className="panel-header">
            <h2>History</h2>
          </div>
          <p>
            Founded to address the growing complexity and risk in global
            freight, Vanguard Trace has grown from a specialist monitoring
            service into a full-spectrum supply chain intelligence platform.
          </p>
        </section>

        <section id="values" className="panel">
          <div className="panel-header">
            <h2>Our values</h2>
          </div>
          <ul className="route-list">
            <li>
              <span>Transparency</span>
              <span>Honest, real-time reporting for every shipment</span>
            </li>
            <li>
              <span>Security</span>
              <span>Zero-compromise approach to data and cargo protection</span>
            </li>
            <li>
              <span>Resilience</span>
              <span>Built to perform under disruption and uncertainty</span>
            </li>
          </ul>
        </section>

        <section id="careers" className="panel">
          <div className="panel-header">
            <h2>Careers</h2>
          </div>
          <p>
            We are building the future of freight intelligence. If you are
            passionate about logistics, security, or data engineering, we want
            to hear from you.
          </p>
        </section>
      </div>
    </ShellLayout>
  );
}
