// src/hooks/useSecurityCheck.js
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import apiClient from '../api/apiClient';
import { clearCart } from '../store/cartSlice';

export const useSecurityCheck = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // 1. THE HEARTBEAT: Only checks the DB and updates Redux
  useEffect(() => {
    const verifyStatus = async () => {
      if (!isAuthenticated || !user?.id) return;

      try {
        const response = await apiClient.get(`/users/${user.id}`);
        const latestUser = response.data;

        // If DB says Banned, but Redux still says Active -> Update Redux!
        if (latestUser.status === 'Banned' && user.status !== 'Banned') {
          dispatch(setCredentials(latestUser));
        }
      } catch (err) {
        console.error("VOID_SYNC_OFFLINE:", err);
      }
    };

    verifyStatus();
  }, [location.pathname, isAuthenticated, user?.id, user?.status, dispatch]); 

  // 2. THE ENFORCER: Watches Redux. If you are Banned, you cannot escape.
  useEffect(() => {
    if (user?.status === 'Banned') {
      // Allow them on /banned and /contact (for appeals)
      if (location.pathname !== '/banned' && location.pathname !== '/contact') {
        clearCart()
        navigate('/banned', { replace: true });
      }
    }
  }, [user?.status, location.pathname, navigate]);
};

