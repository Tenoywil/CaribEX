import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
} from '../reducers/authReducer';
import { apiClient } from '@/lib/apiClient';
import { User, Session } from '@/types';

// Worker saga: handles SIWE authentication flow
function* handleLoginRequest(action: PayloadAction<{ signature: string; message: string }>) {
  try {
    // Call API to verify SIWE signature
    // Use array notation to preserve 'this' context
    const response: { user: User; session: Session } = yield call(
      [apiClient, 'post'],
      '/v1/auth/siwe',
      {
        signature: action.payload.signature,
        message: action.payload.message,
      }
    );

    yield put(loginSuccess(response));
  } catch (error: any) {
    yield put(loginFailure(error.message || 'Authentication failed'));
  }
}

// Worker saga: handles logout
function* handleLogout() {
  try {
    // Call API to invalidate session
    yield call([apiClient, 'post'], '/v1/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Watcher saga
export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLoginRequest);
  yield takeLatest(logout.type, handleLogout);
}
