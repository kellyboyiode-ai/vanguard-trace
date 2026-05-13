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
  {
    heading: 'Legal and Documentation',
    links: [
      {
        to: 'https://www.vanguardlogistics.com/bill-of-lading-tc',
        label: 'Bill of Lading Terms',
        external: true,
      },
      {
        to: 'https://www.vanguardlogistics.com/fmc-tariff-links',
        label: 'FMC Tariffs',
        external: true,
      },
      {
        to: 'https://www.vanguardlogistics.com/terms-and-conditions',
        label: 'Website Terms of Use',
        external: true,
      },
      {
        to: 'https://www.vanguardlogistics.com/privacy-policy',
        label: 'Privacy Policy',
        external: true,
      },
    ],
  },
];

const footerBottomLinks = [
  {
    to: 'https://www.vanguardlogistics.com/terms-and-conditions',
    label: 'Terms of Use',
    external: true,
  },
  {
    to: 'https://www.vanguardlogistics.com/cookie-policy',
    label: 'Cookies Policy',
    external: true,
  },
  {
    to: 'https://www.vanguardlogistics.com/privacy-policy',
    label: 'Privacy Policy',
    external: true,
  },
  {
    to: 'https://www.vanguardlogistics.com/whistleblower-hotline',
    label: 'Whistleblower Hotline',
    external: true,
  },
];

function FooterLink({ to, label, external = false }) {
  if (external) {
    return (
      <a href={to} target="_blank" rel="noreferrer">
        {label}
      </a>
    );
  }

  return <NavLink to={to}>{label}</NavLink>;
}

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
                  <FooterLink
                    to={link.to}
                    label={link.label}
                    external={link.external}
                  />
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
            {footerBottomLinks.slice(0, 3).map((link) => (
              <li key={`legal-${link.label}`}>
                <FooterLink
                  to={link.to}
                  label={link.label}
                  external={link.external}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-links">
          {footerBottomLinks.map((link) => (
            <FooterLink
              key={`bottom-${link.label}`}
              to={link.to}
              label={link.label}
              external={link.external}
            />
          ))}
        </div>
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
