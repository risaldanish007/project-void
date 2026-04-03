import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) return <div>Initializing...</div>;

  // 1. Check if the user is Banned
  if (isAuthenticated && user?.status === 'Banned') {
    // Optional: Dispatch a logout action here to clear their local storage
    return <Navigate to="/banned" replace />; 
  }

  // 2. Check Authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Check Admin Clearance
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;