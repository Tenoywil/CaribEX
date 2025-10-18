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
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-gradient">CaribEX</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link 
              href="/marketplace" 
              className="text-[#4B5563] hover:text-[#0074F0] font-medium transition-colors"
            >
              Marketplace
            </Link>
            <Link 
              href="/wallet" 
              className="text-[#4B5563] hover:text-[#0074F0] font-medium transition-colors"
            >
              Wallet
            </Link>
            <Link 
              href="/cart" 
              className="relative text-[#4B5563] hover:text-[#0074F0] font-medium transition-colors"
            >
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#EF4444] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#4B5563] font-medium">
                  {user?.handle || 'User'}
                </span>
                <Link
                  href="/profile"
                  className="btn-primary"
                >
                  Profile
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="btn-primary"
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
