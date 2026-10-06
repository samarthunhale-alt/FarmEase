import { Navigate, useLocation } from 'react-router-dom';
import { homeFor, useAuth } from '../context/AuthContext.jsx';
import { Loading } from './Feedback.jsx';

export default function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={homeFor(user.role)} replace />;
  return children;
}
