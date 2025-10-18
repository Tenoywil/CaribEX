export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to CaribEX
        </h1>
        <p className="text-xl mb-8">
          Blockchain Money Transfer & Marketplace for Jamaica & the Caribbean
        </p>
        <div className="flex gap-4 justify-center">
          <a 
            href="/marketplace" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Marketplace
          </a>
          <a 
            href="/wallet" 
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            My Wallet
          </a>
        </div>
      </div>
    </main>
  );
}
