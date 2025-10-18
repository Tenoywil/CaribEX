'use client';

import { useState } from 'react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What is CaribEX?',
      answer: 'CaribEX is a blockchain-based platform for money transfers and marketplace transactions serving Jamaica and the Caribbean region.',
    },
    {
      question: 'Do I need a crypto wallet to use CaribEX?',
      answer: 'Yes, you need an Ethereum-compatible wallet like MetaMask to connect and use the platform.',
    },
    {
      question: 'What fees does CaribEX charge?',
      answer: 'We charge minimal transaction fees. Marketplace sales have a small seller fee, and money transfers have network gas fees.',
    },
    {
      question: 'Is CaribEX secure?',
      answer: 'Yes, we use blockchain technology and never store your private keys. All transactions are secured by the Ethereum network.',
    },
    {
      question: 'Which countries can use CaribEX?',
      answer: 'CaribEX is available across Jamaica and the Caribbean islands. We are expanding to more regions soon.',
    },
    {
      question: 'How do I become a seller?',
      answer: 'Connect your wallet, navigate to the Sellers page, and follow the steps to create your first product listing.',
    },
    {
      question: 'What cryptocurrencies are supported?',
      answer: 'Currently, we support Ethereum (ETH) and major ERC-20 tokens. More currencies will be added soon.',
    },
    {
      question: 'How long do transactions take?',
      answer: 'Blockchain transactions typically confirm within 1-3 minutes, depending on network congestion.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-[#0E1116] text-center">
          Frequently Asked Questions
        </h1>
        <p className="text-[#4B5563] text-center mb-12">
          Find answers to common questions about CaribEX
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="card">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left flex justify-between items-center"
              >
                <h3 className="text-lg font-semibold text-[#0E1116] pr-4">
                  {faq.question}
                </h3>
                <span className="text-2xl text-[#0074F0]">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <p className="mt-4 text-[#4B5563] leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 card text-center">
          <h2 className="text-xl font-bold mb-4 text-[#0E1116]">
            Still have questions?
          </h2>
          <p className="text-[#4B5563] mb-6">
            Our support team is here to help you
          </p>
          <a href="/contact" className="btn-primary inline-block">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
