import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
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
} from '../reducers/sellerReducer';
import { invalidateProducts } from '../reducers/productsReducer';
import { apiClient } from '@/lib/apiClient';
import { Product, ProductFormData } from '@/types';

// Worker saga: fetch seller's products
function* handleFetchMyProducts() {
  try {
    const products: Product[] = yield call([apiClient, 'get'], '/v1/seller/products');
    yield put(fetchMyProductsSuccess(products));
  } catch (error: any) {
    yield put(fetchMyProductsFailure(error.message || 'Failed to fetch your products'));
  }
}

// Worker saga: create product
function* handleCreateProduct(action: PayloadAction<ProductFormData>) {
  try {
    const product: Product = yield call([apiClient, 'post'], '/v1/seller/products', action.payload);
    yield put(createProductSuccess(product));
    // Invalidate products cache to show new product in marketplace
    yield put(invalidateProducts());
  } catch (error: any) {
    yield put(createProductFailure(error.message || 'Failed to create product'));
  }
}

// Worker saga: update product
function* handleUpdateProduct(action: PayloadAction<{ id: string; data: Partial<ProductFormData> }>) {
  try {
    const { id, data } = action.payload;
    const product: Product = yield call([apiClient, 'put'], `/v1/seller/products/${id}`, data);
    yield put(updateProductSuccess(product));
    // Invalidate products cache to show updated product
    yield put(invalidateProducts());
  } catch (error: any) {
    yield put(updateProductFailure(error.message || 'Failed to update product'));
  }
}

// Worker saga: delete product
function* handleDeleteProduct(action: PayloadAction<string>) {
  try {
    const productId = action.payload;
    yield call([apiClient, 'delete'], `/v1/seller/products/${productId}`);
    yield put(deleteProductSuccess(productId));
    // Invalidate products cache to remove deleted product
    yield put(invalidateProducts());
  } catch (error: any) {
    yield put(deleteProductFailure(error.message || 'Failed to delete product'));
  }
}

// Watcher saga
export default function* sellerSaga() {
  yield takeLatest(fetchMyProductsRequest.type, handleFetchMyProducts);
  yield takeLatest(createProductRequest.type, handleCreateProduct);
  yield takeLatest(updateProductRequest.type, handleUpdateProduct);
  yield takeLatest(deleteProductRequest.type, handleDeleteProduct);
}
