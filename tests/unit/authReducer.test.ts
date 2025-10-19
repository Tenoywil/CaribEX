import { authReducer } from '@/redux/reducers/authReducer';
import {
  checkSessionRequest,
  checkSessionComplete,
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  restoreSession,
} from '@/redux/reducers/authReducer';
import { AuthState, User, Session } from '@/types';

describe('Auth Reducer', () => {
  const initialState: AuthState = {
    user: null,
    session: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    isCheckingSession: true,
  };

  const mockUser: User = {
    id: '123',
    handle: 'testuser',
    wallet_address: '0x1234567890abcdef',
  };

  const mockSession: Session = {
    expiresAt: '2024-12-31T23:59:59Z',
  };

  it('should return initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('session check', () => {
    it('should handle checkSessionRequest', () => {
      const state = authReducer(initialState, checkSessionRequest());
      expect(state.isCheckingSession).toBe(true);
    });

    it('should handle checkSessionComplete', () => {
      const state = authReducer(initialState, checkSessionComplete());
      expect(state.isCheckingSession).toBe(false);
    });
  });

  describe('login', () => {
    it('should handle loginRequest', () => {
      const payload = { signature: 'sig123', message: 'message' };
      const state = authReducer(initialState, loginRequest(payload));
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle loginSuccess', () => {
      const payload = { user: mockUser, session: mockSession };
      const state = authReducer(initialState, loginSuccess(payload));
      expect(state.user).toEqual(mockUser);
      expect(state.session).toEqual(mockSession);
      expect(state.isAuthenticated).toBe(true);
      expect(state.loading).toBe(false);
      expect(state.isCheckingSession).toBe(false);
    });

    it('should handle loginFailure', () => {
      const error = 'Authentication failed';
      const state = authReducer(initialState, loginFailure(error));
      expect(state.error).toBe(error);
      expect(state.loading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('session restoration', () => {
    it('should handle restoreSession and set isCheckingSession to false', () => {
      const payload = { user: mockUser, session: mockSession };
      const state = authReducer(initialState, restoreSession(payload));
      expect(state.user).toEqual(mockUser);
      expect(state.session).toEqual(mockSession);
      expect(state.isAuthenticated).toBe(true);
      expect(state.loading).toBe(false);
      expect(state.isCheckingSession).toBe(false);
    });

    it('should restore session when already checking', () => {
      const checkingState = { ...initialState, isCheckingSession: true };
      const payload = { user: mockUser, session: mockSession };
      const state = authReducer(checkingState, restoreSession(payload));
      expect(state.isAuthenticated).toBe(true);
      expect(state.isCheckingSession).toBe(false);
    });
  });

  describe('logout', () => {
    it('should handle logout and reset state', () => {
      const authenticatedState: AuthState = {
        user: mockUser,
        session: mockSession,
        isAuthenticated: true,
        loading: false,
        error: null,
        isCheckingSession: false,
      };
      
      const state = authReducer(authenticatedState, logout());
      expect(state.user).toBe(null);
      expect(state.session).toBe(null);
      expect(state.isAuthenticated).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.isCheckingSession).toBe(false);
    });
  });

  describe('session persistence scenarios', () => {
    it('should handle page refresh scenario - session check then restore', () => {
      // Start with initial state (as if page just loaded)
      let state = authReducer(undefined, { type: 'unknown' });
      expect(state.isCheckingSession).toBe(true);

      // Session check starts
      state = authReducer(state, checkSessionRequest());
      expect(state.isCheckingSession).toBe(true);

      // Session is restored from backend
      const payload = { user: mockUser, session: mockSession };
      state = authReducer(state, restoreSession(payload));
      expect(state.isAuthenticated).toBe(true);
      expect(state.isCheckingSession).toBe(false);
    });

    it('should handle no session found scenario', () => {
      // Start with initial state
      let state = authReducer(undefined, { type: 'unknown' });
      expect(state.isCheckingSession).toBe(true);

      // Session check completes with no session
      state = authReducer(state, checkSessionComplete());
      expect(state.isCheckingSession).toBe(false);
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
