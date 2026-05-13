import { useEffect, useState } from 'react';
import { ShellLayout } from '../layouts/index.js';
import { getIntelAlerts, getIntelRiskTrend } from '../services/index.js';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const defaultRiskTrend = [
  { day: 'Mon', risk: 31 },
  { day: 'Tue', risk: 27 },
  { day: 'Wed', risk: 35 },
  { day: 'Thu', risk: 42 },
  { day: 'Fri', risk: 33 },
  { day: 'Sat', risk: 29 },
  { day: 'Sun', risk: 26 },
];

const defaultActiveAlerts = [
  {
    corridor: 'Baltic Route C7',
    severity: 'High',
    advisory: 'Port strike risk rising in 48 hours.',
  },
  {
    corridor: 'Mediterranean M2',
    severity: 'Medium',
    advisory: 'Increased customs processing delays.',
  },
  {
    corridor: 'North Sea N1',
    severity: 'Low',
    advisory: 'Weather watch advisory, monitor container seals.',
  },
];

export default function Intel() {
  const [riskTrend, setRiskTrend] = useState(defaultRiskTrend);
  const [activeAlerts, setActiveAlerts] = useState(defaultActiveAlerts);

  useEffect(() => {
    let mounted = true;

    async function loadIntel() {
      const [alertsResult, trendResult] = await Promise.all([
        getIntelAlerts(),
        getIntelRiskTrend(),
      ]);

      if (!mounted) return;

      if (!alertsResult.error && Array.isArray(alertsResult.data) && alertsResult.data.length) {
        setActiveAlerts(alertsResult.data);
      }

      if (!trendResult.error && Array.isArray(trendResult.data) && trendResult.data.length) {
        setRiskTrend(trendResult.data);
      }
    }

    loadIntel();

    return () => {
      mounted = false;
    };
  }, []);

  const highRiskCount = activeAlerts.filter((alert) => alert.severity === 'High').length;

  return (
    <ShellLayout
      eyebrow="Intel"
      title="Threat and route intelligence"
      description="Monitor global events, corridor alerts, and shipment risk signals in one operational view."
    >
      <div className="panel-grid single-column">
        <section className="panel">
          <div className="panel-header">
            <h2>Intelligence feed</h2>
            <p>Correlated from route telemetry and external advisories</p>
          </div>

          <div className="settings-grid">
            <div>
              <span>Active advisories</span>
              <strong>{activeAlerts.length}</strong>
            </div>
            <div>
              <span>High-risk corridors</span>
              <strong>{highRiskCount}</strong>
            </div>
            <div>
              <span>Last sync</span>
              <strong>2 min ago</strong>
            </div>
          </div>

          <div className="panel-grid">
            <article className="panel panel-nested">
              <h3>Weekly corridor risk trend</h3>
              <div className="chart-shell">
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={riskTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value) => [value, 'Risk score']} />
                    <Area
                      type="monotone"
                      dataKey="risk"
                      stroke="#be123c"
                      fill="#fda4af"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="panel panel-nested">
              <h3>Active alert board</h3>
              <ul className="route-list">
                {activeAlerts.map((alert) => (
                  <li key={alert.corridor}>
                    <span>{`${alert.corridor} | ${alert.severity}`}</span>
                    <span>{alert.advisory}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>
      </div>
      <div id="news" />
      <div id="gri" />
      <div id="advisories" />
      <div id="market-updates" />
    </ShellLayout>
  );
}
