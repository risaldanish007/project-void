import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// ADDED: setCredentials import
import { logout, setCredentials } from '../store/authSlice'; 

// RENAMED: Added "use" to follow React Hook rules
export const useManageCrosstab = () => { 
  const dispatch = useDispatch();

  useEffect(() => {
    const handleStorageChange = (e) => {
      // Only listen to the VOID identity key
      if (e.key === 'void_user') {
        
        if (!e.newValue) {
          // SCENARIO 1: The user logged out in another tab
          console.warn("VOID_SYNC: Terminating session. Logout detected.");
          dispatch(logout());
          
        } else {
          // SCENARIO 2: The user logged in via another tab
          console.log("VOID_SYNC: Uplink established. Login detected.");
          
          // Parse the new identity and update this tab's Redux silently
          const activeUser = JSON.parse(e.newValue);
          dispatch(setCredentials(activeUser)); 
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch]);
};