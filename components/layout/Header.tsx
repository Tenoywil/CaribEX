'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '@/redux/selectors/authSelectors';
import { selectCartItemCount } from '@/redux/selectors/cartSelectors';

export const Header = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const cartItemCount = useSelector(selectCartItemCount);

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            CaribEX
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/marketplace" className="text-gray-700 hover:text-blue-600">
              Marketplace
            </Link>
            <Link href="/wallet" className="text-gray-700 hover:text-blue-600">
              Wallet
            </Link>
            <Link href="/cart" className="relative text-gray-700 hover:text-blue-600">
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {user?.handle || 'User'}
                </span>
                <Link
                  href="/profile"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Profile
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Connect Wallet
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
