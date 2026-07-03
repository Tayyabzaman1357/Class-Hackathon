import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) return <Loader />;

  if (!currentUser) return <Navigate to="/login" />;

  if (adminOnly && userData?.role !== 'admin') return <Navigate to="/dashboard" />;

  return children;
};

export default ProtectedRoute;
