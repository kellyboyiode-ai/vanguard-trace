import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

const About = lazy(() => import('./pages/About.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const Intel = lazy(() => import('./pages/Intel.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));
const Operations = lazy(() => import('./pages/Operations.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const OverviewPage = lazy(() => import('./pages/OverviewPage.jsx'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const TracesPage = lazy(() => import('./pages/TracesPage.jsx'));
const Tracking = lazy(() => import('./pages/Tracking.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const SignupPage = lazy(() => import('./pages/SignupPage.jsx'));

function RouteFallback() {
  return <div className="route-fallback">Loading page...</div>;
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <OverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracking"
            element={
              <ProtectedRoute>
                <Tracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/operations"
            element={
              <ProtectedRoute>
                <Operations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <Services />
              </ProtectedRoute>
            }
          />
          <Route
            path="/intel"
            element={
              <ProtectedRoute>
                <Intel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/traces"
            element={
              <ProtectedRoute>
                <TracesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
