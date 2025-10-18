'use client';

import { useWallet } from '@/hooks/useWallet';
import { Loader } from '@/components/ui/Loader';

export const WalletBalance = () => {
  const { balance, currency, loading } = useWallet();

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Wallet Balance</h2>
      <div className="text-3xl font-bold text-gray-900">
        {currency} {balance.toFixed(2)}
      </div>
      <div className="mt-4 flex gap-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Send
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Receive
        </button>
      </div>
    </div>
  );
};
