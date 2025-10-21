'use client';

import 'antd/dist/reset.css';
import { Provider } from 'react-redux';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { store } from '@/redux/store';
import { config } from '@/lib/wagmi';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ToastProvider } from '@/components/ui/ToastContainer';
import { CartDrawerProvider } from '@/components/cart/CartDrawerProvider';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <AuthProvider>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: '#2563eb',
                  borderRadius: 8,
                },
              }}
            >
              <ToastProvider>
                <CartDrawerProvider>
                  {children}
                </CartDrawerProvider>
              </ToastProvider>
            </ConfigProvider>
          </AuthProvider>
        </Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
