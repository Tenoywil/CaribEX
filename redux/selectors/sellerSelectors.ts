import { createSelector } from 'reselect';
import { RootState } from '@/types';

// Base selector
const selectSellerState = (state: RootState & { seller: unknown }) => state.seller;

// Memoized selectors
export const selectMyProducts = createSelector(
  [selectSellerState],
  (seller) => {
    if (!seller || !seller.myProducts) return [];
    return seller.myProducts.allIds.map((id: string) => seller.myProducts.byId[id]);
  }
);

export const selectMyProductById = (id: string) =>
  createSelector([selectSellerState], (seller) => {
    if (!seller || !seller.myProducts) return null;
    return seller.myProducts.byId[id] || null;
  });

export const selectSellerLoading = createSelector(
  [selectSellerState],
  (seller) => seller?.loading || false
);

export const selectSellerError = createSelector(
  [selectSellerState],
  (seller) => seller?.error || null
);

export const selectCreateSuccess = createSelector(
  [selectSellerState],
  (seller) => seller?.createSuccess || false
);

export const selectUpdateSuccess = createSelector(
  [selectSellerState],
  (seller) => seller?.updateSuccess || false
);
