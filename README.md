# CaribEX — Blockchain Money Transfer & Marketplace

**Project:** CaribEX — Blockchain Money Transfer & Marketplace for Jamaica & the Caribbean  
**Purpose:** Provide a fast, accessible, and secure web frontend that lets users connect wallets (SIWE), send/receive funds, browse and list products, manage carts/orders, and view wallet history.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A running backend API (see backend setup documentation)

### Installation

```bash
# Install dependencies
npm install

# Install additional SIWE dependencies (required)
yarn add @tanstack/react-query siwe viem@2.x
# or with npm: npm install @tanstack/react-query siwe viem@2.x

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

**📖 SIWE Setup:** See [SIWE_SETUP_INSTRUCTIONS.md](./SIWE_SETUP_INSTRUCTIONS.md) for complete authentication setup.

---

## 📁 Project Structure

```
/app                    # Next.js 15 App Router pages
  layout.tsx           # Root layout with Redux Provider
  page.tsx             # Home page
  providers.tsx        # Client-side providers
  globals.css          # Global styles

/components            # React components
  /ui                  # Reusable UI components (Loader, EmptyState, Pagination)
  /layout              # Layout components (Header, Footer, AppLayout)
  /marketplace         # Marketplace-specific components
  /wallet              # Wallet-specific components (SendForm, WalletBalance)
  /cart                # Cart and checkout components

/redux                 # Redux state management
  store.ts            # Redux store configuration
  /reducers           # Redux reducers (auth, products, cart, wallet)
  /selectors          # Memoized selectors using reselect
  /sagas              # Redux-Saga side effects

/lib                   # Utility libraries
  apiClient.ts        # HTTP client for API calls
  cacheClient.ts      # L1 in-memory cache
  circuitBreaker.ts   # Circuit breaker pattern implementation

/hooks                 # Custom React hooks
  useWallet.ts        # Wallet operations hook
  useCachedData.ts    # SWR-style data fetching with cache

/types                 # TypeScript type definitions
/styles               # Additional styles
/tests                # Test files
  /unit              # Unit tests
  /e2e               # End-to-end tests (Playwright)

/public               # Static assets
```

---

## 🏗️ Architecture

### State Management

The application uses **Redux Toolkit** with **Redux-Saga** for state management:

- **Reducers**: Pure state updates organized by domain (auth, products, cart, wallet)
- **Selectors**: Memoized selectors using `reselect` for optimized performance
- **Sagas**: Side effects handling (API calls, async operations, event flows)

### Key Features

#### 🔐 Authentication (SIWE)
- Sign-In With Ethereum (SIWE) wallet authentication ✅ **Fully Implemented**
- Nonce-based signature verification (prevents replay attacks)
- Session management with HTTP-only cookies
- Support for MetaMask, Coinbase Wallet, WalletConnect
- Automatic session restoration on page load
- See [SIWE_IMPLEMENTATION.md](./docs/SIWE_IMPLEMENTATION.md) for details

#### 💰 Wallet Operations
- View balance and transaction history
- Send/receive funds with wallet signature
- Real-time balance updates

#### 🛒 Marketplace
- Browse products with pagination and filtering
- Product details with image galleries
- Seller dashboard for product management

#### 🛍️ Cart & Checkout
- Add/remove items with optimistic updates
- Real-time cart total calculation
- Order placement and history

### Caching Strategy

**Two-level caching system:**

1. **L1 (Client Memory)**: In-memory cache with TTL for instant UI responses
2. **L2 (Backend Redis)**: Server-side cache for consistent data across clients

**Cache invalidation:**
- Automatic invalidation on mutations (create/update/delete)
- Manual invalidation triggers for both L1 and L2

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run end-to-end tests
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CHAIN_ID=1
```

---

## 🧪 Testing

### Unit Tests
- Component tests using Jest and React Testing Library
- Reducer tests
- Saga tests using `redux-saga-test-plan`

### E2E Tests
- Playwright tests for critical user flows
- Wallet connection and send/receive flows
- Marketplace browsing and checkout

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e
```

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Docker Deployment

```bash
docker build -t CaribEX-frontend .
docker run -p 3000:3000 CaribEX-frontend
```

---

## 📚 Additional Documentation

- [SIWE Setup Instructions](./SIWE_SETUP_INSTRUCTIONS.md) - Quick start for SIWE authentication
- [SIWE Implementation Guide](./docs/SIWE_IMPLEMENTATION.md) - Complete SIWE documentation
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Overview of what was implemented
- [Architecture Guide](./docs/ARCHITECTURE.md) - Detailed architecture documentation
- [API Integration](./docs/API.md) - Backend API integration guide
- [Setup Guide](./docs/SETUP.md) - Detailed setup instructions
- [Component Guide](./docs/COMPONENTS.md) - Component usage and examples

---

## 🔒 Security

- Never store private keys in browser storage
- HTTP-only, Secure, SameSite cookies for sessions
- Client-side input sanitization and server validation
- Minimal PII exposure in UI

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

---

## 📞 Support

For issues and questions, please open a GitHub issue or contact the development team.
