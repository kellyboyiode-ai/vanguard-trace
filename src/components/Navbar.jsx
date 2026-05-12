import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { navigationLinks } from '../data/navigation.js';
import { signOut } from '../services/authService.js';

export default function Navbar() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();

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
      {navigationLinks.map((item) => (
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

      <button
        type="button"
        className="navbar-logout"
        onClick={handleSignOut}
        disabled={isSigningOut}
      >
        {isSigningOut ? 'Signing out...' : 'Logout'}
      </button>
    </nav>
  );
}
