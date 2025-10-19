import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WalletState, Transaction } from '@/types';

const initialState: WalletState = {
  balance: 0,
  currency: 'USD',
  transactions: [],
  loading: false,
  error: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    fetchBalanceRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBalanceSuccess: (state, action: PayloadAction<{ balance: number; currency: string }>) => {
      state.balance = action.payload.balance;
      state.currency = action.payload.currency;
      state.loading = false;
    },
    fetchBalanceFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchTransactionsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTransactionsSuccess: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
      state.loading = false;
    },
    fetchTransactionsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    sendFundsRequest: (
      state,
      _action: PayloadAction<{ to: string; amount: number; note?: string }>
    ) => {
      state.loading = true;
      state.error = null;
    },
    sendFundsSuccess: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
      state.balance -= action.payload.amount;
      state.loading = false;
    },
    sendFundsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
    },
    clearWalletError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchBalanceRequest,
  fetchBalanceSuccess,
  fetchBalanceFailure,
  fetchTransactionsRequest,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  sendFundsRequest,
  sendFundsSuccess,
  sendFundsFailure,
  addTransaction,
  clearWalletError,
} = walletSlice.actions;

export const walletReducer = walletSlice.reducer;
