import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const { user } = useSelector((state) => state.auth);

  // If user is logged in, redirect them to the Profile terminal
  // Using "replace" to prevent them from hitting "Back" to return to Login
  return user ? <Navigate to="/profile" replace /> : <Outlet />;
};

export default PublicRoute;