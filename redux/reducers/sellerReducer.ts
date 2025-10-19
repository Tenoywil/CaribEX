import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SellerState, Product, ProductFormData } from '@/types';

const initialState: SellerState = {
  myProducts: {
    byId: {},
    allIds: [],
  },
  loading: false,
  error: null,
  createSuccess: false,
  updateSuccess: false,
};

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    // Fetch seller's products
    fetchMyProductsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMyProductsSuccess: (state, action: PayloadAction<Product[]>) => {
      state.myProducts.byId = {};
      state.myProducts.allIds = [];
      action.payload.forEach((product) => {
        state.myProducts.byId[product.id] = product;
        state.myProducts.allIds.push(product.id);
      });
      state.loading = false;
    },
    fetchMyProductsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create product
    createProductRequest: (state, _action: PayloadAction<ProductFormData>) => {
      state.loading = true;
      state.error = null;
      state.createSuccess = false;
    },
    createProductSuccess: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      state.myProducts.byId[product.id] = product;
      state.myProducts.allIds.push(product.id);
      state.loading = false;
      state.createSuccess = true;
    },
    createProductFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.createSuccess = false;
    },

    // Update product
    updateProductRequest: (state, _action: PayloadAction<{ id: string; data: Partial<ProductFormData> }>) => {
      state.loading = true;
      state.error = null;
      state.updateSuccess = false;
    },
    updateProductSuccess: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      state.myProducts.byId[product.id] = product;
      state.loading = false;
      state.updateSuccess = true;
    },
    updateProductFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.updateSuccess = false;
    },

    // Delete product
    deleteProductRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    deleteProductSuccess: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      delete state.myProducts.byId[productId];
      state.myProducts.allIds = state.myProducts.allIds.filter(id => id !== productId);
      state.loading = false;
    },
    deleteProductFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear success flags
    clearSellerMessages: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.error = null;
    },
  },
});

export const {
  fetchMyProductsRequest,
  fetchMyProductsSuccess,
  fetchMyProductsFailure,
  createProductRequest,
  createProductSuccess,
  createProductFailure,
  updateProductRequest,
  updateProductSuccess,
  updateProductFailure,
  deleteProductRequest,
  deleteProductSuccess,
  deleteProductFailure,
  clearSellerMessages,
} = sellerSlice.actions;

export const sellerReducer = sellerSlice.reducer;
