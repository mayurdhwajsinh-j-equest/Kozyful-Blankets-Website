import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRedirect = ({ children }) => {
  const { isAdmin, isAuthenticated, initializing } = useAuth();

  if (initializing) return null;

  // If logged in as admin, redirect to admin dashboard
  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default AdminRedirect;