import { useMemo, useState } from 'react';
import { getMediaCoverageSummary } from '../data/premiumMediaLibrary.js';

export default function MediaCoverageDebug() {
  if (!import.meta.env.DEV) {
    return null;
  }

  const [open, setOpen] = useState(false);
  const summary = useMemo(() => getMediaCoverageSummary(), []);

  return (
    <aside
      className={open ? 'vt-media-debug vt-media-debug-open' : 'vt-media-debug'}
    >
      <button
        type="button"
        className="vt-media-debug-toggle"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        Media Coverage
      </button>

      {open && (
        <div className="vt-media-debug-panel">
          <p>{`Total assets: ${summary.total}`}</p>
          <p>{`Home transmission: ${summary.transmissionCount}`}</p>
          <p>{`Assigned to pages: ${summary.assignedCount}`}</p>
          <p>{`Unassigned: ${summary.unassignedCount}`}</p>

          <ul>
            {summary.perPageCounts.map((entry) => (
              <li key={entry.pageKey}>
                <span>{entry.pageKey}</span>
                <strong>{`${entry.count} (w${entry.weight})`}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
