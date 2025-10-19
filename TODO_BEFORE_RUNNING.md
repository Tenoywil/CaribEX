# ⚠️ TODO Before Running the Application

## 🔴 Critical: Install Missing Packages

The SIWE implementation requires these packages that are not yet installed:

```bash
yarn add @tanstack/react-query siwe viem@2.x
```

**Or with npm:**
```bash
npm install @tanstack/react-query siwe viem@2.x
```

### Why These Packages?

- **@tanstack/react-query**: Required by wagmi for state management
- **siwe**: Official Sign-In with Ethereum library for creating SIWE messages
- **viem@2.x**: Ethereum library used by wagmi (specific version required)

---

## ✅ What's Already Done

### Implemented Files
- ✅ `lib/wagmi.ts` - Wagmi configuration
- ✅ `components/wallet/ConnectWalletButton.tsx` - Complete SIWE flow
- ✅ `components/auth/AuthProvider.tsx` - Session restoration
- ✅ `hooks/useAuth.ts` - Auth hook
- ✅ `app/providers.tsx` - Updated with all providers
- ✅ `redux/reducers/authReducer.ts` - Added session restoration
- ✅ `lib/apiClient.ts` - Enhanced for cookie handling

### Documentation Created
- ✅ `docs/SIWE_IMPLEMENTATION.md` - Complete implementation guide
- ✅ `SIWE_SETUP_INSTRUCTIONS.md` - Quick setup guide
- ✅ `IMPLEMENTATION_SUMMARY.md` - What was implemented
- ✅ `README.md` - Updated with SIWE references

---

## 🔧 Configuration Needed

### 1. Environment Variables

Create or update `.env.local`:

```env
# Backend API URL (required)
NEXT_PUBLIC_API_URL=http://localhost:4000

# Blockchain Network (required)
# 1 = Ethereum Mainnet
# 11155111 = Sepolia Testnet
NEXT_PUBLIC_CHAIN_ID=1

# WalletConnect Project ID (optional but recommended)
# Get from: https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id-here
```

### 2. Backend Requirements

Your backend must have these endpoints ready:

```
✅ GET  /v1/auth/nonce       - Generate nonce
✅ POST /v1/auth/siwe        - Verify signature & create session
✅ GET  /v1/auth/me          - Get current user
✅ POST /v1/auth/logout      - Logout
```

---

## 🚀 Steps to Run

### 1. Install Packages
```bash
yarn add @tanstack/react-query siwe viem@2.x
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### 3. Start Backend
```bash
# In your backend directory
npm run dev
```

### 4. Start Frontend
```bash
# In this directory
yarn dev
```

### 5. Test Authentication
1. Open http://localhost:3000/login
2. Click "Connect Wallet"
3. Approve wallet connection
4. Sign the SIWE message
5. You should be authenticated!

---

## 📋 Verification Checklist

Before testing, verify:

- [ ] Packages installed (`@tanstack/react-query`, `siwe`, `viem`)
- [ ] `.env.local` file created with correct values
- [ ] Backend is running on the URL specified in `NEXT_PUBLIC_API_URL`
- [ ] Backend has SIWE endpoints implemented
- [ ] MetaMask or another wallet extension is installed in browser
- [ ] CORS is configured on backend to allow credentials

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@tanstack/react-query'"
**Solution:** Run `yarn add @tanstack/react-query siwe viem@2.x`

### Error: "Cannot find module 'siwe'"
**Solution:** Run `yarn add @tanstack/react-query siwe viem@2.x`

### Error: "Network Error" or "CORS Error"
**Solution:** 
- Ensure backend is running
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend CORS allows credentials from frontend origin

### Wallet doesn't connect
**Solution:**
- Ensure wallet extension is installed
- Try refreshing the page
- Check browser console for errors

---

## 📖 Documentation

For detailed information, see:

1. **Quick Start**: [SIWE_SETUP_INSTRUCTIONS.md](./SIWE_SETUP_INSTRUCTIONS.md)
2. **Implementation Details**: [docs/SIWE_IMPLEMENTATION.md](./docs/SIWE_IMPLEMENTATION.md)
3. **Summary**: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

---

## ⏱️ Time Estimate

- Install packages: **1 minute**
- Configure environment: **2 minutes**
- Start servers: **1 minute**
- Test authentication: **2 minutes**

**Total: ~6 minutes** to get up and running!

---

## 🎯 After Setup

Once everything is running:

1. Test the complete authentication flow
2. Verify session persistence (refresh page)
3. Test logout functionality
4. Check that protected routes work
5. Review the documentation for advanced features

---

**The implementation is complete and ready to use once you install the packages!** 🎉
