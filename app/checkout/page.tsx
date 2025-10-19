'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsCheckingSession } from '@/redux/selectors/authSelectors';
import { CheckoutForm } from '@/components/cart/CheckoutForm';
import { Loader } from '@/components/ui/Loader';

export default function CheckoutPage() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isCheckingSession = useSelector(selectIsCheckingSession);

  useEffect(() => {
    // Wait for session check to complete before redirecting
    if (!isCheckingSession && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isCheckingSession, router]);

  // Show loading state while checking session or if not authenticated
  if (isCheckingSession || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
