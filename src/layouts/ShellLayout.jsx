import { useEffect } from 'react';
import { Footer, Navbar } from '../components/index.js';
import '../styles/footer.css';
import '../styles/navbar.css';

export default function ShellLayout({ title, eyebrow, description, children }) {
  const gtmId = String(import.meta.env.VITE_GTM_ID || '').trim();

  useEffect(() => {
    if (!gtmId || document.getElementById('vt-gtm-script')) {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': Date.now(),
      event: 'gtm.js',
    });

    const script = document.createElement('script');
    script.id = 'vt-gtm-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
    document.head.appendChild(script);
  }, [gtmId]);

  return (
    <div className="app-shell">
      {gtmId && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}`}
            title="Google Tag Manager"
            className="shell-gtm-noscript"
          />
        </noscript>
      )}
      <div className="shell-frame">
        <header className="shell-header" aria-label="Site header">
          <div className="shell-brand">
            <p className="shell-brand-kicker">Vanguard Trace Platform</p>
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
