import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { navigationLinks } from '../data/navigation.js';
import { signOut } from '../services/authService.js';

const desktopMenus = [
  {
    id: 'services',
    label: 'Services',
    links: [
      { href: '/services', text: 'Overview' },
      { href: '/services', text: 'Airfreight' },
      { href: '/services', text: 'CFS & Warehouse' },
      { href: '/services', text: 'Customs Services' },
      { href: '/services', text: 'FCL Ocean Freight' },
      { href: '/services', text: 'LCL Consolidation' },
      { href: '/services', text: 'Technology Solutions' },
    ],
  },
  {
    id: 'company',
    label: 'Our Company',
    links: [
      { href: '/about', text: 'About Us' },
      { href: '/about', text: 'Leadership Team' },
      { href: '/about', text: 'History' },
      { href: '/about', text: 'Our Values' },
    ],
  },
  {
    id: 'insights',
    label: 'Insights',
    links: [
      { href: '/intel', text: 'News and Articles' },
      { href: '/intel', text: 'General Rate Increases' },
      { href: '/intel', text: 'Customer Advisories' },
      { href: '/intel', text: 'Market Updates' },
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    links: [
      { href: '/contact', text: 'Contact Us' },
      { href: '/contact', text: 'Locations' },
    ],
  },
];

const mobileQuickTools = [
  {
    href: 'https://portal.vanguardlogistics.com/apps/track-shipment/',
    text: 'Track & Trace Tool',
  },
  {
    href: 'https://portal.vanguardlogistics.com/apps/sailing-schedule/',
    text: 'Sailing Schedule',
  },
  {
    href: 'https://portal.vanguardlogistics.com/apps/documentation/',
    text: 'Documentation Portal',
  },
];

export default function Navbar() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMenuView, setMobileMenuView] = useState('root');
  const [openDesktopMenu, setOpenDesktopMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const desktopNavRef = useRef(null);
  const navigate = useNavigate();

  const primaryLinks = navigationLinks.slice(0, 4);
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
      setMobileMenuView('root');
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
    function onPointerDown(event) {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (desktopNavRef.current && !desktopNavRef.current.contains(target)) {
        setOpenDesktopMenu(null);
      }
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setOpenDesktopMenu(null);
      }
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

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
        setMobileMenuView('root');
      }
    }

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [mobileOpen]);

  function isExternalLink(href) {
    return href.startsWith('http://') || href.startsWith('https://');
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    const cleaned = searchTerm.trim();
    if (!cleaned) {
      return;
    }

    navigate(`/intel?query=${encodeURIComponent(cleaned)}`);
    setSearchTerm('');
  }

  function handleMobileNavigate() {
    setMobileOpen(false);
    setMobileMenuView('root');
  }

  const activeMobileGroup =
    mobileMenuView === 'root'
      ? null
      : (desktopMenus.find((menu) => menu.id === mobileMenuView) ?? null);

  return (
    <nav className="navbar" aria-label="Primary navigation">
      <div className="navbar-desktop" ref={desktopNavRef}>
        <div className="navbar-primary">
          {primaryLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                isActive ? 'navbar-link navbar-link-active' : 'navbar-link'
              }
            >
              {item.label}
            </NavLink>
          ))}

          {desktopMenus.map((menu) => (
            <div key={menu.id} className="navbar-dd-wrap">
              <button
                type="button"
                className={
                  openDesktopMenu === menu.id
                    ? 'navbar-dd-toggle navbar-dd-toggle-open'
                    : 'navbar-dd-toggle'
                }
                aria-expanded={openDesktopMenu === menu.id}
                aria-haspopup="menu"
                onClick={() =>
                  setOpenDesktopMenu((current) =>
                    current === menu.id ? null : menu.id,
                  )
                }
              >
                {menu.label}
              </button>

              {openDesktopMenu === menu.id && (
                <div
                  className="navbar-dd-panel"
                  role="menu"
                  aria-label={menu.label}
                >
                  {menu.links.map((link) => {
                    if (isExternalLink(link.href)) {
                      return (
                        <a
                          key={`${menu.id}-${link.text}`}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          role="menuitem"
                          onClick={() => setOpenDesktopMenu(null)}
                        >
                          {link.text}
                        </a>
                      );
                    }

                    return (
                      <NavLink
                        key={`${menu.id}-${link.text}`}
                        to={link.href}
                        role="menuitem"
                        onClick={() => setOpenDesktopMenu(null)}
                      >
                        {link.text}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          <NavLink to="/about" className="navbar-link">
            Careers
          </NavLink>
        </div>

        <div className="navbar-utility">
          <form className="navbar-search" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search field"
              placeholder="Search"
            />
          </form>

          {utilityLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'navbar-link navbar-link-active' : 'navbar-link'
              }
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

      <button
        ref={toggleRef}
        type="button"
        className="navbar-mobile-toggle"
        onClick={() => {
          setMobileOpen((state) => {
            const next = !state;
            if (!next) {
              setMobileMenuView('root');
            }
            return next;
          });
        }}
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
        {mobileMenuView === 'root' ? (
          <>
            <div className="navbar-primary">
              {primaryLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    isActive ? 'navbar-link navbar-link-active' : 'navbar-link'
                  }
                  onClick={handleMobileNavigate}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="navbar-mobile-drawer" aria-label="Main sections">
              {desktopMenus.map((menu) => (
                <button
                  key={menu.id}
                  type="button"
                  className="navbar-drawer-trigger"
                  onClick={() => setMobileMenuView(menu.id)}
                >
                  <span>{menu.label}</span>
                  <span aria-hidden="true">{'>'}</span>
                </button>
              ))}
            </div>

            <div className="navbar-mobile-tools" aria-label="Quick tools">
              <p>Quick Tools</p>
              {mobileQuickTools.map((tool) => (
                <a
                  key={tool.href}
                  href={tool.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {tool.text}
                </a>
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
                  onClick={handleMobileNavigate}
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
          </>
        ) : (
          <div className="navbar-mobile-submenu">
            <button
              type="button"
              className="navbar-drawer-back"
              onClick={() => setMobileMenuView('root')}
            >
              <span aria-hidden="true">{'<'}</span>
              <span>Back</span>
            </button>

            <p className="navbar-mobile-submenu-title">
              {activeMobileGroup?.label ?? 'Navigation'}
            </p>

            <div className="navbar-mobile-submenu-links" role="menu">
              {(activeMobileGroup?.links ?? []).map((link) => {
                if (isExternalLink(link.href)) {
                  return (
                    <a
                      key={`${activeMobileGroup?.id ?? 'mobile'}-${link.text}`}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      role="menuitem"
                      onClick={handleMobileNavigate}
                    >
                      {link.text}
                    </a>
                  );
                }

                return (
                  <NavLink
                    key={`${activeMobileGroup?.id ?? 'mobile'}-${link.text}`}
                    to={link.href}
                    role="menuitem"
                    onClick={handleMobileNavigate}
                  >
                    {link.text}
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
