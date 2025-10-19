import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAuthLoading } from '@/redux/selectors/authSelectors';
import { restoreSession } from '@/redux/reducers/authReducer';
import { apiClient } from '@/lib/apiClient';

/**
 * Hook to check and restore authentication session on app load
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);

  useEffect(() => {
    // Only attempt to restore session if not already authenticated
    if (!isAuthenticated) {
      checkSession();
    }
  }, []);

  const checkSession = async () => {
    try {
      // Try to get current user from backend (will use HTTP-only cookie)
      const response = await apiClient.get('/v1/auth/me');
      
      if (response.user && response.session) {
        dispatch(restoreSession(response));
      }
    } catch (error) {
      // Session doesn't exist or is invalid - user needs to login
      console.log('No active session found');
    }
  };

  return {
    isAuthenticated,
    isLoading,
  };
};
