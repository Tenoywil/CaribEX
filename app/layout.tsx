import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'CaribEX - Blockchain Money Transfer & Marketplace',
  description: 'Fast, accessible, and secure blockchain money transfer and marketplace for Jamaica & the Caribbean',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
