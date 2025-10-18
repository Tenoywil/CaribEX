'use client';

import { Product } from '@/types';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const handleAddToCart = () => {
    onAddToCart(product.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square bg-gray-200 relative">
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            {product.currency} {product.price.toFixed(2)}
          </span>

          {product.stock > 0 ? (
            <button
              onClick={handleAddToCart}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Add to Cart
            </button>
          ) : (
            <span className="text-sm text-red-600 font-semibold">Out of Stock</span>
          )}
        </div>

        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-xs text-orange-600 mt-2">
            Only {product.stock} left in stock
          </p>
        )}
      </div>
    </div>
  );
};
