import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  addToCartRequest,
  addToCartSuccess,
  addToCartFailure,
  removeFromCartRequest,
  removeFromCartSuccess,
  removeFromCartFailure,
  setCartId,
} from '../reducers/cartReducer';
import { apiClient } from '@/lib/apiClient';
import { CartItem } from '@/types';

// Worker saga: add item to cart with optimistic update
function* handleAddToCart(
  action: PayloadAction<{ productId: string; qty: number; price: number }>
) {
  try {
    const { productId, qty, price } = action.payload;

    // Call API to add item
    const response: { cartItem: CartItem; cartId: string } = yield call(
      apiClient.post,
      '/v1/cart/items',
      {
        productId,
        qty,
        price,
      }
    );

    yield put(addToCartSuccess(response.cartItem));
    yield put(setCartId(response.cartId));
  } catch (error: any) {
    yield put(addToCartFailure(error.message || 'Failed to add item to cart'));
  }
}

// Worker saga: remove item from cart
function* handleRemoveFromCart(action: PayloadAction<string>) {
  try {
    const itemId = action.payload;

    // Call API to remove item
    yield call(apiClient.delete, `/v1/cart/items/${itemId}`);

    yield put(removeFromCartSuccess(itemId));
  } catch (error: any) {
    yield put(removeFromCartFailure(error.message || 'Failed to remove item from cart'));
  }
}

// Watcher saga
export default function* cartSaga() {
  yield takeLatest(addToCartRequest.type, handleAddToCart);
  yield takeLatest(removeFromCartRequest.type, handleRemoveFromCart);
}
