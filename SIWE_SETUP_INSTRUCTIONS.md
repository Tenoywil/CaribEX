# SIWE Setup Instructions

## Required Package Installation

Before running the application, you need to install the following packages that were added for SIWE functionality:

```bash
yarn add @tanstack/react-query siwe viem@2.x
```

Or if using npm:

```bash
npm install @tanstack/react-query siwe viem@2.x
```

**Note:** `wagmi` is already installed in the project.

---

## What Was Implemented

### 1. **Wagmi Configuration** (`lib/wagmi.ts`)
- Configured wallet connectors (MetaMask, Coinbase Wallet, WalletConnect)
- Set up mainnet and Sepolia testnet support
- Ready for production use

### 2. **Updated Providers** (`app/providers.tsx`)
- Added `WagmiProvider` for wallet connectivity
- Added `QueryClientProvider` for React Query (required by wagmi)
- Added `AuthProvider` for session restoration
- Proper provider nesting for all features

### 3. **Complete SIWE Flow** (`components/wallet/ConnectWalletButton.tsx`)
- Wallet connection using wagmi hooks
- Nonce fetching from backend (`GET /v1/auth/nonce`)
- SIWE message creation with proper format
- Message signing with user's wallet
- Signature verification via backend (`POST /v1/auth/siwe`)
- Error handling and loading states
- Disconnect functionality

### 4. **Session Management**
- **Auth Reducer** (`redux/reducers/authReducer.ts`): Added `restoreSession` action
- **Auth Hook** (`hooks/useAuth.ts`): Checks for existing session on app load
- **Auth Provider** (`components/auth/AuthProvider.tsx`): Wraps app to restore sessions
- **API Client** (`lib/apiClient.ts`): Enhanced error handling and cookie support

### 5. **Token/Cookie Handling**
- API client configured with `withCredentials: true` for cookie support
- HTTP-only cookies for session tokens (set by backend)
- Automatic session restoration on page load
- Proper 401 handling with redirect to login

---

## Backend Requirements

Your backend must implement these endpoints:

### 1. Get Nonce
```
GET /v1/auth/nonce
Response: { "nonce": "random-string" }
```

### 2. Verify SIWE Signature
```
POST /v1/auth/siwe
Body: { "signature": "0x...", "message": "SIWE message string" }
Response: {
  "user": { "id": "...", "handle": "...", "wallet": "0x..." },
  "session": { "expiresAt": "..." }
}
Sets Cookie: session=<token>; HttpOnly; Secure; SameSite=Strict
```

### 3. Get Current User (for session restoration)
```
GET /v1/auth/me
Response: {
  "user": { "id": "...", "handle": "...", "wallet": "0x..." },
  "session": { "expiresAt": "..." }
}
```

### 4. Logout
```
POST /v1/auth/logout
Response: { "success": true }
Clears Cookie
```

---

## Environment Variables

Add to your `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:4000

# Blockchain Network (1 = mainnet, 11155111 = sepolia)
NEXT_PUBLIC_CHAIN_ID=1

# WalletConnect Project ID (get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id-here
```

---

## How to Test

### 1. Start the Development Server

```bash
yarn dev
# or
npm run dev
```

### 2. Navigate to Login Page

Open http://localhost:3000/login

### 3. Connect Wallet

1. Click "Connect Wallet" button
2. MetaMask (or your wallet) will prompt to connect
3. Approve the connection
4. Wallet will prompt to sign the SIWE message
5. Sign the message
6. You should be authenticated!

### 4. Verify Session Persistence

1. Refresh the page
2. You should remain logged in (session restored from cookie)

### 5. Test Logout

1. Click "Disconnect" button
2. Session should be cleared
3. You should be logged out

---

## File Structure

```
/lib
  wagmi.ts                          # Wagmi configuration

/components
  /wallet
    ConnectWalletButton.tsx         # Main SIWE component
  /auth
    AuthProvider.tsx                # Session restoration wrapper

/redux
  /reducers
    authReducer.ts                  # Auth state management
  /sagas
    authSaga.ts                     # Auth side effects
  /selectors
    authSelectors.ts                # Auth state selectors

/hooks
  useAuth.ts                        # Auth hook for session restoration

/app
  providers.tsx                     # App-level providers
  /login
    page.tsx                        # Login page

/docs
  SIWE_IMPLEMENTATION.md            # Detailed documentation
```

---

## Key Features Implemented

✅ **Wallet Connection** - MetaMask, Coinbase Wallet, WalletConnect support
✅ **SIWE Authentication** - Standards-compliant EIP-4361 implementation
✅ **Nonce Management** - Fresh nonce for each authentication attempt
✅ **Session Management** - HTTP-only cookies with automatic restoration
✅ **Error Handling** - User-friendly error messages and loading states
✅ **Security** - No private key storage, secure cookies, nonce rotation
✅ **Redux Integration** - Full state management with sagas
✅ **TypeScript** - Fully typed implementation
✅ **Documentation** - Comprehensive guides and examples

---

## Common Issues & Solutions

### Issue: Packages not found
**Solution:** Run `yarn add @tanstack/react-query siwe viem@2.x`

### Issue: Backend not responding
**Solution:** Ensure backend is running on the URL specified in `NEXT_PUBLIC_API_URL`

### Issue: Wallet not connecting
**Solution:** 
- Ensure you have a wallet extension installed (MetaMask, etc.)
- Check browser console for errors
- Try refreshing the page

### Issue: Signature verification fails
**Solution:**
- Ensure backend properly verifies SIWE signatures
- Check that nonce is being used correctly
- Verify message format matches SIWE spec

---

## Next Steps

1. **Install required packages** (see top of this document)
2. **Set environment variables** in `.env.local`
3. **Ensure backend is running** with required endpoints
4. **Test the flow** by connecting a wallet
5. **Review documentation** in `docs/SIWE_IMPLEMENTATION.md`

---

## Additional Documentation

- **Detailed Implementation Guide**: `docs/SIWE_IMPLEMENTATION.md`
- **API Integration**: `docs/API.md`
- **Architecture Overview**: `docs/ARCHITECTURE.md`
- **GitHub Instructions**: `.github/copilot-instructions.md`

---

## Support

For issues or questions:
1. Check the documentation in `/docs`
2. Review the GitHub instructions in `.github/copilot-instructions.md`
3. Examine the implementation in the files listed above
4. Test with the backend API endpoints

---

**The SIWE implementation is complete and ready to use once the required packages are installed!**
