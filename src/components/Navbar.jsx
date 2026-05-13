import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { navigationLinks } from '../data/navigation.js';
import { signOut } from '../services/authService.js';

const featuredGroups = [
  {
    label: 'Services',
    links: [
      { href: '/services', text: 'Overview' },
      { href: '/tracking', text: 'Track & Trace' },
      { href: '/operations', text: 'Operations' },
    ],
  },
  {
    label: 'Company',
    links: [
      { href: '/about', text: 'About Us' },
      { href: '/contact', text: 'Contact' },
      { href: '/intel', text: 'Insights' },
    ],
  },
];

export default function Navbar() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const primaryLinks = navigationLinks.slice(0, 6);
  const utilityLinks = navigationLinks.slice(6);

  async function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);
    await signOut();
    navigate('/login', { replace: true });
  }

  return (
    <nav className="navbar" aria-label="Primary navigation">
      <button
        type="button"
        className="navbar-mobile-toggle"
        onClick={() => setMobileOpen((state) => !state)}
        aria-expanded={mobileOpen}
        aria-controls="navbar-menu"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        <span>Menu</span>
      </button>

      <div
        id="navbar-menu"
        className={mobileOpen ? 'navbar-menu navbar-menu-open' : 'navbar-menu'}
      >
        <div className="navbar-primary">
          {primaryLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                isActive ? 'navbar-link navbar-link-active' : 'navbar-link'
              }
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="navbar-groups" aria-label="Feature groups">
          {featuredGroups.map((group) => (
            <div key={group.label} className="navbar-group-card">
              <p>{group.label}</p>
              {group.links.map((link) => (
                <NavLink
                  key={`${group.label}-${link.href}`}
                  to={link.href}
                  className="navbar-group-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.text}
                </NavLink>
              ))}
            </div>
          ))}
        </div>

        <div className="navbar-utility">
          {utilityLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'navbar-link navbar-link-active' : 'navbar-link'
              }
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <button
            type="button"
            className="navbar-logout"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? 'Signing out...' : 'Logout'}
          </button>
        </div>
      </div>
    </nav>
  );
}
