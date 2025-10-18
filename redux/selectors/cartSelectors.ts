import { createSelector } from 'reselect';
import { RootState } from '@/types';

// Base selector
const selectCartState = (state: RootState) => state.cart;

// Memoized selectors
export const selectCartItems = createSelector([selectCartState], (cart) => cart.items);

export const selectCartTotal = createSelector([selectCartState], (cart) => cart.total);

export const selectCartItemCount = createSelector(
  [selectCartState],
  (cart) => cart.items.reduce((sum, item) => sum + item.qty, 0)
);

export const selectCartLoading = createSelector([selectCartState], (cart) => cart.loading);

export const selectCartError = createSelector([selectCartState], (cart) => cart.error);

export const selectCartId = createSelector([selectCartState], (cart) => cart.id);
