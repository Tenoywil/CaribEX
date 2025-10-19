'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
  selectCartItems,
  selectCartTotal,
  selectCartError,
  selectCartLoading,
} from '@/redux/selectors/cartSelectors';
import {
  removeFromCartRequest,
  updateCartItemQty,
} from '@/redux/reducers/cartReducer';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/ToastContainer';

export const CartList = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const cartError = useSelector(selectCartError);
  const cartLoading = useSelector(selectCartLoading);
  const { showToast } = useToast();

  // Show toast when cart error occurs
  useEffect(() => {
    if (cartError) {
      showToast(cartError, 'error');
    }
  }, [cartError, showToast]);

  const handleRemove = (itemId: string) => {
    if (cartLoading) {
      return; // Prevent multiple rapid clicks
    }
    dispatch(removeFromCartRequest(itemId));
    showToast('Item removed from cart', 'success');
  };

  const handleQuantityChange = (itemId: string, newQty: number) => {
    if (newQty > 0) {
      dispatch(updateCartItemQty({ id: itemId, qty: newQty }));
    }
  };

  if (cartItems.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add some products to your cart to get started"
        action={
          <a
            href="/marketplace"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Products
          </a>
        }
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Product #{item.productId}</h3>
              <p className="text-sm text-gray-600">
                ${item.price.toFixed(2)} each
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(item.id, item.qty - 1)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={item.qty <= 1 || cartLoading}
              >
                -
              </button>
              <span className="w-12 text-center font-semibold">{item.qty}</span>
              <button
                onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={cartLoading}
              >
                +
              </button>
            </div>

            <div className="w-24 text-right font-semibold">
              ${(item.price * item.qty).toFixed(2)}
            </div>

            <button
              onClick={() => handleRemove(item.id)}
              className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={cartLoading}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
