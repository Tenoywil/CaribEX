'use client';

import { Provider } from 'react-redux';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/redux/store';
import { config } from '@/lib/wagmi';
import { AuthProvider } from '@/components/auth/AuthProvider';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <AuthProvider>{children}</AuthProvider>
        </Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
