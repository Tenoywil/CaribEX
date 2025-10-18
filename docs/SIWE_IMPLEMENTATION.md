# SIWE (Sign-In with Ethereum) Implementation Guide

## Overview

This document describes the complete SIWE authentication implementation in CaribEX. The implementation follows the official SIWE specification and integrates with wagmi for wallet connectivity.

---

## Architecture

### Flow Diagram

```
1. User clicks "Connect Wallet"
   ↓
2. Wagmi connects to wallet (MetaMask, Coinbase Wallet, etc.)
   ↓
3. Frontend fetches nonce from backend: GET /v1/auth/nonce
   ↓
4. Frontend creates SIWE message with nonce
   ↓
5. User signs message with their wallet
   ↓
6. Frontend sends signature + message to backend: POST /v1/auth/siwe
   ↓
7. Backend verifies signature and creates session
   ↓
8. Backend sets HTTP-only cookie with session token
   ↓
9. Frontend stores user data in Redux
   ↓
10. User is authenticated ✓
```

---

## Key Components

### 1. Wagmi Configuration (`lib/wagmi.ts`)

Configures wallet connectors and blockchain networks:

```typescript
- Injected wallet (MetaMask, etc.)
- Coinbase Wallet
- WalletConnect
- Supports mainnet and Sepolia testnet
```

### 2. Connect Wallet Button (`components/wallet/ConnectWalletButton.tsx`)

Main component handling the SIWE flow:

**Features:**
- Connects to wallet using wagmi hooks
- Fetches nonce from backend
- Creates SIWE message
- Requests signature from user
- Dispatches login action to Redux
- Shows loading states and errors
- Handles disconnect

**Key Hooks Used:**
- `useAccount()` - Get connected wallet address
- `useConnect()` - Connect to wallet
- `useDisconnect()` - Disconnect wallet
- `useSignMessage()` - Sign SIWE message

### 3. Auth Reducer (`redux/reducers/authReducer.ts`)

Manages authentication state:

**State Shape:**
```typescript
{
  user: User | null,
  session: Session | null,
  isAuthenticated: boolean,
  loading: boolean,
  error: string | null
}
```

**Actions:**
- `loginRequest` - Initiates login
- `loginSuccess` - Login successful
- `loginFailure` - Login failed
- `logout` - Clear session
- `restoreSession` - Restore from cookie
- `clearError` - Clear error state

### 4. Auth Saga (`redux/sagas/authSaga.ts`)

Handles side effects for authentication:

**Workers:**
- `handleLoginRequest` - Sends signature to backend for verification
- `handleLogout` - Calls logout endpoint

### 5. Auth Provider (`components/auth/AuthProvider.tsx`)

Wraps the app to restore session on load:
- Checks for existing session cookie on mount
- Calls `/v1/auth/me` to get user data
- Restores Redux state if session is valid

### 6. Auth Hook (`hooks/useAuth.ts`)

Custom hook for session restoration:
- Automatically called on app load
- Checks for HTTP-only cookie
- Restores user state if valid

---

## API Endpoints

### Get Nonce
```
GET /v1/auth/nonce
```

**Response:**
```json
{
  "nonce": "random-nonce-string"
}
```

### Verify SIWE Signature
```
POST /v1/auth/siwe
```

**Request:**
```json
{
  "signature": "0x...",
  "message": "Sign in to CaribEX..."
}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "handle": "username",
    "wallet": "0x..."
  },
  "session": {
    "expiresAt": "2024-12-31T23:59:59Z"
  }
}
```

**Sets Cookie:**
```
Set-Cookie: session=<token>; HttpOnly; Secure; SameSite=Strict
```

### Get Current User (Session Check)
```
GET /v1/auth/me
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "handle": "username",
    "wallet": "0x..."
  },
  "session": {
    "expiresAt": "2024-12-31T23:59:59Z"
  }
}
```

### Logout
```
POST /v1/auth/logout
```

**Response:**
```json
{
  "success": true
}
```

---

## Security Features

### 1. Nonce Rotation
- Each authentication attempt gets a fresh nonce
- Prevents replay attacks
- Nonce is single-use and expires

### 2. HTTP-Only Cookies
- Session token stored in HTTP-only cookie
- Not accessible via JavaScript
- Prevents XSS attacks

