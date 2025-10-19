import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, Session } from '@/types';

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isCheckingSession: true, // Start as true to check for existing session
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    checkSessionRequest: (state) => {
      state.isCheckingSession = true;
    },
    checkSessionComplete: (state) => {
      state.isCheckingSession = false;
    },
    loginRequest: (state, action: PayloadAction<{ signature: string; message: string }>) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; session: Session }>) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.isCheckingSession = false;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.isCheckingSession = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    restoreSession: (state, action: PayloadAction<{ user: User; session: Session }>) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.isCheckingSession = false;
    },
  },
});

export const { checkSessionRequest, checkSessionComplete, loginRequest, loginSuccess, loginFailure, logout, clearError, restoreSession } = authSlice.actions;
export const authReducer = authSlice.reducer;
