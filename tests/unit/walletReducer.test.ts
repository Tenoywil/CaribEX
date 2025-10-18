import { walletReducer } from '@/redux/reducers/walletReducer';
import {
  fetchBalanceRequest,
  fetchBalanceSuccess,
  fetchBalanceFailure,
  sendFundsRequest,
  sendFundsSuccess,
  sendFundsFailure,
} from '@/redux/reducers/walletReducer';
import { WalletState } from '@/types';

describe('Wallet Reducer', () => {
  const initialState: WalletState = {
    balance: 0,
    currency: 'USD',
    transactions: [],
    loading: false,
    error: null,
  };

  it('should return initial state', () => {
    expect(walletReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchBalance', () => {
    it('should handle fetchBalanceRequest', () => {
      const state = walletReducer(initialState, fetchBalanceRequest());
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle fetchBalanceSuccess', () => {
      const payload = { balance: 1000, currency: 'USD' };
      const state = walletReducer(initialState, fetchBalanceSuccess(payload));
      expect(state.balance).toBe(1000);
      expect(state.currency).toBe('USD');
      expect(state.loading).toBe(false);
    });

    it('should handle fetchBalanceFailure', () => {
      const error = 'Failed to fetch balance';
      const state = walletReducer(initialState, fetchBalanceFailure(error));
      expect(state.error).toBe(error);
      expect(state.loading).toBe(false);
    });
  });

  describe('sendFunds', () => {
    it('should handle sendFundsRequest', () => {
      const payload = { to: '0x123', amount: 100, note: 'Payment' };
      const state = walletReducer(initialState, sendFundsRequest(payload));
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle sendFundsSuccess', () => {
      const startState = { ...initialState, balance: 1000 };
      const transaction = {
        id: 'tx1',
        type: 'send' as const,
        amount: 100,
        currency: 'USD',
        status: 'completed' as const,
        from: '0xabc',
        to: '0x123',
        timestamp: '2024-01-01T00:00:00Z',
      };
      
      const state = walletReducer(startState, sendFundsSuccess(transaction));
      expect(state.transactions).toHaveLength(1);
      expect(state.transactions[0]).toEqual(transaction);
      expect(state.balance).toBe(900); // 1000 - 100
      expect(state.loading).toBe(false);
    });

    it('should handle sendFundsFailure', () => {
      const error = 'Insufficient balance';
      const state = walletReducer(initialState, sendFundsFailure(error));
      expect(state.error).toBe(error);
      expect(state.loading).toBe(false);
    });
  });
});
