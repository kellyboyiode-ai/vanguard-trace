import { useMemo } from 'react';
import { Activity, AlertTriangle, Route, Truck } from 'lucide-react';
import { useOperationsStore } from '../store/index.js';

const severityClass = {
  low: 'vt-severity-low',
  medium: 'vt-severity-medium',
  high: 'vt-severity-high',
};

function formatEventTime(iso) {
  const value = new Date(iso);
  if (Number.isNaN(value.getTime())) {
    return '--:-- UTC';
  }

  const hh = String(value.getUTCHours()).padStart(2, '0');
  const mm = String(value.getUTCMinutes()).padStart(2, '0');
  return `${hh}:${mm} UTC`;
}

export default function LiveStatusStrip() {
  const kpis = useOperationsStore((state) => state.kpis);
  const events = useOperationsStore((state) => state.events);
  const realtimeConnected = useOperationsStore(
    (state) => state.realtimeConnected,
  );
  const telemetrySource = useOperationsStore((state) => state.telemetrySource);

  const latestEvent = useMemo(() => events[0], [events]);

  return (
    <section className="vt-status-strip" aria-label="Live operations status">
      <ul className="vt-kpi-list">
        <li>
          <Route size={15} aria-hidden="true" />
          <span>Active</span>
          <strong>{kpis.activeShipments}</strong>
        </li>
        <li>
          <AlertTriangle size={15} aria-hidden="true" />
          <span>Delayed</span>
          <strong>{kpis.delayedShipments}</strong>
        </li>
        <li>
          <Truck size={15} aria-hidden="true" />
          <span>Fleet Online</span>
          <strong>{kpis.fleetOnline}%</strong>
        </li>
        <li>
          <Activity size={15} aria-hidden="true" />
          <span>Risk Index</span>
          <strong>{kpis.riskIndex}</strong>
        </li>
      </ul>

      <div className="vt-status-marquee" role="status" aria-live="polite">
        {latestEvent ? (
          <>
            <span
              className={`vt-severity-chip ${severityClass[latestEvent.severity] || severityClass.low}`}
            >
              {latestEvent.severity.toUpperCase()}
            </span>
            <span
              className={
                realtimeConnected
                  ? 'vt-severity-chip vt-severity-low'
                  : 'vt-severity-chip vt-severity-medium'
              }
            >
              {realtimeConnected ? 'LIVE' : telemetrySource.toUpperCase()}
            </span>
            <p>{latestEvent.message}</p>
            <time dateTime={latestEvent.at}>
              {formatEventTime(latestEvent.at)}
            </time>
          </>
        ) : (
          <p>Awaiting live telemetry...</p>
        )}
      </div>
    </section>
  );
}
