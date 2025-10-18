import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductsState, Product } from '@/types';

const initialState: ProductsState = {
  byId: {},
  allIds: [],
  listMeta: {
    page: 1,
    total: 0,
    perPage: 20,
  },
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProductsRequest: (state, _action: PayloadAction<{ page?: number; limit?: number }>) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess: (
      state,
      action: PayloadAction<{ products: Product[]; page: number; total: number }>
    ) => {
      const { products, page, total } = action.payload;
      products.forEach((product) => {
        state.byId[product.id] = product;
        if (!state.allIds.includes(product.id)) {
          state.allIds.push(product.id);
        }
      });
      state.listMeta = { ...state.listMeta, page, total };
      state.loading = false;
    },
    fetchProductsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchProductByIdRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductByIdSuccess: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      state.byId[product.id] = product;
      if (!state.allIds.includes(product.id)) {
        state.allIds.push(product.id);
      }
      state.loading = false;
    },
    fetchProductByIdFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    invalidateProducts: (state) => {
      // Mark for cache invalidation - saga will handle actual refetch
      state.loading = false;
    },
  },
});

export const {
  fetchProductsRequest,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchProductByIdRequest,
  fetchProductByIdSuccess,
  fetchProductByIdFailure,
  invalidateProducts,
} = productsSlice.actions;

export const productsReducer = productsSlice.reducer;
