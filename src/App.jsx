import { lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

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
        <p>Synchronizing global operations...</p>
      </div>
    </div>
  );
}

function RouteMotion({ children }) {
  return (
    <motion.div
      className="vt-route-motion-shell"
      initial={{ opacity: 0, y: 12, filter: 'blur(10px)', scale: 0.99 }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
      exit={{ opacity: 0, y: -8, filter: 'blur(8px)', scale: 1.01 }}
      transition={{ duration: 0.38, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <Suspense fallback={<RouteLoadingFallback />}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/login"
              element={
                <RouteMotion>
                  <LoginPage />
                </RouteMotion>
              }
            />
            <Route
              path="/signup"
              element={
                <RouteMotion>
                  <SignupPage />
                </RouteMotion>
              }
            />
            <Route
              path="/pending-approval"
              element={
                <RouteMotion>
                  <PendingApprovalPage />
                </RouteMotion>
              }
            />
            <Route
              path="/admin/approvals"
              element={
                <ProtectedRoute requireAdmin>
                  <RouteMotion>
                    <AdminApprovalsPage />
                  </RouteMotion>
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <RouteMotion>
                    <OverviewPage />
                  </RouteMotion>
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <RouteMotion>
                    <Home />
                  </RouteMotion>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tracking"
              element={
                <ProtectedRoute>
                  <RouteMotion>
                    <Tracking />
                  </RouteMotion>
                </ProtectedRoute>
              }
            />
            <Route
              path="/operations"
              element={
                <ProtectedRoute>
                  <RouteMotion>
                    <Operations />
                  </RouteMotion>
                </ProtectedRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <RouteMotion>
                    <Services />
                  </RouteMotion>
                </ProtectedRoute>
              }
            />
            <Route
              path="/intel"
              element={
                <ProtectedRoute>
                  <RouteMotion>
                    <Intel />
                  </RouteMotion>
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <ProtectedRoute>
                  <RouteMotion>
                    <Contact />
                  </RouteMotion>
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <RouteMotion>
                    <About />
                  </RouteMotion>
                </ProtectedRoute>
              }
            />
            <Route
              path="/traces"
              element={
                <ProtectedRoute>
                  <RouteMotion>
                    <TracesPage />
                  </RouteMotion>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <RouteMotion>
                    <SettingsPage />
                  </RouteMotion>
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={
                <RouteMotion>
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
