import { useEffect, useState } from 'react';
import { ShellLayout } from '../layouts/index.js';
import { getTrackingByCode, getTrackingSummary } from '../services/index.js';
import '../styles/trackingLayout.css';

export default function Tracking() {
  const [trackingCode, setTrackingCode] = useState('VGX-44591');
  const [trackingData, setTrackingData] = useState({
    trackingCode: 'VGX-44591',
    status: 'VERIFIED',
    location: 'ROTTERDAM PORT',
    eta: '3 DAYS',
  });
  const [trackingMessage, setTrackingMessage] = useState('');
  const [trackingSource, setTrackingSource] = useState('demo');
  const [isSearching, setIsSearching] = useState(false);
  const [summary, setSummary] = useState({
    inTransit: 128,
    delayed: 6,
    deliveredToday: 43,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadSummary() {
      const result = await getTrackingSummary();

      if (isMounted) {
        setSummary(result.summary);
      }
    }

    loadSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleTrackSubmit(event) {
    event.preventDefault();
    setIsSearching(true);
    setTrackingMessage('');

    const result = await getTrackingByCode(trackingCode);

    if (result.data) {
      setTrackingData(result.data);
      setTrackingSource(result.source);
    }

    if (result.error) {
      setTrackingMessage(result.error);
    }

    setIsSearching(false);
  }

  return (
    <ShellLayout
      eyebrow="Tracking"
      title="End-to-end shipment tracking"
      description="Track lanes, milestones, and exceptions in real time across ports, depots, and last-mile handoffs."
    >
      <div className="panel-grid single-column">
        <section className="panel">
          <div className="panel-header">
            <h2>Live tracking summary</h2>
            <p>Current snapshot across monitored shipments</p>
          </div>

          <ul className="route-list">
            <li>
              <span>In transit</span>
              <span>{summary.inTransit}</span>
            </li>
            <li>
              <span>Delayed</span>
              <span>{summary.delayed}</span>
            </li>
            <li>
              <span>Delivered today</span>
              <span>{summary.deliveredToday}</span>
            </li>
          </ul>

          <form className="action-form" onSubmit={handleTrackSubmit}>
            <label className="form-label" htmlFor="trackingCode">
              Lookup shipment by tracking code
            </label>
            <div className="form-row">
              <input
                className="form-input"
                id="trackingCode"
                name="trackingCode"
                value={trackingCode}
                onChange={(event) => setTrackingCode(event.target.value)}
                placeholder="VGX-20391"
                autoComplete="off"
              />
              <button
                className="form-button"
                type="submit"
                disabled={isSearching}
              >
                {isSearching ? 'Checking...' : 'Track'}
              </button>
            </div>
            <p className="form-hint">
              {trackingSource === 'supabase'
                ? 'Live result from Supabase.'
                : 'Demo mode result.'}
            </p>
            {trackingMessage ? (
              <p className="form-error">{trackingMessage}</p>
            ) : null}
          </form>

          <article
            className="tracking-example"
            aria-label="Example tracking UI"
          >
            <p className="tracking-example-title">Tracking Result</p>

            <dl className="tracking-example-grid">
              <div>
                <dt>TRACK ID</dt>
                <dd>{trackingData.trackingCode}</dd>
              </div>
              <div>
                <dt>STATUS</dt>
                <dd className="tracking-status-verified">
                  {trackingData.status}
                </dd>
              </div>
              <div>
                <dt>LOCATION</dt>
                <dd>{trackingData.location}</dd>
              </div>
              <div>
                <dt>ETA</dt>
                <dd>{trackingData.eta}</dd>
              </div>
            </dl>
          </article>
        </section>
      </div>
    </ShellLayout>
  );
}
