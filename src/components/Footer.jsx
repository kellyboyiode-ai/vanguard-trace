import { NavLink } from 'react-router-dom';
import {
  FOOTER_BOTTOM_LINKS,
  FOOTER_COLUMNS,
} from '../constants/externalLinks.js';

const footerColumns = FOOTER_COLUMNS;
const footerBottomLinks = FOOTER_BOTTOM_LINKS;

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

function formatBuildTimestamp(value) {
  if (!value) {
    return 'unknown';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'unknown';
  }

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: 'UTC',
  }).format(parsed);
}

export default function Footer() {
  const year = new Date().getFullYear();
  const buildTimestamp = import.meta.env.VITE_BUILD_TIMESTAMP;
  const buildCommit = import.meta.env.VITE_BUILD_COMMIT || 'unknown';
  const buildBranch = import.meta.env.VITE_BUILD_BRANCH || 'unknown';
  const buildDirty = import.meta.env.VITE_BUILD_DIRTY === 'true';

  const deploymentLabel = [
    `Deployed: ${formatBuildTimestamp(buildTimestamp)} UTC`,
    `Commit: ${buildCommit}`,
    `Branch: ${buildBranch}`,
    buildDirty ? 'Dirty tree build' : 'Clean tree build',
  ].join(' | ');

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
        <p className="footer-deploy-banner" title={deploymentLabel}>
          {deploymentLabel}
        </p>
      </div>
    </footer>
  );
}
