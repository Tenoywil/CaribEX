'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { isAddress } from 'viem';
import { SendConfirmation } from './SendConfirmation';

export const SendForm = () => {
  const { address, isConnected, chainId } = useAccount();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    setError(null);

    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return false;
    }

    if (!to) {
      setError('Please enter a recipient address');
      return false;
    }

    if (!isAddress(to)) {
      setError('Invalid recipient address');
      return false;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    // Check that chainId matches expected network
    if (chainId !== 1 && chainId !== 11155111) {
      setError('Please switch to Ethereum Mainnet or Sepolia testnet');
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  const handleSuccess = (txHash: string) => {
    // Reset form
    setTo('');
    setAmount('');
    setNote('');
    setShowConfirmation(false);
    setError(null);
    
    // Show success message
    alert(`Transaction sent successfully! Hash: ${txHash}`);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Send Funds</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Wallet Address
            </label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (ETH)
            </label>
            <input
              type="number"
              step="0.000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Payment for..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              rows={3}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {!isConnected && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                Please connect your wallet to send funds
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={!isConnected}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </form>
      </div>

      <SendConfirmation
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        to={to}
        amount={amount}
        note={note}
        onSuccess={handleSuccess}
      />
    </>
  );
};
