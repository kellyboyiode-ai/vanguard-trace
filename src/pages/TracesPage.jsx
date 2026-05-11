import { SectionHeader } from '../components/index.js';
import { ShellLayout } from '../layouts/index.js';

export default function TracesPage() {
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
            <li>
              <span>/checkout</span>
              <span>1.4s median</span>
            </li>
            <li>
              <span>/search</span>
              <span>2.1s median</span>
            </li>
            <li>
              <span>/account</span>
              <span>1.7s median</span>
            </li>
          </ul>
        </section>
      </div>
    </ShellLayout>
  );
}
