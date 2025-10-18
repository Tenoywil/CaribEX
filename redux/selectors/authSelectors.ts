import { createSelector } from 'reselect';
import { RootState } from '@/types';

// Base selector
const selectAuthState = (state: RootState) => state.auth;

// Memoized selectors
export const selectUser = createSelector([selectAuthState], (auth) => auth.user);

export const selectSession = createSelector([selectAuthState], (auth) => auth.session);

export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth) => auth.isAuthenticated
);

export const selectAuthLoading = createSelector([selectAuthState], (auth) => auth.loading);

export const selectAuthError = createSelector([selectAuthState], (auth) => auth.error);
