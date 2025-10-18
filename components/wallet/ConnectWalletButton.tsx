'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { useEffect, useState } from 'react';
import { selectIsAuthenticated, selectUser } from '@/redux/selectors/authSelectors';
import { logout, loginRequest } from '@/redux/reducers/authReducer';
import { apiClient } from '@/lib/apiClient';
import { SiweMessage } from 'siwe';

export const ConnectWalletButton = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // When wallet connects, trigger SIWE authentication
  useEffect(() => {
    if (isConnected && address && !isAuthenticated) {
      handleSIWEAuth();
    }
  }, [isConnected, address, isAuthenticated]);

  const handleSIWEAuth = async () => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Get nonce from backend
      const { nonce } = await apiClient.get<{ nonce: string }>('/v1/auth/nonce');

      // Step 2: Create SIWE message
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in to CaribEX with your Ethereum wallet',
        uri: window.location.origin,
        version: '1',
        chainId: 1, // Use the appropriate chain ID
        nonce,
      });

      const messageString = message.prepareMessage();

      // Step 3: Sign the message with wallet
      const signature = await signMessageAsync({ message: messageString });

      // Step 4: Send signature to backend for verification
      dispatch(loginRequest({ signature, message: messageString }));
    } catch (err: any) {
      console.error('SIWE authentication error:', err);
      setError(err.message || 'Authentication failed');
      disconnect();
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    setError(null);
    // Connect with the first available connector (usually MetaMask/injected)
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    dispatch(logout());
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <div className="font-medium">{user.handle}</div>
          <div className="text-gray-500 font-mono text-xs">
            {user.wallet.slice(0, 6)}...{user.wallet.slice(-4)}
          </div>
        </div>
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleConnect}
        disabled={isLoading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Connecting...' : 'Connect Wallet'}
      </button>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
