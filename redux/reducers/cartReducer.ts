import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartState, CartItem } from '@/types';

const initialState: CartState = {
  id: null,
  items: [],
  total: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCartRequest: (
      state,
      _action: PayloadAction<{ productId: string; qty: number; price: number }>
    ) => {
      state.loading = true;
      state.error = null;
    },
    addToCartSuccess: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      if (existingItem) {
        existingItem.qty += action.payload.qty;
      } else {
        state.items.push(action.payload);
      }
      state.total = state.items.reduce((sum, item) => sum + item.price * item.qty, 0);
      state.loading = false;
    },
    addToCartFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    removeFromCartRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    removeFromCartSuccess: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + item.price * item.qty, 0);
      state.loading = false;
    },
    removeFromCartFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateCartItemQty: (state, action: PayloadAction<{ id: string; qty: number }>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.qty = action.payload.qty;
        state.total = state.items.reduce((sum, item) => sum + item.price * item.qty, 0);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.id = null;
    },
    setCartId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
  },
});

export const {
  addToCartRequest,
  addToCartSuccess,
  addToCartFailure,
  removeFromCartRequest,
  removeFromCartSuccess,
  removeFromCartFailure,
  updateCartItemQty,
  clearCart,
  setCartId,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
