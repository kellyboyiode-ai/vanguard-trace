import { ShellLayout } from '../layouts/index.js';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const serviceHealth = [
  {
    module: 'Monitoring API',
    status: 'Operational',
    uptime: '99.98%',
    incidents: '0 in 7d',
  },
  {
    module: 'Risk engine',
    status: 'Operational',
    uptime: '99.95%',
    incidents: '1 in 7d',
  },
  {
    module: 'Webhook gateway',
    status: 'Degraded',
    uptime: '97.10%',
    incidents: '4 in 7d',
  },
];

const serviceLatency = [
  { name: 'Monitoring API', p95: 138 },
  { name: 'Risk engine', p95: 224 },
  { name: 'Webhook gateway', p95: 491 },
  { name: 'Audit stream', p95: 177 },
];

export default function Services() {
  return (
    <ShellLayout
      eyebrow="Services"
      title="Logistics service modules"
      description="Compose shipment intelligence, compliance checks, and monitoring services based on operational needs."
    >
      <div className="panel-grid single-column">
        <section className="panel">
          <div className="panel-header">
            <h2>Service availability</h2>
            <p>Current module health and status</p>
          </div>

          <div className="settings-grid">
            {serviceHealth.map((item) => (
              <div key={item.module}>
                <span>{item.module}</span>
                <strong>{item.status}</strong>
              </div>
            ))}
          </div>

          <div className="panel-grid">
            <article className="panel panel-nested">
              <h3>P95 latency by module</h3>
              <div className="chart-shell">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={serviceLatency}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis unit="ms" tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value) => [`${value} ms`, 'P95']} />
                    <Bar dataKey="p95" fill="#0f766e" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="panel panel-nested">
              <h3>Service SLO snapshot</h3>
              <ul className="route-list">
                {serviceHealth.map((item) => (
                  <li key={`${item.module}-slo`}>
                    <span>{item.module}</span>
                    <span>{`${item.uptime} | ${item.incidents}`}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>
      </div>
      <div id="airfreight" />
      <div id="fcl" />
      <div id="lcl" />
      <div id="cfs" />
      <div id="customs" />
      <div id="technology" />
    </ShellLayout>
  );
}
