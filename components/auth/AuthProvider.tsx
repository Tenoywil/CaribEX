'use client';

import { useAuth } from '@/hooks/useAuth';

/**
 * AuthProvider component that checks for existing session on mount
 * This should wrap the app content to restore authentication state
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  useAuth(); // This will check and restore session on mount
  
  return <>{children}</>;
};
