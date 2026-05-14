import { Activity, Compass, Home, Shield, Truck } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const mobileLinks = [
  { to: '/', label: 'Ops', Icon: Home },
  { to: '/tracking', label: 'Track', Icon: Truck },
  { to: '/operations', label: 'Fleet', Icon: Compass },
  { to: '/intel', label: 'Intel', Icon: Activity },
  { to: '/settings', label: 'Secure', Icon: Shield },
];

export default function MobileOpsDock() {
  return (
    <nav className="vt-mobile-dock" aria-label="Mobile operations navigation">
      {mobileLinks.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            isActive ? 'vt-mobile-dock-item is-active' : 'vt-mobile-dock-item'
          }
        >
          <Icon size={16} aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
