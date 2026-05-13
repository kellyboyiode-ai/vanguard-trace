import { useEffect, useRef, useState } from 'react';
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
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
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

  useEffect(() => {
    if (!mobileOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const menuElement = menuRef.current;
    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusables = menuElement
      ? Array.from(menuElement.querySelectorAll(focusableSelector))
      : [];

    if (focusables.length > 0) {
      focusables[0].focus();
    }

    function closeMenu() {
      setMobileOpen(false);
      requestAnimationFrame(() => {
        toggleRef.current?.focus();
      });
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== 'Tab' || !menuElement) {
        return;
      }

      const currentFocusables = Array.from(
        menuElement.querySelectorAll(focusableSelector),
      );

      if (currentFocusables.length === 0) {
        return;
      }

      const first = currentFocusables[0];
      const last = currentFocusables[currentFocusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function onPointerDown(event) {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (
        menuElement &&
        !menuElement.contains(target) &&
        !toggleRef.current?.contains(target)
      ) {
        closeMenu();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [mobileOpen]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      return undefined;
    }

    function onResize() {
      if (window.innerWidth > 980) {
        setMobileOpen(false);
      }
    }

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [mobileOpen]);

  return (
    <nav className="navbar" aria-label="Primary navigation">
      <button
        ref={toggleRef}
        type="button"
        className="navbar-mobile-toggle"
        onClick={() => setMobileOpen((state) => !state)}
        aria-expanded={mobileOpen}
        aria-controls="navbar-menu"
        aria-label={
          mobileOpen ? 'Close navigation menu' : 'Open navigation menu'
        }
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        <span>Menu</span>
      </button>

      <div
        ref={menuRef}
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
