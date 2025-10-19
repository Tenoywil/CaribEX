import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectIsAuthenticated, 
  selectAuthLoading, 
  selectIsCheckingSession 
} from '@/redux/selectors/authSelectors';
import { restoreSession, checkSessionRequest, checkSessionComplete } from '@/redux/reducers/authReducer';
import { apiClient } from '@/lib/apiClient';

/**
 * Hook to check and restore authentication session on app load
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const isCheckingSession = useSelector(selectIsCheckingSession);

  useEffect(() => {
    // Only check once on mount
    checkSession();
  }, []);

  const checkSession = async () => {
    // Don't check again if already authenticated
    if (isAuthenticated) {
      dispatch(checkSessionComplete());
      return;
    }

    dispatch(checkSessionRequest());
    
    try {
      // Try to get current user from backend (will use HTTP-only cookie)
      const response = await apiClient.get('/v1/auth/me');
      
      if (response.user && response.session) {
        dispatch(restoreSession(response));
      } else {
        dispatch(checkSessionComplete());
      }
    } catch (error) {
      // Session doesn't exist or is invalid - user needs to login
      console.log('No active session found');
      dispatch(checkSessionComplete());
    }
  };

  return {
    isAuthenticated,
    isLoading,
    isCheckingSession,
  };
};
