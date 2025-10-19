import { cartReducer } from '@/redux/reducers/cartReducer';
import {
  addToCartRequest,
  addToCartSuccess,
  addToCartFailure,
  removeFromCartRequest,
  removeFromCartSuccess,
  removeFromCartFailure,
  updateCartItemQty,
  clearCart,
  setCartId,
} from '@/redux/reducers/cartReducer';
import { CartState, CartItem } from '@/types';

describe('cartReducer', () => {
  const initialState: CartState = {
    id: null,
    items: [],
    total: 0,
    loading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('addToCart', () => {
    it('should handle addToCartRequest', () => {
      const action = addToCartRequest({ productId: '1', qty: 2, price: 10.99 });
      const state = cartReducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle addToCartSuccess with new item', () => {
      const requestState = cartReducer(initialState, addToCartRequest({ productId: '1', qty: 2, price: 10.99 }));
      const cartItem: CartItem = { id: 'item1', productId: '1', qty: 2, price: 10.99 };
      const action = addToCartSuccess(cartItem);
      const state = cartReducer(requestState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(cartItem);
      expect(state.total).toBe(21.98);
    });

    it('should handle addToCartSuccess with existing item (increment quantity)', () => {
      const existingItem: CartItem = { id: 'item1', productId: '1', qty: 2, price: 10.99 };
      const stateWithItem: CartState = {
        ...initialState,
        items: [existingItem],
        total: 21.98,
      };
      
      const newItem: CartItem = { id: 'item1', productId: '1', qty: 1, price: 10.99 };
      const action = addToCartSuccess(newItem);
      const state = cartReducer(stateWithItem, action);
      
      expect(state.items).toHaveLength(1);
      expect(state.items[0].qty).toBe(3);
      expect(state.total).toBe(32.97);
    });

    it('should handle addToCartFailure', () => {
      const requestState = cartReducer(initialState, addToCartRequest({ productId: '1', qty: 2, price: 10.99 }));
      const action = addToCartFailure('Network error');
      const state = cartReducer(requestState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
    });
  });

  describe('removeFromCart', () => {
    it('should handle removeFromCartRequest', () => {
      const action = removeFromCartRequest('item1');
      const state = cartReducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle removeFromCartSuccess', () => {
      const item1: CartItem = { id: 'item1', productId: '1', qty: 2, price: 10.99 };
      const item2: CartItem = { id: 'item2', productId: '2', qty: 1, price: 5.99 };
      const stateWithItems: CartState = {
        ...initialState,
        items: [item1, item2],
        total: 27.97,
        loading: true,
      };
      
      const action = removeFromCartSuccess('item1');
      const state = cartReducer(stateWithItems, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe('item2');
      expect(state.total).toBe(5.99);
    });

    it('should handle removeFromCartFailure', () => {
      const requestState = cartReducer(initialState, removeFromCartRequest('item1'));
      const action = removeFromCartFailure('Failed to remove item');
      const state = cartReducer(requestState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to remove item');
    });
  });

  describe('updateCartItemQty', () => {
    it('should update quantity of existing item', () => {
      const item: CartItem = { id: 'item1', productId: '1', qty: 2, price: 10.99 };
      const stateWithItem: CartState = {
        ...initialState,
        items: [item],
        total: 21.98,
      };
      
      const action = updateCartItemQty({ id: 'item1', qty: 5 });
      const state = cartReducer(stateWithItem, action);
      
      expect(state.items[0].qty).toBe(5);
      expect(state.total).toBe(54.95);
    });

    it('should not update if item not found', () => {
      const item: CartItem = { id: 'item1', productId: '1', qty: 2, price: 10.99 };
      const stateWithItem: CartState = {
        ...initialState,
        items: [item],
        total: 21.98,
      };
      
      const action = updateCartItemQty({ id: 'item2', qty: 5 });
      const state = cartReducer(stateWithItem, action);
      
      expect(state.items[0].qty).toBe(2);
      expect(state.total).toBe(21.98);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const item1: CartItem = { id: 'item1', productId: '1', qty: 2, price: 10.99 };
      const item2: CartItem = { id: 'item2', productId: '2', qty: 1, price: 5.99 };
      const stateWithItems: CartState = {
        ...initialState,
        id: 'cart123',
        items: [item1, item2],
        total: 27.97,
      };
      
      const action = clearCart();
      const state = cartReducer(stateWithItems, action);
      
      expect(state.items).toHaveLength(0);
      expect(state.total).toBe(0);
      expect(state.id).toBe(null);
    });
  });

  describe('setCartId', () => {
    it('should set cart ID', () => {
      const action = setCartId('cart123');
      const state = cartReducer(initialState, action);
      
      expect(state.id).toBe('cart123');
    });
  });
});
