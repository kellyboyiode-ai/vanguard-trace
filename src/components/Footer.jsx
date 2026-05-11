export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">VANGUARD TRACE</h3>
          <p className="footer-desc">
            Global supply chain intelligence and real-time shipment tracking.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Navigation</h4>
          <ul className="footer-links">
            <li>
              <a href="/">Overview</a>
            </li>
            <li>
              <a href="/home">Home</a>
            </li>
            <li>
              <a href="/tracking">Tracking</a>
            </li>
            <li>
              <a href="/operations">Operations</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Services</h4>
          <ul className="footer-links">
            <li>
              <a href="/services">Services</a>
            </li>
            <li>
              <a href="/intel">Intelligence</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
            <li>
              <a href="/traces">Traces</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Account</h4>
          <ul className="footer-links">
            <li>
              <a href="/settings">Settings</a>
            </li>
            <li>
              <a href="#privacy">Privacy</a>
            </li>
            <li>
              <a href="#terms">Terms</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © 2013 Vanguard Trace. All rights reserved.
        </p>
        <p className="footer-tagline">
          Global intelligence. Real-time tracking. Enterprise security.
        </p>
      </div>
    </footer>
  );
}
