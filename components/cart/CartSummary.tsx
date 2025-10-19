'use client';

import { useSelector } from 'react-redux';
import {
  selectCartTotal,
  selectCartItemCount,
} from '@/redux/selectors/cartSelectors';
import { selectIsAuthenticated } from '@/redux/selectors/authSelectors';
import Link from 'next/link';

export const CartSummary = () => {
  const total = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartItemCount);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const shipping = 5.0; // Flat shipping rate
  const tax = total * 0.1; // 10% tax
  const grandTotal = total + shipping + tax;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Items ({itemCount}):</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping:</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax:</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {isAuthenticated ? (
        <Link
          href="/checkout"
          className="block w-full py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 font-semibold"
        >
          Proceed to Checkout
        </Link>
      ) : (
        <Link
          href="/login"
          className="block w-full py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 font-semibold"
        >
          Sign In to Checkout
        </Link>
      )}

      <Link
        href="/marketplace"
        className="block w-full mt-3 py-3 bg-gray-100 text-gray-700 text-center rounded-lg hover:bg-gray-200"
      >
        Continue Shopping
      </Link>
    </div>
  );
};
