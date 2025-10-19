'use client';

import { useState } from 'react';
import { parseEther } from 'viem';
import { useSendTransaction, useWaitForTransactionReceipt, useAccount } from 'wagmi';

interface SendConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  to: string;
  amount: string;
  note?: string;
  onSuccess?: (txHash: string) => void;
}

export const SendConfirmation = ({
  isOpen,
  onClose,
  to,
  amount,
  note,
  onSuccess,
}: SendConfirmationProps) => {
  const { chainId } = useAccount();
  const { sendTransaction, data: hash, error: sendError } = useSendTransaction();
  const { isSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });
  const [isSending, setIsSending] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const handleSend = async () => {
    try {
      setIsSending(true);
      setVerificationError(null);

      // Send transaction via wagmi
      await sendTransaction({
        to: to as `0x${string}`,
        value: parseEther(amount),
      });
    } catch (error: unknown) {
      console.error('Send transaction error:', error);
      setIsSending(false);
    }
  };

  // Verify transaction via backend when confirmed
  const verifyTransaction = async (txHash: string) => {
    try {
      await fetch('/api/tx/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash, chainId: chainId || 1 }),
      });

      if (onSuccess) {
        onSuccess(txHash);
      }
    } catch (error: unknown) {
      console.error('Verification error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Verification failed';
      setVerificationError(errorMessage);
    }
  };

  // Handle success
  if (isSuccess && hash) {
    verifyTransaction(hash);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Confirm Transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            disabled={isSending || isConfirming}
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Recipient:</span>
              <span className="font-mono text-sm">{to.slice(0, 10)}...{to.slice(-8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-lg">{amount} ETH</span>
            </div>
            {note && (
              <div className="flex justify-between">
                <span className="text-gray-600">Note:</span>
                <span className="text-sm">{note}</span>
              </div>
            )}
          </div>

          {/* Status Messages */}
          {isConfirming && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Transaction submitted. Waiting for confirmation...
              </p>
            </div>
          )}

          {isSuccess && hash && !verificationError && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                Transaction confirmed! Hash: {hash.slice(0, 10)}...{hash.slice(-8)}
              </p>
            </div>
          )}

          {sendError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{sendError.message}</p>
            </div>
          )}

          {verificationError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                Transaction sent but verification failed: {verificationError}
              </p>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-blue-800">
              🔒 Your transaction will be verified via backend RPC for security. Never share your private keys.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!isSuccess && (
              <>
                <button
                  onClick={onClose}
                  disabled={isSending || isConfirming}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={isSending || isConfirming}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSending || isConfirming ? 'Processing...' : 'Sign & Send'}
                </button>
              </>
            )}
            {isSuccess && (
              <button
                onClick={onClose}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
