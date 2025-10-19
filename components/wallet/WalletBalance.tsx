'use client';

import { useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { Loader } from '@/components/ui/Loader';

export const WalletBalance = () => {
  const { address, isConnected } = useAccount();
  const { data: balance, refetch, isLoading } = useBalance({
    address,
  });

  // Poll for balance updates every 10 seconds to detect incoming transactions
  useEffect(() => {
    if (!isConnected || !address) return;

    const interval = setInterval(() => {
      refetch();
    }, 10000);

    return () => clearInterval(interval);
  }, [isConnected, address, refetch]);

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Wallet Balance</h2>
        <div className="text-center py-4">
          <p className="text-gray-500">Please connect your wallet</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Wallet Balance</h2>
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Wallet Balance</h2>
      
      {/* Address Display */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-1">Address</p>
        <p className="font-mono text-sm text-gray-700">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      </div>

      {/* Balance Display */}
      <div className="text-3xl font-bold text-gray-900">
        {balance?.formatted ? parseFloat(balance.formatted).toFixed(4) : '0.0000'} {balance?.symbol || 'ETH'}
      </div>

      {/* Auto-refresh indicator */}
      <div className="mt-2">
        <p className="text-xs text-gray-500">
          🔄 Auto-refreshes every 10 seconds
        </p>
      </div>
    </div>
  );
};
