'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { WalletBalance } from '@/components/wallet/WalletBalance';
import { WalletTransactions } from '@/components/wallet/WalletTransactions';
import { SendForm } from '@/components/wallet/SendForm';
import { ReceiveModal } from '@/components/wallet/ReceiveModal';

export default function WalletPage() {
  const { fetchBalance, fetchTransactions } = useWallet();
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showSendForm, setShowSendForm] = useState(false);

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, [fetchBalance, fetchTransactions]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0E1116] mb-2">Wallet</h1>
        <p className="text-[#4B5563]">Manage your funds and view transactions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Balance Card */}
        <div className="lg:col-span-1">
          <WalletBalance />
          
          <div className="mt-4 space-y-3">
            <button
              onClick={() => setShowSendForm(!showSendForm)}
              className="w-full btn-primary"
            >
              Send Funds
            </button>
            <button
              onClick={() => setShowReceiveModal(true)}
              className="w-full btn-secondary"
            >
              Receive Funds
            </button>
          </div>
        </div>

        {/* Transactions or Send Form */}
        <div className="lg:col-span-2">
          {showSendForm ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Send Funds</h2>
                <button
                  onClick={() => setShowSendForm(false)}
                  className="text-[#4B5563] hover:text-[#0E1116]"
                >
                  Cancel
                </button>
              </div>
              <SendForm />
            </div>
          ) : (
            <WalletTransactions />
          )}
        </div>
      </div>

      <ReceiveModal isOpen={showReceiveModal} onClose={() => setShowReceiveModal(false)} />
    </div>
  );
}
