'use client';

import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '@/redux/selectors/authSelectors';
import { logout } from '@/redux/reducers/authReducer';

export const ConnectWalletButton = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const handleConnect = async () => {
    // This would trigger the SIWE flow
    // For now, it's a placeholder
    console.log('Connect wallet clicked');
  };

  const handleDisconnect = () => {
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
    <button
      onClick={handleConnect}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
    >
      Connect Wallet
    </button>
  );
};
