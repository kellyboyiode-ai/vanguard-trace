import { Footer, Navbar } from '../components/index.js';
import '../styles/footer.css';
import '../styles/navbar.css';

export default function ShellLayout({ title, eyebrow, description, children }) {
  return (
    <div className="app-shell">
      <div className="shell-frame">
        <header className="shell-header" aria-label="Site header">
          <div className="shell-brand">
            <p className="shell-brand-kicker">Vanguard Logistics</p>
            <strong className="shell-brand-title">Vanguard Trace</strong>
          </div>
          <Navbar />
        </header>

        <header className="topbar">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
          </div>
        </header>

        <main className="content">
          <section className="hero-panel">
            <p className="lead">{description}</p>
            {children}
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
