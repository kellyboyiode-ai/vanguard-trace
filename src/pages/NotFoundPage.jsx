import { NavLink } from 'react-router-dom';
import { ShellLayout } from '../layouts/index.js';

export default function NotFoundPage() {
  return (
    <ShellLayout
      eyebrow="Not found"
      title="That route does not exist"
      description="Use the navigation above to jump back to a supported page."
    >
      <div className="panel-grid single-column">
        <section className="panel">
          <p className="panel-kicker">404</p>
          <NavLink to="/" className="button-link">
            Return home
          </NavLink>
        </section>
      </div>
    </ShellLayout>
  );
}
