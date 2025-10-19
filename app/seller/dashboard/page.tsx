'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/redux/selectors/authSelectors';
import {
  fetchMyProductsRequest,
  deleteProductRequest,
} from '@/redux/reducers/sellerReducer';
import {
  selectMyProducts,
  selectSellerLoading,
} from '@/redux/selectors/sellerSelectors';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import Link from 'next/link';
import { Product } from '@/types';

export default function SellerDashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const myProducts = useSelector(selectMyProducts);
  const loading = useSelector(selectSellerLoading);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    // Fetch seller's products on mount
    dispatch(fetchMyProductsRequest());
  }, [isAuthenticated, router, dispatch]);

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProductRequest(productId));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your product listings</p>
        </div>
        <Link href="/seller/create" className="btn-primary">
          + Create New Product
        </Link>
      </div>

      {loading && myProducts.length === 0 ? (
        <div className="flex justify-center py-20">
          <Loader size="lg" />
        </div>
            ) : !loading && myProducts.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Create your first product listing to start selling on CaribEX"
          action={
            <button
              className="btn-primary mt-4"
              onClick={() => router.push('/seller/create')}
            >
              + Create New Product
            </button>
          }
        />
            ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProducts.map((product: Product) => (
            <div
              key={product.id}
              className="card hover:shadow-lg transition-shadow"
            >
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}

              <h3 className="text-lg font-semibold mb-2 text-gray-900">
                {product.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>

              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-blue-600">
                  ETH {product.price}
                </span>
                <span className="text-sm text-gray-500">
                  Stock: {product.quantity}
                </span>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/seller/edit/${product.id}`}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>

              <Link
                href={`/products/${product.id}`}
                className="block mt-2 text-center px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View in Marketplace
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Seller Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use high-quality images to attract more buyers</li>
          <li>
            • Write detailed descriptions to help customers make informed
            decisions
          </li>
          <li>• Price competitively and keep your stock updated</li>
          <li>• Respond quickly to customer inquiries for better ratings</li>
        </ul>
      </div>
    </div>
  );
}
