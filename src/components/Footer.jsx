import { NavLink } from 'react-router-dom';

const footerColumns = [
  {
    heading: 'Quotation and Book Tools',
    links: [
      { to: '/home', label: 'Vanguard ADESSO' },
      { to: '/services', label: 'Services Overview' },
      { to: '/operations', label: 'Operations Planning' },
      { to: '/tracking', label: 'Sailing Schedules' },
    ],
  },
  {
    heading: 'Manage Shipment Tools',
    links: [
      { to: '/tracking', label: 'Track & Trace' },
      { to: '/traces', label: 'Freight Availability' },
      { to: '/intel', label: 'Status Insights' },
      { to: '/operations', label: 'Release Workflows' },
    ],
  },
  {
    heading: 'Documentation Tools',
    links: [
      { to: '/services', label: 'Shipping Instructions' },
      { to: '/contact', label: 'Document Support' },
      { to: '/intel', label: 'Customer Advisories' },
      { to: '/about', label: 'Useful Information' },
    ],
  },
  {
    heading: 'Admin and Help',
    links: [
      { to: '/contact', label: 'Contact Us' },
      { to: '/settings', label: 'Account Settings' },
      { to: '/about', label: 'About Vanguard Trace' },
      { to: '/traces', label: 'System Traces' },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <section className="footer-nav-grid" aria-label="Footer navigation">
        {footerColumns.map((column) => (
          <article key={column.heading} className="footer-nav-column">
            <h4>{column.heading}</h4>
            <ul>
              {column.links.map((link) => (
                <li key={`${column.heading}-${link.label}`}>
                  <NavLink to={link.to}>{link.label}</NavLink>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">VANGUARD TRACE</h3>
          <p className="footer-desc">
            Global supply chain intelligence and real-time shipment tracking.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Company</h4>
          <ul className="footer-links">
            <li>
              <NavLink to="/">Overview</NavLink>
            </li>
            <li>
              <NavLink to="/home">Home</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Services</h4>
          <ul className="footer-links">
            <li>
              <NavLink to="/services">Services</NavLink>
            </li>
            <li>
              <NavLink to="/intel">Intelligence</NavLink>
            </li>
            <li>
              <NavLink to="/tracking">Tracking</NavLink>
            </li>
            <li>
              <NavLink to="/operations">Operations</NavLink>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Legal</h4>
          <ul className="footer-links">
            <li>
              <NavLink to="/settings">Settings</NavLink>
            </li>
            <li>
              <a href="#privacy">Privacy Policy</a>
            </li>
            <li>
              <a href="#terms">Terms of Use</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © {year} Vanguard Trace. All rights reserved.
        </p>
        <p className="footer-tagline">
          Global intelligence. Real-time tracking. Enterprise security.
        </p>
      </div>
    </footer>
  );
}
