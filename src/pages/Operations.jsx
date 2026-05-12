import { ShellLayout } from '../layouts/index.js';
import { FileUpload } from '../components/index.js';
import { useUiStore } from '../store/index.js';

const queueItems = [
  { task: 'Reroute approval', count: 3, severity: 'critical' },
  { task: 'Customs clearance checks', count: 9, severity: 'high' },
  { task: 'Carrier handoff audits', count: 5, severity: 'medium' },
  { task: 'Cold-chain variance review', count: 2, severity: 'critical' },
  { task: 'Manifest mismatch verification', count: 4, severity: 'medium' },
];

export default function Operations() {
  const { quickFilters, setQuickFilter } = useUiStore();

  const visibleItems = queueItems.filter((item) => {
    if (quickFilters.criticalOnly && item.severity !== 'critical') {
      return false;
    }

    return true;
  });

  return (
    <ShellLayout
      eyebrow="Operations"
      title="Operational control center"
      description="Coordinate teams, route decisions, and response workflows from a single operations panel."
    >
      <div className="panel-grid single-column">
        <section className="panel">
          <div className="panel-header">
            <h2>Operations queue</h2>
            <p>Priority actions awaiting review</p>
          </div>

          <div className="form-row">
            <button
              type="button"
              className="form-button"
              onClick={() =>
                setQuickFilter('criticalOnly', !quickFilters.criticalOnly)
              }
            >
              {quickFilters.criticalOnly
                ? 'Showing: Critical only'
                : 'Show critical only'}
            </button>
            <button
              type="button"
              className="form-button form-button-secondary"
              onClick={() => setQuickFilter('criticalOnly', false)}
            >
              Clear filters
            </button>
          </div>

          <ul className="route-list">
            {visibleItems.map((item) => (
              <li key={item.task}>
                <span>{`${item.task} (${item.severity})`}</span>
                <span>{`${item.count} open`}</span>
              </li>
            ))}
          </ul>

          <div className="form-block">
            <FileUpload />
          </div>
        </section>
      </div>
    </ShellLayout>
  );
}
