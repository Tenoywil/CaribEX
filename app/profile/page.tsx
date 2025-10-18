'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '@/redux/selectors/authSelectors';
import { Loader } from '@/components/ui/Loader';

export default function ProfilePage() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-[#0E1116]">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold mb-6 text-[#0E1116]">Account Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#4B5563] font-medium">Username</label>
                <div className="mt-1 text-[#0E1116] font-medium">
                  {user?.handle || 'Not set'}
                </div>
              </div>

              <div>
                <label className="text-sm text-[#4B5563] font-medium">Wallet Address</label>
                <div className="mt-1 text-[#0E1116] font-mono text-sm">
                  {user?.wallet || 'Not connected'}
                </div>
              </div>

              <div className="pt-4">
                <button className="btn-secondary">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          <div className="card mt-6">
            <h2 className="text-xl font-semibold mb-6 text-[#0E1116]">Security</h2>
            <p className="text-[#4B5563] mb-4">
              Your account is secured with blockchain wallet authentication.
            </p>
            <button className="btn-secondary">
              Manage Security Settings
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-xl font-semibold mb-6 text-[#0E1116]">Quick Actions</h2>
            
            <div className="space-y-3">
              <a href="/wallet" className="block btn-primary text-center">
                View Wallet
              </a>
              <a href="/marketplace" className="block btn-secondary text-center">
                Browse Marketplace
              </a>
              <a href="/cart" className="block btn-secondary text-center">
                My Cart
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
