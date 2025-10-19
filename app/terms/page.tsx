export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#0E1116]">Terms of Service</h1>

        <div className="prose prose-lg">
          <div className="card mb-6">
            <p className="text-[#4B5563] mb-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-[#4B5563]">
              Please read these Terms of Service carefully before using the CaribEX platform.
            </p>
          </div>

          <div className="card mb-6">
            <h2 className="text-2xl font-bold mb-4 text-[#0E1116]">1. Acceptance of Terms</h2>
            <p className="text-[#4B5563] mb-4">
              By accessing and using CaribEX, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </div>

          <div className="card mb-6">
            <h2 className="text-2xl font-bold mb-4 text-[#0E1116]">2. Use of Service</h2>
            <p className="text-[#4B5563] mb-4">
              You agree to use CaribEX only for lawful purposes and in accordance with these Terms. You agree not to use the service:
            </p>
            <ul className="list-disc list-inside text-[#4B5563] space-y-2 ml-4">
              <li>In any way that violates any applicable law or regulation</li>
              <li>To transmit any unauthorized or unsolicited advertising</li>
              <li>To impersonate or attempt to impersonate another user</li>
              <li>To engage in any conduct that restricts or inhibits anyone&apos;s use of the service</li>
            </ul>
          </div>

          <div className="card mb-6">
            <h2 className="text-2xl font-bold mb-4 text-[#0E1116]">3. Wallet Connection</h2>
            <p className="text-[#4B5563] mb-4">
              You are responsible for maintaining the security of your connected wallet. CaribEX does not store your private keys and cannot recover your wallet access.
            </p>
          </div>

          <div className="card mb-6">
            <h2 className="text-2xl font-bold mb-4 text-[#0E1116]">4. Transactions</h2>
            <p className="text-[#4B5563] mb-4">
              All transactions on CaribEX are executed via blockchain smart contracts. Once confirmed on the blockchain, transactions cannot be reversed.
            </p>
          </div>

          <div className="card mb-6">
            <h2 className="text-2xl font-bold mb-4 text-[#0E1116]">5. Fees</h2>
            <p className="text-[#4B5563] mb-4">
              CaribEX charges fees for certain services. All fees will be clearly displayed before you complete a transaction.
            </p>
          </div>

          <div className="card mb-6">
            <h2 className="text-2xl font-bold mb-4 text-[#0E1116]">6. Limitation of Liability</h2>
            <p className="text-[#4B5563] mb-4">
              CaribEX shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-4 text-[#0E1116]">7. Contact</h2>
            <p className="text-[#4B5563]">
              If you have any questions about these Terms, please <a href="/contact" className="text-[#0074F0] hover:underline">contact us</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
