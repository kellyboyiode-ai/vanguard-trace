import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Footer } from './components/index.js';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './styles/footer.css';
import { AuthProvider } from './context/AuthContext.jsx';
import {
  Home,
  Intel,
  NotFoundPage,
  Operations,
  Contact,
  OverviewPage,
  SettingsPage,
  Services,
  TracesPage,
  Tracking,
  LoginPage,
  SignupPage,
} from './pages/index.js';

function App() {
  return (
    <AuthProvider>
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
      <Footer />
    </AuthProvider>
  );
}

export default App;
