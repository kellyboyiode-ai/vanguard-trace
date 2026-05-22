import { lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { useAdaptiveMotion } from './hooks/useAdaptiveMotion.js';
import { useMediaAssetProtection } from './hooks/useMediaAssetProtection.js';

const AdminApprovalsPage = lazy(() => import('./pages/AdminApprovalsPage.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const Intel = lazy(() => import('./pages/Intel.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));
const Operations = lazy(() => import('./pages/Operations.jsx'));
const OverviewPage = lazy(() => import('./pages/OverviewPage.jsx'));
const PendingApprovalPage = lazy(
  () => import('./pages/PendingApprovalPage.jsx'),
);
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));
const SignupPage = lazy(() => import('./pages/SignupPage.jsx'));
const TracesPage = lazy(() => import('./pages/TracesPage.jsx'));
const Tracking = lazy(() => import('./pages/Tracking.jsx'));

function RouteLoadingFallback() {
  return (
    <div className="vt-loading-screen" role="status" aria-live="polite">
      <div>
        <div className="vt-loading-radar" aria-hidden="true" />
        <div className="vt-loading-flow" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p>Synchronizing global operations...</p>
      </div>
    </div>
  );
}

function RouteMotion({ children, reducedMotion }) {
  return (
    <motion.div
      className="vt-route-motion-shell"
      initial={{
        opacity: 0,
        y: reducedMotion ? 4 : 12,
        filter: reducedMotion ? 'blur(3px)' : 'blur(10px)',
        scale: reducedMotion ? 1 : 0.99,
      }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
      exit={{
        opacity: 0,
        y: reducedMotion ? -3 : -8,
        filter: reducedMotion ? 'blur(3px)' : 'blur(8px)',
        scale: reducedMotion ? 1 : 1.01,
      }}
      transition={{ duration: reducedMotion ? 0.2 : 0.38, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const location = useLocation();
  const { reducedMotion } = useAdaptiveMotion({ applyRootClass: true });

  useMediaAssetProtection();

  return (
    <AuthProvider>
      <Suspense fallback={<RouteLoadingFallback />}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/login"
              element={
                <RouteMotion reducedMotion={reducedMotion}>
                  <LoginPage />
                </RouteMotion>
              }
            />
            <Route
              path="/signup"
              element={
                <RouteMotion reducedMotion={reducedMotion}>
                  <SignupPage />
                </RouteMotion>
              }
            />
            <Route
              path="/reset-password"
              element={
                <RouteMotion reducedMotion={reducedMotion}>
                  <ResetPasswordPage />
                </RouteMotion>
              }
            />
            <Route
              path="/pending-approval"
              element={
                <RouteMotion reducedMotion={reducedMotion}>
                  <PendingApprovalPage />
                </RouteMotion>
              }
            />
            <Route
              path="/admin/approvals"
              element={
                <ProtectedRoute requireAdmin>
                  <RouteMotion reducedMotion={reducedMotion}>
                    <AdminApprovalsPage />
                  </RouteMotion>
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <RouteMotion reducedMotion={reducedMotion}>
                    <OverviewPage />
                  </RouteMotion>
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <RouteMotion reducedMotion={reducedMotion}>
                    <Home />
                  </RouteMotion>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tracking"
              element={
                <ProtectedRoute>
                  <RouteMotion reducedMotion={reducedMotion}>
                    <Tracking />
                  </RouteMotion>
                </ProtectedRoute>
              }
            />
            <Route
              path="/operations"
              element={
                <ProtectedRoute>
                  <RouteMotion reducedMotion={reducedMotion}>
                    <Operations />
                  </RouteMotion>
                </ProtectedRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <RouteMotion reducedMotion={reducedMotion}>
                    <Services />
                  </RouteMotion>
                </ProtectedRoute>
              }
            />
            <Route
              path="/intel"
              element={
                <ProtectedRoute>
                  <RouteMotion reducedMotion={reducedMotion}>
                    <Intel />
                  </RouteMotion>
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <ProtectedRoute>
                  <RouteMotion reducedMotion={reducedMotion}>
                    <Contact />
                  </RouteMotion>
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <RouteMotion reducedMotion={reducedMotion}>
                    <About />
                  </RouteMotion>
                </ProtectedRoute>
              }
            />
            <Route
              path="/traces"
              element={
                <ProtectedRoute>
                  <RouteMotion reducedMotion={reducedMotion}>
                    <TracesPage />
                  </RouteMotion>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <RouteMotion reducedMotion={reducedMotion}>
                    <SettingsPage />
                  </RouteMotion>
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={
                <RouteMotion reducedMotion={reducedMotion}>
                  <NotFoundPage />
                </RouteMotion>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
