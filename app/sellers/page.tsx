'use client';

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/redux/selectors/authSelectors';

export default function SellersPage() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Navigate to product creation page
      router.push('/seller/create');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-primary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Become a Seller on CaribEX</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Reach thousands of customers across the Caribbean and grow your business with crypto payments
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#0E1116]">
            Why Sell on CaribEX?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-3 text-[#0E1116]">Low Fees</h3>
              <p className="text-[#4B5563]">
                Keep more of your earnings with our competitive seller fees
              </p>
            </div>

            <div className="card text-center">
              <div className="text-5xl mb-4">🌎</div>
              <h3 className="text-xl font-bold mb-3 text-[#0E1116]">Caribbean Reach</h3>
              <p className="text-[#4B5563]">
                Access customers across Jamaica and the Caribbean islands
              </p>
            </div>

            <div className="card text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3 text-[#0E1116]">Instant Payments</h3>
              <p className="text-[#4B5563]">
                Receive payments instantly via blockchain technology
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#0E1116]">
            Ready to Start Selling?
          </h2>
          <p className="text-lg text-[#4B5563] mb-8 max-w-2xl mx-auto">
            {isAuthenticated 
              ? 'Create your first product listing and start selling today!'
              : 'Connect your wallet to get started as a seller on CaribEX'}
          </p>
          <button
            onClick={handleGetStarted}
            className="btn-primary inline-block"
          >
            {isAuthenticated ? 'Create Listing' : 'Connect Wallet to Start'}
          </button>
        </div>
      </section>
    </div>
  );
}
