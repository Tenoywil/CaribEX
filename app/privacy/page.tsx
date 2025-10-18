export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#0E1116]">Privacy Policy</h1>

        <div className="prose prose-lg">
          <div className="card mb-6">
            <p className="text-[#4B5563] mb-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-[#4B5563]">
              This Privacy Policy describes how CaribEX collects, uses, and protects your personal information.
            </p>
          </div>

          <div className="card mb-6">
            <h2 className="text-2xl font-bold mb-4 text-[#0E1116]">1. Information We Collect</h2>
            <p className="text-[#4B5563] mb-4">
              We collect the following types of information:
            </p>
            <ul className="list-disc list-inside text-[#4B5563] space-y-2 ml-4">
              <li>Wallet address when you connect your wallet</li>
              <li>Transaction history on the platform</li>
              <li>Usage data and analytics</li>
              <li>Information you provide when contacting support</li>
            </ul>
          </div>

          <div className="card mb-6">
            <h2 className="text-2xl font-bold mb-4 text-[#0E1116]">2. How We Use Your Information</h2>
            <p className="text-[#4B5563] mb-4">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-[#4B5563] space-y-2 ml-4">
              <li>Provide and maintain our services</li>
              <li>Process your transactions</li>
              <li>Improve our platform and user experience</li>
              <li>Communicate with you about updates and support</li>
              <li>Detect and prevent fraud</li>
            </ul>
          </div>

          <div className="card mb-6">
            <h2 className="text-2xl font-bold mb-4 text-[#0E1116]">3. Data Security</h2>
            <p className="text-[#4B5563] mb-4">
              We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.
            </p>
            <p className="text-[#4B5563]">
              <strong>Important:</strong> We never store your private keys or seed phrases. Your wallet security is your responsibility.
            </p>
          </div>

          <div className="card mb-6">
            <h2 className="text-2xl font-bold mb-4 text-[#0E1116]">4. Blockchain Transparency</h2>
            <p className="text-[#4B5563] mb-4">
              All transactions on CaribEX are recorded on the Ethereum blockchain, which is public and permanent. Your wallet address and transaction history may be visible to others.
            </p>
          </div>

          <div className="card mb-6">
            <h2 className="text-2xl font-bold mb-4 text-[#0E1116]">5. Cookies and Tracking</h2>
            <p className="text-[#4B5563] mb-4">
              We use cookies and similar technologies to improve your experience and analyze platform usage. You can control cookie preferences in your browser settings.
            </p>
          </div>

          <div className="card mb-6">
            <h2 className="text-2xl font-bold mb-4 text-[#0E1116]">6. Third-Party Services</h2>
            <p className="text-[#4B5563] mb-4">
              We may use third-party services for analytics and infrastructure. These services have their own privacy policies.
            </p>
          </div>

          <div className="card mb-6">
            <h2 className="text-2xl font-bold mb-4 text-[#0E1116]">7. Your Rights</h2>
            <p className="text-[#4B5563] mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-[#4B5563] space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Request correction of your data</li>
              <li>Request deletion of your data (where applicable)</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-4 text-[#0E1116]">8. Contact Us</h2>
            <p className="text-[#4B5563]">
              If you have questions about this Privacy Policy, please <a href="/contact" className="text-[#0074F0] hover:underline">contact us</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