### 3. Secure Cookie Attributes
```
HttpOnly: true    - Prevents JavaScript access
Secure: true      - Only sent over HTTPS
SameSite: Strict  - Prevents CSRF attacks
```

### 4. No Private Key Storage
- Private keys never leave the wallet
- Only signatures are transmitted
- Wallet handles all cryptographic operations

### 5. Message Verification
- Backend verifies signature matches address
- Checks nonce validity
- Validates message structure

---

## Environment Variables

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:4000

# Blockchain Network (1 = mainnet, 11155111 = sepolia)
NEXT_PUBLIC_CHAIN_ID=1

# WalletConnect Project ID (optional, for WalletConnect)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
```

---

## Usage Examples

### Check Authentication Status

```typescript
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '@/redux/selectors/authSelectors';

function MyComponent() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  if (!isAuthenticated) {
    return <div>Please connect your wallet</div>;
  }

  return <div>Welcome, {user.handle}!</div>;
}
```

### Protected Route

```typescript
'use client';

import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/redux/selectors/authSelectors';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return <div>Protected content</div>;
}
```

### Manual Logout

```typescript
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/reducers/authReducer';

function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

---

## Testing

### Unit Tests

Test the auth reducer:

```typescript
import { authReducer, loginSuccess, logout } from '@/redux/reducers/authReducer';

test('loginSuccess sets user and isAuthenticated', () => {
  const state = authReducer(undefined, loginSuccess({
    user: { id: '1', handle: 'test', wallet: '0x123' },
    session: { expiresAt: '2024-12-31' }
  }));

  expect(state.isAuthenticated).toBe(true);
  expect(state.user?.handle).toBe('test');
});
```

### Integration Tests

Test the SIWE flow with MSW:

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/v1/auth/nonce', (req, res, ctx) => {
    return res(ctx.json({ nonce: 'test-nonce' }));
  }),
  rest.post('/v1/auth/siwe', (req, res, ctx) => {
    return res(ctx.json({
      user: { id: '1', handle: 'test', wallet: '0x123' },
      session: { expiresAt: '2024-12-31' }
    }));
  })
);
```

---

## Troubleshooting

### Issue: "User rejected the request"
**Cause:** User cancelled the signature request in their wallet
**Solution:** This is expected behavior. User can try again.

### Issue: "Invalid signature"
**Cause:** Signature doesn't match the message or address
**Solution:** 
- Ensure nonce is fresh
- Check that the correct address is being used
- Verify message format matches SIWE spec

### Issue: "Session not persisting"
**Cause:** Cookie not being set or sent
**Solution:**
- Ensure `withCredentials: true` in apiClient
- Check backend sets cookie with correct attributes
- Verify CORS allows credentials

### Issue: "401 Unauthorized on protected routes"
**Cause:** Session expired or cookie not sent
**Solution:**
- Check session expiration time
- Verify cookie is being sent in requests
- Implement session refresh logic

---

## Best Practices

1. **Always use HTTPS in production** - Required for Secure cookies
2. **Set appropriate session expiration** - Balance security and UX
3. **Implement session refresh** - Extend sessions for active users
4. **Handle wallet disconnection** - Clear state when wallet disconnects
5. **Show clear error messages** - Help users understand what went wrong
6. **Test with multiple wallets** - MetaMask, Coinbase, WalletConnect
7. **Monitor nonce usage** - Detect and prevent replay attacks
8. **Log authentication events** - For security auditing

---

## Dependencies

```json
{
  "wagmi": "^2.5.0",
  "viem": "^2.x",
  "@tanstack/react-query": "^5.x",
  "siwe": "^2.x",
  "ethers": "^6.9.0"
}
```

---

## Additional Resources

- [SIWE Specification](https://eips.ethereum.org/EIPS/eip-4361)
- [Wagmi Documentation](https://wagmi.sh/)
- [Viem Documentation](https://viem.sh/)
- [SIWE Library](https://github.com/spruceid/siwe)

---

## Conclusion

This SIWE implementation provides secure, user-friendly wallet authentication for CaribEX. The flow is standards-compliant, follows security best practices, and integrates seamlessly with the Redux state management system.
