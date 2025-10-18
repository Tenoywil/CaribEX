'use client';

import { Product } from '@/types';
import { useState } from 'react';

interface ProductDetailsProps {
  product: Product;
  onAddToCart: (productId: string, quantity: number) => void;
}

export const ProductDetails = ({ product, onAddToCart }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity);
  };

  const handleQuantityChange = (delta: number) => {
    const newQty = Math.max(1, Math.min(product.stock, quantity + delta));
    setQuantity(newQty);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Image Gallery */}
      <div>
        <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
          {product.images && product.images[selectedImage] ? (
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
        </div>

        {product.images && product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`aspect-square rounded-lg overflow-hidden border-2 ${
                  selectedImage === idx ? 'border-blue-600' : 'border-gray-200'
                }`}
              >
                <img src={image} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

        <div className="mb-4">
          <span className="text-3xl font-bold text-blue-600">
            {product.currency} {product.price.toFixed(2)}
          </span>
        </div>

        <p className="text-gray-600 mb-6">{product.description}</p>

        <div className="border-t border-gray-200 pt-6 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Category:</span>
              <span className="ml-2 font-medium">{product.category}</span>
            </div>
            <div>
              <span className="text-gray-500">Stock:</span>
              <span className="ml-2 font-medium">
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>
          </div>
        </div>

        {product.stock > 0 && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Add to Cart
            </button>
          </>
        )}

        {product.stock === 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <span className="text-red-600 font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
    </div>
  );
};
