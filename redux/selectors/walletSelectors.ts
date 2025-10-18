import { createSelector } from 'reselect';
import { RootState } from '@/types';

// Base selector
const selectWalletState = (state: RootState) => state.wallet;

// Memoized selectors
export const selectWalletBalance = createSelector([selectWalletState], (wallet) => wallet.balance);

export const selectWalletCurrency = createSelector([selectWalletState], (wallet) => wallet.currency);

export const selectWalletTransactions = createSelector(
  [selectWalletState],
  (wallet) => wallet.transactions
);

export const selectWalletLoading = createSelector([selectWalletState], (wallet) => wallet.loading);

export const selectWalletError = createSelector([selectWalletState], (wallet) => wallet.error);

export const selectRecentTransactions = createSelector([selectWalletState], (wallet) =>
  wallet.transactions.slice(0, 10)
);
