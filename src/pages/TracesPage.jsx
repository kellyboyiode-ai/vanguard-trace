import { useEffect, useState } from 'react';
import { FileUpload, SectionHeader } from '../components/index.js';
import { ShellLayout } from '../layouts/index.js';
import { getRouteMedians, getTraceTimeline } from '../services/index.js';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const defaultTraceTimeline = [
  { hour: '08:00', checkout: 1520, search: 2130, account: 1760 },
  { hour: '10:00', checkout: 1450, search: 2050, account: 1710 },
  { hour: '12:00', checkout: 1410, search: 2120, account: 1690 },
  { hour: '14:00', checkout: 1470, search: 2210, account: 1735 },
  { hour: '16:00', checkout: 1405, search: 2085, account: 1700 },
];

const defaultRouteMedians = [
  { route: '/checkout', median: 1400 },
  { route: '/search', median: 2100 },
  { route: '/account', median: 1700 },
];

export default function TracesPage() {
  const [traceTimeline, setTraceTimeline] = useState(defaultTraceTimeline);
  const [routeMedians, setRouteMedians] = useState(defaultRouteMedians);

  useEffect(() => {
    let mounted = true;

    async function loadTraceData() {
      const [timelineResult, mediansResult] = await Promise.all([
        getTraceTimeline(),
        getRouteMedians(),
      ]);

      if (!mounted) return;

      if (
        !timelineResult.error &&
        Array.isArray(timelineResult.data) &&
        timelineResult.data.length
      ) {
        setTraceTimeline(timelineResult.data);
      }

      if (
        !mediansResult.error &&
        Array.isArray(mediansResult.data) &&
        mediansResult.data.length
      ) {
        setRouteMedians(mediansResult.data);
      }
    }

    loadTraceData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ShellLayout
      eyebrow="Trace library"
      title="Investigate routes and regressions"
      description="Keep your performance work organized by route, release, and ownership."
    >
      <div className="panel-grid single-column">
        <section className="panel">
          <SectionHeader
            title="Routes under watch"
            subtitle="Three routes have active trace coverage"
          />

          <ul className="route-list">
            {routeMedians.map((item) => (
              <li key={item.route}>
                <span>{item.route}</span>
                <span>{`${item.median}ms median | trace coverage active`}</span>
              </li>
            ))}
          </ul>

          <div className="panel panel-nested">
            <h3>Route median trend (ms)</h3>
            <div className="chart-shell">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={traceTimeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="checkout" stroke="#1d4ed8" />
                  <Line type="monotone" dataKey="search" stroke="#ea580c" />
                  <Line type="monotone" dataKey="account" stroke="#0f766e" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="form-block">
            <FileUpload />
          </div>
        </section>
      </div>
    </ShellLayout>
  );
}
