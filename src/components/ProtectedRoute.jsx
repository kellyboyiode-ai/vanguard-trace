import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.jsx';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { session, loading, isAdmin, isApproved } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin && !isApproved) {
    return <Navigate to="/pending-approval" replace />;
  }

  return children;
}
