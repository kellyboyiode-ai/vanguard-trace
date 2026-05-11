import { Navbar } from '../components/index.js';
import '../styles/navbar.css';

export default function ShellLayout({ title, eyebrow, description, children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
        </div>

        <Navbar />
      </header>

      <main className="content">
        <section className="hero-panel">
          <p className="lead">{description}</p>
          {children}
        </section>
      </main>
    </div>
  );
}
