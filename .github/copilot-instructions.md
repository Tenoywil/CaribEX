# CaribEX — Frontend Blueprint (Next.js 15, TypeScript, Redux Toolkit + Redux-Saga)

**Project:** CaribEX — Blockchain Money Transfer & Marketplace for Jamaica & the Caribbean
**Purpose:** Provide a fast, accessible, and secure web frontend that lets users connect wallets (SIWE), send/receive funds, browse and list products, manage carts/orders, and view wallet history. Designed for solo hackathon delivery with an eye toward production-readiness.

---

## 1) Executive Summary & Conversation Context

This frontend plan complements the CaribEX backend blueprint. It follows the conversation requirements: Next.js 15 (App Router), Redux Toolkit with clear separation of reducers/selectors/sagas, event-driven flows, in-memory + Redis sync caching, and SIWE wallet authentication. Components explicitly include send/receive flows, marketplace, cart/order management, and wallet dashboards.

This canvas is meant to be Copilot-ready and contains scaffold commands, directory layouts, component responsibilities, state shapes, and testing/CI guidance.

---

## 2) High-Level Goals

* **UX-first**: minimal friction wallet connection and purchase flows.
* **Security**: never expose private keys, use HTTP-only cookies for sessions, sanitize all user inputs.
* **Performance**: L1 in-memory cache (client), backend Redis L2 sync; SWR-style stale-while-revalidate.
* **Maintainability**: atomic components, typed props, clear Redux boundaries, saga side-effects.

---

## 3) Project Scaffold & Commands

```bash
npx create-next-app@latest CaribEX-frontend --typescript --use-npm
cd CaribEX-frontend
npm install @reduxjs/toolkit react-redux redux-saga ethers wagmi axios swr reselect redux-saga-test-plan
# dev tools
npm install -D jest @testing-library/react @testing-library/jest-dom msw playwright eslint prettier
```

Folder structure:

```
/app
/components
  /ui
  /layout
  /marketplace
  /wallet
/redux
  store.ts
  /reducers
  /selectors
  /sagas
  /actions
/lib
  apiClient.ts
  cacheClient.ts
  circuitBreaker.ts
/hooks
  useWallet.ts
  useCachedData.ts
/styles
/tests
```

---

## 4) State Design (Redux shapes)

**Normalized store patterns (byId/allIds)**

`products` reducer

```ts
{ byId: Record<string, Product>, allIds: string[], listMeta: {page, total}, loading: boolean }
```

`cart` reducer

```ts
{ id: string, items: { id, productId, qty, price }[], total: number }
```

`auth` reducer

```ts
{ user: {id, handle, wallet}, session: {expiresAt}, isAuthenticated: boolean }
```

`wallet` reducer

```ts
{ balance: number, currency: string, transactions: Transaction[], loading: boolean }
```

---

## 5) Reducers / Selectors / Sagas Separation

* **Reducers**: pure state updates, file per domain (`redux/reducers/productsReducer.ts`)
* **Selectors**: memoized selectors in `redux/selectors/*` using `reselect`
* **Sagas**: watchers & workers in `redux/sagas/*`

  * `productSaga.ts` -> fetch products, cache checks
  * `cartSaga.ts` -> add/remove items, optimistic updates
  * `walletSaga.ts` -> balance sync, send flow (sign & submit)
  * `authSaga.ts` -> SIWE flow (nonce->signature->verify)

Example saga flow: `sendFunds`

1. `SEND_FUNDS_REQUEST` dispatched with {to, amount}
2. `walletSaga` calls `apiClient` to create pending tx
3. Frontend triggers wallet `signMessage` if using on-chain tx, or the backend returns data for server-side tx
4. Saga waits for on-chain confirmation or backend webhook then dispatches `SEND_FUNDS_SUCCESS` or `FAILURE`

---

## 6) Component List & Responsibilities (complete)

**Global**

* `AppLayout`, `Header`, `Footer`, `Toast` notifications

**Auth / Wallet**

