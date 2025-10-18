export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-[#0E1116]">Help Center</h1>

      <div className="max-w-4xl">
        <div className="card mb-6">
          <h2 className="text-2xl font-bold mb-4 text-[#0E1116]">Getting Started</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#0E1116]">How do I connect my wallet?</h3>
              <p className="text-[#4B5563]">
                Click on "Connect Wallet" in the navigation bar and follow the prompts to connect your Ethereum wallet using MetaMask or WalletConnect.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#0E1116]">How do I buy products?</h3>
              <p className="text-[#4B5563]">
                Browse the marketplace, add items to your cart, and proceed to checkout. You can pay using your connected wallet.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#0E1116]">How do I send money?</h3>
              <p className="text-[#4B5563]">
                Navigate to the Wallet page, click "Send Funds", enter the recipient's address and amount, then confirm the transaction.
              </p>
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-2xl font-bold mb-4 text-[#0E1116]">Account & Security</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#0E1116]">Is my wallet safe?</h3>
              <p className="text-[#4B5563]">
                Yes. We never store your private keys. All transactions are signed securely through your wallet.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#0E1116]">What if I lose access to my wallet?</h3>
              <p className="text-[#4B5563]">
                Make sure to backup your wallet's recovery phrase. If you lose access, contact your wallet provider for recovery options.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-4 text-[#0E1116]">Need More Help?</h2>
          <p className="text-[#4B5563] mb-4">
            Can't find what you're looking for? Contact our support team.
          </p>
          <a href="/contact" className="btn-primary inline-block">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
