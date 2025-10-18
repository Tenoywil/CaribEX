export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient */}
      <section className="gradient-primary py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Empowering Caribbean Trade & Finance
          </h1>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Fast, secure blockchain money transfers and marketplace connecting Jamaica & the Caribbean
          </p>
          <div className="flex gap-4 justify-center">
            <a 
              href="/marketplace" 
              className="px-8 py-4 bg-white text-[#0074F0] rounded-lg hover:bg-gray-100 font-semibold transition-all"
            >
              Browse Marketplace
            </a>
            <a 
              href="/wallet" 
              className="px-8 py-4 bg-[#00B878] text-white rounded-lg hover:bg-[#009661] font-semibold transition-all"
            >
              Open Wallet
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#0E1116]">
            Why Choose CaribEX?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card text-center">
              <div className="text-5xl mb-4">🛍️</div>
              <h3 className="text-xl font-bold mb-3 text-[#0E1116]">Caribbean Marketplace</h3>
              <p className="text-[#4B5563]">
                Buy and sell products with crypto across Jamaica and the Caribbean region
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-3 text-[#0E1116]">Instant Transfers</h3>
              <p className="text-[#4B5563]">
                Send and receive money instantly using blockchain technology
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-3 text-[#0E1116]">Secure & Trustworthy</h3>
              <p className="text-[#4B5563]">
                Your funds and data are protected with enterprise-grade security
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">$1M+</div>
              <div className="text-[#4B5563]">Transaction Volume</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">10K+</div>
              <div className="text-[#4B5563]">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">500+</div>
              <div className="text-[#4B5563]">Products Listed</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#0E1116]">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-[#4B5563] mb-8 max-w-2xl mx-auto">
            Join thousands of Caribbean users buying, selling, and transferring funds on CaribEX
          </p>
          <a 
            href="/login" 
            className="inline-block px-8 py-4 gradient-primary text-white rounded-lg hover:opacity-90 font-semibold transition-all"
          >
            Connect Your Wallet
          </a>
        </div>
      </section>
    </div>
  );
}
