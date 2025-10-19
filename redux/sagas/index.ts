import { all, fork } from 'redux-saga/effects';
import authSaga from './authSaga';
import productsSaga from './productsSaga';
import cartSaga from './cartSaga';
import walletSaga from './walletSaga';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(productsSaga),
    fork(cartSaga),
    fork(walletSaga),
  ]);
}
