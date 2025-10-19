import { http, createConfig } from 'wagmi';
import { type Chain, mainnet, sepolia } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// Get the chain ID from environment or default to mainnet
const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '1');
const chains = chainId === 1 ? [mainnet] : [sepolia];

// Configure wagmi
export const config = createConfig({
  chains: chains as unknown as readonly [Chain, ...Chain[]],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'CaribEX' }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
