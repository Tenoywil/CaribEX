import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  selectWalletBalance,
  selectWalletCurrency,
  selectWalletTransactions,
  selectWalletLoading,
  selectWalletError,
} from '@/redux/selectors/walletSelectors';
import {
  fetchBalanceRequest,
  fetchTransactionsRequest,
  sendFundsRequest,
} from '@/redux/reducers/walletReducer';

export const useWallet = () => {
  const dispatch = useDispatch();

  const balance = useSelector(selectWalletBalance);
  const currency = useSelector(selectWalletCurrency);
  const transactions = useSelector(selectWalletTransactions);
  const loading = useSelector(selectWalletLoading);
  const error = useSelector(selectWalletError);

  const fetchBalance = useCallback(() => {
    dispatch(fetchBalanceRequest());
  }, [dispatch]);

  const fetchTransactions = useCallback(() => {
    dispatch(fetchTransactionsRequest());
  }, [dispatch]);

  const sendFunds = useCallback(
    (to: string, amount: number, note?: string) => {
      dispatch(sendFundsRequest({ to, amount, note }));
    },
    [dispatch]
  );

  return {
    balance,
    currency,
    transactions,
    loading,
    error,
    fetchBalance,
    fetchTransactions,
    sendFunds,
  };
};
