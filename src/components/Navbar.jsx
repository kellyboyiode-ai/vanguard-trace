import { NavLink } from 'react-router-dom';
import { navigationLinks } from '../data/navigation.js';

export default function Navbar() {
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
    </nav>
  );
}
