'use client';

import { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  viewMode?: 'grid' | 'list';
}

export const ProductCard = ({
  product,
  onAddToCart,
  viewMode = 'grid',
}: ProductCardProps) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product.id);
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isNew =
    new Date(product.createdAt) >
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  if (viewMode === 'list') {
    return (
      <Link href={`/products/${product.id}`}>
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="sm:w-64 h-48 sm:h-auto bg-gradient-to-br from-gray-100 to-gray-200 relative flex-shrink-0">
              {product.images && product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg
                    className="w-16 h-16"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {isNew && (
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    NEW
                  </span>
                )}
                {isLowStock && (
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    LOW STOCK
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full ml-4">
                    {product.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {product.currency} {product.price.toFixed(2)}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : 'Out of stock'}
                  </p>
                </div>

                {product.stock > 0 ? (
                  <button
                    onClick={handleAddToCart}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    Add to Cart
                  </button>
                ) : (
                  <span className="text-sm text-red-600 font-semibold bg-red-50 px-4 py-2 rounded-lg">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view
  return (
    <Link href={`/products/${product.id}`}>
      <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full flex flex-col">
        {/* Image Container */}
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
          {product.images && product.images[0] ? (
            <>
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-20 h-20"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isNew && (
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                NEW
              </span>
            )}
            {isLowStock && (
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                LOW STOCK
              </span>
            )}
          </div>

          {/* Quick View Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full py-2 bg-white text-blue-600 rounded-lg font-semibold shadow-lg hover:bg-blue-50 transition-colors"
            >
              Quick Add
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="mb-2">
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {product.category ?? ' Uncategorized'}
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {product.title}
          </h3>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
            {product.description}
          </p>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {product.currency} {product.price.toFixed(2)}
              </span>
            </div>

            {product.stock > 0 ? (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {product.stock} in stock
                </span>
                <button
                  onClick={handleAddToCart}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 text-sm font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                >
                  Add to Cart
                </button>
              </div>
            ) : (
              <span className="block text-center text-sm text-red-600 font-semibold bg-red-50 px-4 py-2 rounded-lg">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
