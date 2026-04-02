import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import NotFound from '../../pages/NotFound';

const AdminRoute = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  console.log("AUTH_STATUS:", isAuthenticated);
  console.log("USER_ROLE:", user?.role);

  // Security Logic: Must be logged in AND have the 'admin' role
  if (!isAuthenticated || user?.role !== 'admin') {
    return <NotFound/>;
  }

  return <Outlet />;
};

export default AdminRoute;