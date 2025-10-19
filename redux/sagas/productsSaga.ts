import { call, put, takeLatest, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchProductsRequest,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchProductByIdRequest,
  fetchProductByIdSuccess,
  fetchProductByIdFailure,
  invalidateProducts,
} from '../reducers/productsReducer';
import { apiClient } from '@/lib/apiClient';
import { cacheClient } from '@/lib/cacheClient';
import { Product } from '@/types';

// Worker saga: fetch products with caching
function* handleFetchProducts(action: PayloadAction<{ page?: number; limit?: number }>) {
  try {
    const { page = 1, limit = 20 } = action.payload;
    const cacheKey = `products:page:${page}:limit:${limit}`;

    // Check L1 cache first
    const cached = cacheClient.get(cacheKey);
    if (cached !== undefined && cached !== null && Object.values(cached as { products: Product[]; page: number; total: number }).length > 0) {
      yield put(fetchProductsSuccess(cached as { products: Product[]; page: number; total: number }));
      return;
    }

    // Fetch from API
    const response: { products: Product[]; page: number; total: number } = yield call(
      [apiClient, 'get'],
      `/v1/products?page=${page}&limit=${limit}`
    );

    // Store in L1 cache
    cacheClient.set(cacheKey, response, 300); // 5 min TTL

    yield put(fetchProductsSuccess(response));
  } catch (error: any) {
    yield put(fetchProductsFailure(error.message || 'Failed to fetch products'));
  }
}

// Worker saga: fetch single product by ID
function* handleFetchProductById(action: PayloadAction<string>) {
  try {
    const productId = action.payload;
    const cacheKey = `product:${productId}`;

    // Check L1 cache
    const cached = cacheClient.get(cacheKey);
    if (cached !== undefined && cached !== null && Object.values(cached as Product).length > 0) {
      yield put(fetchProductByIdSuccess(cached as Product));
      return;
    }

    // Fetch from API
    const product: Product = yield call([apiClient, 'get'], `/v1/products/${productId}`);

    // Store in L1 cache
    cacheClient.set(cacheKey, product, 300);

    yield put(fetchProductByIdSuccess(product));
  } catch (error: any) {
    yield put(fetchProductByIdFailure(error.message || 'Failed to fetch product'));
  }
}

// Worker saga: invalidate product cache
function* handleInvalidateProducts() {
  try {
    // Clear L1 cache
    cacheClient.clear('products:');

    // Notify backend to invalidate L2 cache
    yield call(apiClient.post, '/internal/cache/invalidate', {
      pattern: 'products:*',
    });

    // Refetch current page
    const currentPage: number = yield select((state: any) => state.products.listMeta.page);
    yield put(fetchProductsRequest({ page: currentPage }));
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
}

// Watcher saga
export default function* productsSaga() {
  yield takeLatest(fetchProductsRequest.type, handleFetchProducts);
  yield takeLatest(fetchProductByIdRequest.type, handleFetchProductById);
  yield takeLatest(invalidateProducts.type, handleInvalidateProducts);
}