* `ConnectWalletButton.tsx` (wagmi/RainbowKit wrapper)
* `SignInWithWallet.tsx` (handles nonce+signature flow)
* `WalletBalance.tsx` (balance card + quick actions)
* `WalletTransactions.tsx` (paged list, filters)
* `SendForm.tsx` (recipient input, amount, note, gas estimate)
* `SendConfirmation.tsx` (sign & send modal)
* `SendHistory.tsx`
* `ReceiveModal.tsx`, `ReceiveQR.tsx`, `ReceiveAddressCopy.tsx`
* `RequestPayment.tsx`, `PaymentRequestList.tsx`

**Marketplace**

* `BrowsePage.tsx` (filters, pagination)
* `ProductCard.tsx` (image carousel, price, buy button)
* `ProductDetails.tsx` (full details, seller info)
* `SellerDashboard` (create/edit products)
* `ProductForm.tsx` (create/edit flow with image upload step)

**Cart & Orders**

* `CartList.tsx`, `CartSummary.tsx`, `CheckoutForm.tsx`
* `OrderHistory.tsx`, `OrderDetails.tsx`

**Utilities**

* `Loader.tsx`, `EmptyState.tsx`, `Pagination.tsx`

---

## 7) Send & Receive UX Flow

**Send**

* Open `SendForm` → fill recipient (wallet or username) + amount → show `SendConfirmation` modal with fee estimate → `Sign & Send` triggers wallet signature or backend request → optimistic update in Redux → await tx confirmation via saga/webhook → show success/failure toast

**Receive**

* `ReceiveModal` shows wallet address QR and copy button; optional pre-filled amount for invoices; `RequestPayment` creates an invoice link that can be shared

---

## 8) Client Caching Strategy

**L1 (client memory)**: `cacheClient.ts` simple Map + TTL for instantaneous UI.
**L2 (server Redis)**: backend serves TTL’d cached responses; front-end sagas call API for invalidation when necessary.
**SWR-style**: show L1 immediately → dispatch fetch to revalidate → update store on response.

Cache invalidation rules

* On product create/update/delete: dispatch `PRODUCTS_INVALIDATE` -> saga clears L1 and calls `/internal/cache/invalidate` for L2
* On login/logout: flush auth & wallet caches

---

## 9) Security & Privacy

* **Do not store private keys** in browser
* **Session cookies**: HTTP-only, Secure, SameSite=Strict
* **Nonce rotation** for SIWE
* **Client-side input sanitization** and server validation
* **Minimal PII exposure** in UI; prefer display handles or hashed ids

---

## 10) Testing & CI

* **Unit tests**: components + reducers (Jest + RTL)
* **Saga tests**: `redux-saga-test-plan`
* **Integration**: Playwright tests for flows (mocking chain interactions or using a testnet)
* **CI**: GitHub Actions pipeline: lint, test, build, deploy preview

---

## 11) Scaffolding Prompts for Copilot / AI

* "Scaffold a Next.js 15 TypeScript app named CaribEX with Redux Toolkit, Redux-Saga, wagmi, and an initial set of components for wallet auth (SIWE), send/receive flows, product browse, cart, and checkout. Create store, root saga, example reducer/selectors/saga for products and wallet."
* "Generate SendForm.tsx, SendConfirmation.tsx, ReceiveModal.tsx, and wallet saga that handles create-pending-tx -> sign -> submit -> confirm flow."

---

## 12) Prioritized Hackathon Roadmap (time-boxed)

1. Scaffold project + Connect to CaribEX backend dev endpoints — 20m
2. Implement wallet SIWE connect flow + `GET /v1/auth/nonce` → `POST /v1/auth/siwe` → set session cookie — 40m
3. Implement `BrowsePage` + `ProductCard` with product list caching + pagination — 40m
4. Implement `SendForm` + `SendConfirmation` + wallet saga for sign & send (mock backend) — 60m
5. Integrate Cart & Checkout (calls backend order creation) — 60m
6. Polish UI, test critical flows, and prepare demo — 40m

---

## 13) Deliverables (what to commit first)

* README with this blueprint
* Docker Compose (backend dev) instructions
* Basic Next.js scaffold with store + rootSaga + CI config
* Backend minimal endpoints for SIWE, products list, wallet mock

---

End of frontend blueprint. Paste this canvas into your repo's `frontend/README.md` for Copilot-aware context and automated scaffolding.
