import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { navigationLinks } from '../data/navigation.js';
import { useOperationsStore } from '../store/index.js';

export default function CommandPalette() {
  const location = useLocation();
  const navigate = useNavigate();
  const isOpen = useOperationsStore((state) => state.commandPaletteOpen);
  const setOpen = useOperationsStore((state) => state.setCommandPaletteOpen);
  const [query, setQuery] = useState('');

  useEffect(() => {
    function onKeydown(event) {
      const isHotkey =
        (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';

      if (!isHotkey) {
        return;
      }

      event.preventDefault();
      setOpen(!isOpen);
    }

    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, [isOpen, setOpen]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return navigationLinks;
    }

    return navigationLinks.filter((item) =>
      item.label.toLowerCase().includes(term),
    );
  }, [query]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="vt-command-palette" role="dialog" aria-modal="true">
      <button
        type="button"
        className="vt-command-backdrop"
        aria-label="Close command palette"
        onClick={() => {
          setOpen(false);
          setQuery('');
        }}
      />

      <div className="vt-command-panel">
        <label className="vt-command-input-wrap" htmlFor="vt-command-input">
          <Search size={16} aria-hidden="true" />
          <input
            id="vt-command-input"
            autoFocus
            placeholder="Jump to route, command, or module"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <ul className="vt-command-results" role="listbox">
          {results.map((item) => {
            const active = location.pathname === item.to;

            return (
              <li key={item.to}>
                <button
                  type="button"
                  className={
                    active ? 'vt-command-item is-active' : 'vt-command-item'
                  }
                  onClick={() => {
                    navigate(item.to);
                    setOpen(false);
                    setQuery('');
                  }}
                >
                  <span>{item.label}</span>
                  <small>{item.to}</small>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
