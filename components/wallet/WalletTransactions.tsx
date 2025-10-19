'use client';

import { useWallet } from '@/hooks/useWallet';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';

export const WalletTransactions = () => {
  const { transactions, loading } = useWallet();

  if (loading) {
    return <Loader />;
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions yet"
        description="Your transaction history will appear here"
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    tx.type === 'send'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {tx.type === 'send' ? 'Sent' : 'Received'}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    tx.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : tx.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {tx.status}
                </span>
              </div>

              <div className="text-sm text-gray-600">
                {tx.type === 'send' ? 'To: ' : 'From: '}
                <span className="font-mono">{tx.type === 'send' ? tx.to : tx.from}</span>
              </div>

              <div className="text-xs text-gray-500 mt-1">
                {new Date(tx.timestamp).toLocaleString()}
              </div>
            </div>

            <div className="text-right">
              <div
                className={`text-lg font-semibold ${
                  tx.type === 'send' ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {tx.type === 'send' ? '-' : '+'}
                {tx.currency} {tx.amount.toFixed(2)}
              </div>
              {tx.txHash && (
                <a
                  href={`https://etherscan.io/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  View on Explorer
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
