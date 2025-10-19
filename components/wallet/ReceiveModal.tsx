'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/selectors/authSelectors';

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiveModal = ({ isOpen, onClose }: ReceiveModalProps) => {
  const user = useSelector(selectUser);
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);

  const walletAddress = user?.wallet || '0x0000000000000000000000000000000000000000';

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Receive Funds</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* QR Code Placeholder */}
          <div className="flex justify-center">
            <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-sm">QR Code</span>
            </div>
          </div>

          {/* Wallet Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Wallet Address
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={walletAddress}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Optional Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Specific Amount (Optional)
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Share your wallet address or QR code with the sender. They can use any
              compatible wallet to send funds to this address.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
