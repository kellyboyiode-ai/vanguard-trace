import { lazy, Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Footer, Navbar } from '../components/index.js';
import MediaCoverageDebug from '../components/MediaCoverageDebug.jsx';
import PageMediaGallery from '../components/PageMediaGallery.jsx';
import { useLiveOpsEngine } from '../hooks/useLiveOpsEngine.js';
import { useOperationsStore } from '../store/index.js';
import '../styles/footer.css';
import '../styles/navbar.css';

const CinematicBackdrop = lazy(
  () => import('../components/CinematicBackdrop.jsx'),
);
const CommandPalette = lazy(() => import('../components/CommandPalette.jsx'));
const FloatingAIAssistant = lazy(
  () => import('../components/FloatingAIAssistant.jsx'),
);
const LiveStatusStrip = lazy(() => import('../components/LiveStatusStrip.jsx'));
const MobileOpsDock = lazy(() => import('../components/MobileOpsDock.jsx'));

function ShellAsyncFallback({ className = '' }) {
  return <div className={className} aria-hidden="true" />;
}

function resolvePageKey(pathname) {
  switch (pathname) {
    case '/':
      return 'overview';
    case '/home':
      return 'home';
    case '/about':
      return 'about';
    case '/contact':
      return 'contact';
    case '/intel':
      return 'intel';
    case '/operations':
      return 'operations';
    case '/services':
      return 'services';
    case '/tracking':
      return 'tracking';
    case '/traces':
      return 'traces';
    case '/settings':
      return 'settings';
    default:
      return 'not-found';
  }
}

export default function ShellLayout({ title, eyebrow, description, children }) {
  const location = useLocation();
  const gtmId = String(import.meta.env.VITE_GTM_ID || '').trim();
  const pageKey = resolvePageKey(location.pathname);
  const setCommandPaletteOpen = useOperationsStore(
    (state) => state.setCommandPaletteOpen,
  );
  useLiveOpsEngine();

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
    <div className="app-shell vt-command-center">
      <Suspense fallback={<ShellAsyncFallback className="vt-shell-fallback" />}>
        <CinematicBackdrop />
      </Suspense>
      <Suspense fallback={<ShellAsyncFallback className="vt-shell-fallback" />}>
        <CommandPalette />
      </Suspense>
      <Suspense fallback={<ShellAsyncFallback className="vt-shell-fallback" />}>
        <FloatingAIAssistant />
      </Suspense>
      <Suspense fallback={<ShellAsyncFallback className="vt-shell-fallback" />}>
        <LiveStatusStrip />
      </Suspense>
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
          <button
            type="button"
            className="shell-command-button"
            onClick={() => setCommandPaletteOpen(true)}
          >
            Command (Ctrl + K)
          </button>
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
            <PageMediaGallery pageKey={pageKey} />
          </section>
        </main>
      </div>
      <Suspense fallback={<ShellAsyncFallback className="vt-shell-fallback" />}>
        <MobileOpsDock />
      </Suspense>
      <MediaCoverageDebug />
      <Footer />
    </div>
  );
}
