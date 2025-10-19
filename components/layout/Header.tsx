'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '@/redux/selectors/authSelectors';
import { selectCartItemCount } from '@/redux/selectors/cartSelectors';
import { logout } from '@/redux/reducers/authReducer';

export const Header = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const cartItemCount = useSelector(selectCartItemCount);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-gradient">CaribEX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
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
              <>
                {/* Additional navigation for logged-in users */}
                <Link 
                  href="/checkout" 
                  className="text-[#4B5563] hover:text-[#0074F0] font-medium transition-colors"
                >
                  Orders
                </Link>
                <Link 
                  href="/seller/dashboard" 
                  className="text-[#4B5563] hover:text-[#0074F0] font-medium transition-colors"
                >
                  Sell
                </Link>
                
                {/* User menu dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-[#4B5563] hover:text-[#0074F0] font-medium transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user?.handle?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span>{user?.handle || 'User'}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      
                      {/* Dropdown menu */}
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user?.handle || 'User'}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.wallet_address}</p>
                        </div>
                        
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </Link>
                        
                        <Link
                          href="/wallet"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          Wallet
                        </Link>
                        
                        <div className="border-t border-gray-100 my-2"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="btn-primary"
              >
                Connect Wallet
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {/* Cart icon for mobile */}
            <Link href="/cart" className="relative">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#EF4444] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-3">
              <Link
                href="/marketplace"
                className="text-gray-700 hover:text-blue-600 font-medium py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Marketplace
              </Link>
              <Link
                href="/wallet"
                className="text-gray-700 hover:text-blue-600 font-medium py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Wallet
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    href="/checkout"
                    className="text-gray-700 hover:text-blue-600 font-medium py-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    href="/seller/dashboard"
                    className="text-gray-700 hover:text-blue-600 font-medium py-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sell
                  </Link>
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-blue-600 font-medium py-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                    className="text-left text-red-600 hover:text-red-700 font-medium py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold py-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Connect Wallet
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
