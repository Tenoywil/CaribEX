import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectSession,
  selectIsCheckingSession
} from '@/redux/selectors/authSelectors';
import { restoreSession, logout, checkSessionRequest, checkSessionComplete } from '@/redux/reducers/authReducer';
import { apiClient } from '@/lib/apiClient';
import type { Session,User } from '@/types';


const SESSION_STORAGE_KEY = 'caribex_session_backup';

/**
 * Hook to check and restore authentication session on app load
 * Implements multi-layer session persistence:
 * 1. Primary: HTTP-only cookie from backend
 * 2. Backup: localStorage for better persistence across tabs
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const session = useSelector(selectSession);
  const isCheckingSession = useSelector(selectIsCheckingSession);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Check session on mount
  useEffect(() => {
    if (!isAuthenticated && !sessionChecked) {
      checkSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, sessionChecked]);

  // Persist session data to localStorage when authenticated
  useEffect(() => {
    if (isAuthenticated && session) {
      try {
        const sessionData = {
          timestamp: Date.now(),
          expiresAt: session.expiresAt,
        };
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      } catch (error) {
        console.error('Failed to persist session to localStorage:', error);
      }
    } else {
      // Clear localStorage when logged out
      try {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      } catch (error) {
        console.error('Failed to clear session from localStorage:', error);
      }
    }
  }, [isAuthenticated, session]);

  // Check if session is expired
  const isSessionExpired = (expiresAt: string) => {
    return new Date(expiresAt).getTime() < Date.now();
  };

  const checkSession = async () => {
    // Don't check again if already authenticated
    if (isAuthenticated) {
      dispatch(checkSessionComplete());
      return;
    }

    dispatch(checkSessionRequest());

    try {
      // First, check if we have a backup session in localStorage
      const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (storedSession) {
        const sessionData = JSON.parse(storedSession);

        // If the stored session is expired, clear it and don't attempt restore
        if (isSessionExpired(sessionData.expiresAt)) {
          localStorage.removeItem(SESSION_STORAGE_KEY);
          setSessionChecked(true);
          dispatch(checkSessionComplete());
          return;
        }
      }
 
      // Try to get current user from backend (will use HTTP-only cookie)
      const response = await apiClient.get<{ user: User; session: Session }>('/v1/auth/me');

      if (response.user) {
        // Verify session hasn't expired
        dispatch(restoreSession(response as { user: User; session: Session}));
      } else {
        // Session expired, logout
        dispatch(logout());

      }
    } catch (error) {
      // Session doesn't exist or is invalid - user needs to login
      console.log('No active session found');
      // Clear any stale localStorage data
      try {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      } catch (e) {
        // Ignore localStorage errors
      }
      dispatch(checkSessionComplete());
    } finally {
      setSessionChecked(true);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    isCheckingSession,
  };
};
