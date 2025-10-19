import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchBalanceRequest,
  fetchBalanceSuccess,
  fetchBalanceFailure,
  fetchTransactionsRequest,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  sendFundsRequest,
  sendFundsSuccess,
  sendFundsFailure,
} from '../reducers/walletReducer';
import { apiClient } from '@/lib/apiClient';
import { Transaction } from '@/types';

// Worker saga: fetch wallet balance
function* handleFetchBalance() {
  try {
    const response: { balance: number; currency: string } = yield call(
      apiClient.get,
      '/v1/wallet/balance'
    );

    yield put(fetchBalanceSuccess(response));
  } catch (error: any) {
    yield put(fetchBalanceFailure(error.message || 'Failed to fetch balance'));
  }
}

// Worker saga: fetch transactions
function* handleFetchTransactions() {
  try {
    const response: { transactions: Transaction[] } = yield call(
      apiClient.get,
      '/v1/wallet/transactions'
    );

    yield put(fetchTransactionsSuccess(response.transactions));
  } catch (error: any) {
    yield put(fetchTransactionsFailure(error.message || 'Failed to fetch transactions'));
  }
}

// Worker saga: send funds flow (sign & submit)
function* handleSendFunds(
  action: PayloadAction<{ to: string; amount: number; note?: string }>
) {
  try {
    const { to, amount, note } = action.payload;

    // Step 1: Create pending transaction
    const pendingTx: { id: string; message: string } = yield call(
      apiClient.post,
      '/v1/wallet/send',
      {
        to,
        amount,
        note,
      }
    );

    // Step 2: In a real implementation, this would trigger wallet signature
    // For now, we simulate the complete flow
    // const signature = yield call(walletClient.signMessage, pendingTx.message);

    // Step 3: Submit signed transaction
    const completedTx: Transaction = yield call(
      apiClient.post,
      `/v1/wallet/send/${pendingTx.id}/confirm`,
      {
        // signature,
      }
    );

    yield put(sendFundsSuccess(completedTx));

    // Refresh balance
    yield put(fetchBalanceRequest());
  } catch (error: any) {
    yield put(sendFundsFailure(error.message || 'Failed to send funds'));
  }
}

// Watcher saga
export default function* walletSaga() {
  yield takeLatest(fetchBalanceRequest.type, handleFetchBalance);
  yield takeLatest(fetchTransactionsRequest.type, handleFetchTransactions);
  yield takeLatest(sendFundsRequest.type, handleSendFunds);
}
