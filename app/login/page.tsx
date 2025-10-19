'use client';

import { ConnectWalletButton } from '@/components/wallet/ConnectWalletButton';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/redux/selectors/authSelectors';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (isAuthenticated) {
      router.push('/wallet');
    }
  }, [isAuthenticated, router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <div className="max-w-md w-full mx-4">
        {/* Hero Section with Gradient */}
        <div className="gradient-primary rounded-2xl p-8 text-white text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to CaribEX</h1>
          <p className="text-lg opacity-90">
            Empowering Caribbean Trade & Finance
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#0E1116] mb-6 text-center">
            Connect Your Wallet
          </h2>
          
          <p className="text-[#4B5563] mb-8 text-center">
            Sign in with your Ethereum wallet to access the marketplace, send funds, and manage your transactions.
          </p>

          <div className="flex justify-center">
            <ConnectWalletButton />
          </div>

          <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
            <p className="text-sm text-[#4B5563] text-center">
              New to crypto wallets?{' '}
              <a href="/help" className="text-[#0074F0] hover:underline">
                Learn how to get started
              </a>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-[#00B878] text-2xl mb-2">🛍️</div>
            <p className="text-sm text-[#4B5563]">Shop Marketplace</p>
          </div>
          <div>
            <div className="text-[#0074F0] text-2xl mb-2">💰</div>
            <p className="text-sm text-[#4B5563]">Send & Receive</p>
          </div>
          <div>
            <div className="text-[#F5B700] text-2xl mb-2">📊</div>
            <p className="text-sm text-[#4B5563]">Track Funds</p>
          </div>
        </div>
      </div>
    </div>
  );
}
