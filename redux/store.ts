import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { authReducer } from './reducers/authReducer';
import { productsReducer } from './reducers/productsReducer';
import { cartReducer } from './reducers/cartReducer';
import { walletReducer } from './reducers/walletReducer';
import { sellerReducer } from './reducers/sellerReducer';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    wallet: walletReducer,
    seller: sellerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        // Ignore saga actions
        ignoredActions: ['saga/action'],
      },
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
