import { NavLink } from 'react-router-dom';

const footerColumns = [
  {
    heading: 'Quotation and Book Tools',
    links: [
      {
        to: 'https://portal.vanguardlogistics.com/apps/ui/#/adesso',
        label: 'Vanguard ADESSO',
        external: true,
      },
      {
        to: 'https://portal.vanguardlogistics.com/apps/ocean-booking/',
        label: 'Ocean Booking',
        external: true,
      },
      {
        to: 'https://portal.vanguardlogistics.com/apps/sailing-schedule/',
        label: 'Sailing Schedule',
        external: true,
      },
      {
        to: 'https://portal.vanguardlogistics.com/apps/dashboard/?login=Y&mod=1DA358DF153386C0A920220E2670594622ED6024',
        label: 'vRate Calculator',
        external: true,
      },
      {
        to: 'https://portal.vanguardlogistics.com/apps/dashboard/?login=Y&mod=FC714E7FC4F7AD193AABB32D588769C2FAE5D448',
        label: 'Shiprite',
        external: true,
      },
      {
        to: 'https://portal.vanguardlogistics.com/apps/shiprite-on-demand/',
        label: 'Shiprite on Demand',
        external: true,
      },
      {
        to: 'https://portal.vanguardlogistics.com/apps/efulfillment-connect/',
        label: 'eFulfillment Connect',
        external: true,
      },
      {
        to: 'https://portal.vanguardlogistics.com/apps/measurement-calculator/',
        label: 'Measurement Calculator',
        external: true,
      },
    ],
  },
  {
    heading: 'Manage Shipment Tools',
    links: [
      {
        to: 'https://portal.vanguardlogistics.com/apps/freight-availability/',
        label: 'Freight Availability',
        external: true,
      },
      {
        to: 'https://portal.vanguardlogistics.com/apps/track-shipment/',
        label: 'Track & Trace',
        external: true,
      },
      {
        to: 'https://portal.vanguardlogistics.com/',
        label: 'IMO 2020 Calculator',
        external: true,
      },
      {
        to: 'https://portal.vanguardlogistics.com/apps/freight-release/',
        label: 'Freight Release',
        external: true,
      },
      {
        to: 'https://www.vanguardlogistics.com/tracking-results?tracking=',
        label: 'Quick Track',
        external: true,
      },
      {
        to: 'https://portal.vanguardlogistics.com/apps/shipment-status/',
        label: 'Statusmate',
        external: true,
      },
      {
        to: 'https://portal.vanguardlogistics.com/apps/verified-gross-mass/',
        label: 'Solas VGM',
        external: true,
      },
      {
        to: 'https://portal.vanguardlogistics.com/apps/cargo-release-order/',
        label: 'Cargo Release Order',
        external: true,
      },
    ],
  },
  {
    heading: 'Documentation Tools',
    links: [
      {
        to: 'https://portal.vanguardlogistics.com/apps/create-sli/',
        label: 'Create SLI',
        external: true,
      },
      {
        to: 'https://portal.vanguardlogistics.com/apps/documentation/',
        label: 'Documentation Portal',
        external: true,
      },
      {
        to: 'https://portal.vanguardlogistics.com/apps/extranet/',
        label: 'Useful Information',
        external: true,
      },
      {
        to: 'https://portal.vanguardlogistics.com/apps/customer-advisory/',
        label: 'Customer / Agent Advisory',
        external: true,
      },
      {
        to: 'https://portal.vanguardlogistics.com/apps/print-labels/',
        label: 'Print Shipping Labels',
        external: true,
      },
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
        to: 'https://www.vanguardlogistics.com/usa-brokerage-terms',
        label: 'USA Brokerage Terms and Conditions',
        external: true,
      },
      {
        to: 'https://www.vanguardlogistics.com/usa-terms-service',
        label: 'USA Terms and Conditions of Service',
        external: true,
      },
      {
        to: 'https://www.vanguardlogistics.com/au-terms-service',
        label: 'AU Standard Trading Conditions',
        external: true,
      },
      {
        to: 'https://www.vanguardlogistics.com/nz-terms-service',
        label: 'NZ trade terms',
        external: true,
      },
      {
        to: 'https://www.vanguardlogistics.com/au-nz-downloadable-resources',
        label: 'AU/NZ Downloadable Resources',
        external: true,
      },
      {
        to: 'https://www.vanguardlogistics.com/whistleblower-hotline',
        label: 'Whistleblower Hotline',
        external: true,
      },
    ],
  },
  {
    heading: 'Admin and Help',
    links: [
      {
        to: 'https://www.vanguardlogistics.com/contact-us',
        label: 'Contact Us',
        external: true,
      },
      {
        to: 'https://portal.vanguardlogistics.com/apps/signup/',
        label: 'Request a Login',
        external: true,
      },
      {
        to: 'https://portal.vanguardlogistics.com/apps/user/get-password.jsp',
        label: 'Forgot Password',
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
  {
    to: 'https://www.linkedin.com/company/vanguard-logistics-services',
    label: 'LinkedIn',
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
