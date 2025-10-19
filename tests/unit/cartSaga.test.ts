import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import cartSaga from '@/redux/sagas/cartSaga';
import {
  addToCartRequest,
  addToCartSuccess,
  addToCartFailure,
  removeFromCartRequest,
  removeFromCartSuccess,
  removeFromCartFailure,
  updateCartItemQty,
  setCartId,
} from '@/redux/reducers/cartReducer';
import { apiClient } from '@/lib/apiClient';
import { CartItem } from '@/types';

describe('cartSaga', () => {
  describe('handleAddToCart', () => {
    it('should add item to cart successfully', () => {
      const payload = { productId: 'prod1', qty: 2, price: 10.99 };
      const cartItem: CartItem = { id: 'item1', productId: 'prod1', qty: 2, price: 10.99 };
      const response = { cartItem, cartId: 'cart123' };

      return expectSaga(cartSaga)
        .provide([
          [matchers.call.fn(apiClient.post), response],
        ])
        .put(addToCartSuccess(cartItem))
        .put(setCartId('cart123'))
        .dispatch(addToCartRequest(payload))
        .silentRun();
    });

    it('should handle add to cart failure', () => {
      const payload = { productId: 'prod1', qty: 2, price: 10.99 };
      const error = new Error('Network error');

      return expectSaga(cartSaga)
        .provide([
          [matchers.call.fn(apiClient.post), throwError(error)],
        ])
        .put(addToCartFailure('Network error'))
        .dispatch(addToCartRequest(payload))
        .silentRun();
    });

    it('should handle add to cart failure with no error message', () => {
      const payload = { productId: 'prod1', qty: 2, price: 10.99 };

      return expectSaga(cartSaga)
        .provide([
          [matchers.call.fn(apiClient.post), throwError({})],
        ])
        .put(addToCartFailure('Failed to add item to cart'))
        .dispatch(addToCartRequest(payload))
        .silentRun();
    });
  });

  describe('handleRemoveFromCart', () => {
    it('should remove item from cart successfully', () => {
      const itemId = 'item1';

      return expectSaga(cartSaga)
        .provide([
          [matchers.call.fn(apiClient.delete), undefined],
        ])
        .put(removeFromCartSuccess(itemId))
        .dispatch(removeFromCartRequest(itemId))
        .silentRun();
    });

    it('should handle remove from cart failure', () => {
      const itemId = 'item1';
      const error = new Error('Failed to delete');

      return expectSaga(cartSaga)
        .provide([
          [matchers.call.fn(apiClient.delete), throwError(error)],
        ])
        .put(removeFromCartFailure('Failed to delete'))
        .dispatch(removeFromCartRequest(itemId))
        .silentRun();
    });

    it('should handle remove from cart failure with no error message', () => {
      const itemId = 'item1';

      return expectSaga(cartSaga)
        .provide([
          [matchers.call.fn(apiClient.delete), throwError({})],
        ])
        .put(removeFromCartFailure('Failed to remove item from cart'))
        .dispatch(removeFromCartRequest(itemId))
        .silentRun();
    });
  });

  describe('handleUpdateCartItemQty', () => {
    it('should update cart item quantity successfully', () => {
      const payload = { id: 'item1', qty: 5 };

      return expectSaga(cartSaga)
        .provide([
          [matchers.call.fn(apiClient.patch), undefined],
        ])
        .dispatch(updateCartItemQty(payload))
        .silentRun();
    });

    it('should handle update quantity failure gracefully', () => {
      const payload = { id: 'item1', qty: 5 };
      const error = new Error('Update failed');

      // Should not throw, just log error
      return expectSaga(cartSaga)
        .provide([
          [matchers.call.fn(apiClient.patch), throwError(error)],
        ])
        .dispatch(updateCartItemQty(payload))
        .silentRun();
    });
  });
});
