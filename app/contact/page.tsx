'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', formData);
    alert('Thank you for contacting us! We will respond shortly.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#0E1116] text-center">Contact Us</h1>

        <div className="card mb-8">
          <p className="text-[#4B5563] text-center mb-6">
            Have a question or need support? Send us a message and we'll get back to you as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#0E1116] mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#0074F0] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0E1116] mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#0074F0] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0E1116] mb-2">
                Subject
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#0074F0] focus:border-transparent"
              >
                <option value="">Select a subject</option>
                <option value="technical">Technical Support</option>
                <option value="account">Account Issue</option>
                <option value="seller">Seller Inquiry</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0E1116] mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#0074F0] focus:border-transparent"
              />
            </div>

            <button type="submit" className="w-full btn-primary">
              Send Message
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="card">
            <div className="text-2xl mb-2">📧</div>
            <div className="text-sm font-medium text-[#0E1116]">Email</div>
            <div className="text-sm text-[#4B5563]">support@caribex.io</div>
          </div>
          <div className="card">
            <div className="text-2xl mb-2">💬</div>
            <div className="text-sm font-medium text-[#0E1116]">Chat</div>
            <div className="text-sm text-[#4B5563]">Live chat available</div>
          </div>
          <div className="card">
            <div className="text-2xl mb-2">📱</div>
            <div className="text-sm font-medium text-[#0E1116]">Social</div>
            <div className="text-sm text-[#4B5563]">@CaribEX</div>
          </div>
        </div>
      </div>
    </div>
  );
}
