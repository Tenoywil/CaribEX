'use client';

import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsCheckingSession } from '@/redux/selectors/authSelectors';
import { CartList } from '@/components/cart/CartList';
import { CartSummary } from '@/components/cart/CartSummary';

export default function CartPage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isCheckingSession = useSelector(selectIsCheckingSession);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {!isCheckingSession && !isAuthenticated && (
        <div className="mb-6 card bg-blue-50 border-blue-200">
          <p className="text-[#0074F0]">
            <a href="/login" className="font-semibold hover:underline">
              Sign in
            </a>{' '}
            to proceed to checkout and complete your purchase.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartList />
        </div>
        
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
