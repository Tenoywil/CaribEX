import { createSelector } from 'reselect';
import { RootState } from '@/types';

// Base selector
const selectProductsState = (state: RootState) => state.products;

// Memoized selectors
export const selectAllProducts = createSelector([selectProductsState], (products) =>
  products.allIds.map((id) => products.byId[id])
);

export const selectProductById = (productId: string) =>
  createSelector([selectProductsState], (products) => products.byId[productId]);

export const selectProductsLoading = createSelector(
  [selectProductsState],
  (products) => products.loading
);

export const selectProductsError = createSelector(
  [selectProductsState],
  (products) => products.error
);

export const selectProductsListMeta = createSelector(
  [selectProductsState],
  (products) => products.listMeta
);
