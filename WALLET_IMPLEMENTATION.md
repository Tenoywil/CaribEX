# Wallet Send/Receive Implementation with RPC Verification

## Overview

This document describes the implementation of wallet send/receive functionality using wagmi and viem, with backend RPC verification for security.

## Architecture

### Components

1. **SendForm** (`components/wallet/SendForm.tsx`)
   - Form for entering recipient address, amount, and optional note
   - Validates wallet connection and address format
   - Validates chainId (supports Mainnet and Sepolia)
   - Opens SendConfirmation modal on submit

2. **SendConfirmation** (`components/wallet/SendConfirmation.tsx`)
   - Modal for reviewing and confirming transactions
   - Uses `useSendTransaction` to send on-chain transactions
   - Uses `useWaitForTransactionReceipt` to wait for confirmation
   - Calls backend verification API after transaction is mined
   - Displays transaction status and errors

3. **WalletBalance** (`components/wallet/WalletBalance.tsx`)
   - Displays wallet address and balance
   - Uses wagmi's `useBalance` hook
   - Auto-refreshes every 10 seconds to detect incoming transactions
   - Shows balance in native token (ETH) with proper formatting

4. **ReceiveModal** (`components/wallet/ReceiveModal.tsx`)
   - Modal showing wallet address for receiving funds
   - Copy-to-clipboard functionality
   - QR code placeholder for future implementation
   - Optional amount field for payment requests

### Backend API

**Transaction Verification Endpoint** (`app/api/tx/verify/route.ts`)
- POST `/api/tx/verify`
- Validates transaction hash format
- Creates public RPC client using viem
- Fetches transaction receipt from blockchain
- Verifies transaction status is 'success'
- Returns verified transaction data

## Flow Diagrams

### Send Transaction Flow

```
User fills SendForm
    ↓
Validates inputs (address, amount, chainId)
    ↓
Opens SendConfirmation modal
    ↓
User clicks "Sign & Send"
    ↓
useSendTransaction sends to blockchain
    ↓
useWaitForTransactionReceipt waits for mining
    ↓
Transaction confirmed on-chain
    ↓
Call /api/tx/verify with txHash
    ↓
Backend verifies via RPC
    ↓
Success callback triggered
```

### Receive Transaction Flow

```
User opens ReceiveModal
    ↓
Display wallet address & QR code
    ↓
User shares address with sender
    ↓
WalletBalance polls every 10s
    ↓
useBalance detects new balance
    ↓
UI updates automatically
```

## Security Best Practices

✅ **Implemented:**
1. Never store private keys on frontend
2. HTTP-only cookies for sessions (in AuthProvider)
3. Frontend validates address format and chainId
4. Backend verification via RPC (don't trust frontend)
5. Transaction receipts verified on-chain
6. Input sanitization and validation
7. Error messages don't expose sensitive data

✅ **User Warnings:**
- Security notice shown in SendConfirmation modal
- Warns users to never share private keys
- Shows transaction will be verified via backend

## Configuration

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_CHAIN_ID=1  # 1 for Mainnet, 11155111 for Sepolia
NEXT_PUBLIC_NETWORK_NAME=mainnet
```

### Wagmi Configuration

Located in `lib/wagmi.ts`:
- Supports Mainnet (chainId 1) and Sepolia (chainId 11155111)
- Multiple connectors: injected, WalletConnect, Coinbase Wallet
- HTTP transport for RPC calls

## Usage

### Sending Funds

```tsx
import { SendForm } from '@/components/wallet/SendForm';

<SendForm />
```

Users enter:
- Recipient wallet address (0x...)
- Amount in ETH
- Optional note

### Receiving Funds

```tsx
import { ReceiveModal } from '@/components/wallet/ReceiveModal';

<ReceiveModal 
  isOpen={showModal} 
  onClose={() => setShowModal(false)} 
/>
```

Users can:
- View their wallet address
- Copy address to clipboard
- Share QR code (future implementation)
- Specify requested amount

### Displaying Balance

```tsx
import { WalletBalance } from '@/components/wallet/WalletBalance';

<WalletBalance />
```

Features:
- Shows current balance
- Auto-refreshes every 10 seconds
- Displays wallet address
- Formatted to 4 decimal places

## Testing

### Unit Tests

Located in `tests/unit/SendConfirmation.test.tsx`:
- Renders modal correctly
- Displays transaction details
- Handles close events
- Shows security warnings

Run tests:
```bash
npm test
```

### Manual Testing Checklist

- [ ] Connect wallet (MetaMask/WalletConnect)
- [ ] Check balance displays correctly
- [ ] Send transaction to test address
- [ ] Verify transaction appears on Etherscan
- [ ] Check backend verification succeeds
- [ ] Receive funds and verify balance updates
- [ ] Test error states (invalid address, insufficient funds)
- [ ] Test network switching (Mainnet/Sepolia)

## API Reference

### POST /api/tx/verify

Verifies a transaction via RPC.

**Request:**
```json
{
  "txHash": "0x...",
  "chainId": 1
}
```

**Response (Success):**
```json
{
  "verified": true,
  "txHash": "0x...",
  "chainId": 1,
  "blockNumber": "12345678",
  "from": "0x...",
  "to": "0x...",
  "value": "10000000000000000",
  "gasUsed": "21000",
  "status": "success",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

**Response (Error):**
```json
{
  "error": "Transaction not found"
}
```

## Dependencies

```json
{
  "wagmi": "^2.18.1",
  "viem": "2.x",
  "@tanstack/react-query": "^5.90.5",
  "ethers": "^6.9.0"
}
```

## Future Enhancements

1. **QR Code Generation**
   - Add QR code library
   - Generate QR codes for receiving addresses
   - Include amount in payment request QR codes

2. **Gas Estimation**
   - Show gas fees before sending
   - Allow users to adjust gas settings
   - Display total cost in USD

3. **Transaction History**
   - Store transaction history in backend
   - Display past transactions with status
   - Filter and search capabilities

4. **Multi-chain Support**
   - Add more chains (Polygon, BSC, etc.)
   - Chain switching UI
   - Bridge functionality

5. **ENS Support**
   - Resolve ENS names to addresses
   - Display ENS names in UI
   - Reverse resolution

## Troubleshooting

### Common Issues

**Issue:** Transaction fails with "insufficient funds"
- **Solution:** Check wallet balance includes enough for amount + gas

**Issue:** "Please switch to Ethereum Mainnet"
- **Solution:** Change network in wallet to match NEXT_PUBLIC_CHAIN_ID

**Issue:** Balance not updating
- **Solution:** Wait for 10-second auto-refresh or manually refresh

**Issue:** "Invalid recipient address"
- **Solution:** Ensure address starts with 0x and is 42 characters

## Contributing

When modifying wallet functionality:
1. Update relevant tests
2. Test on testnet first
3. Verify security implications
4. Update this documentation
5. Follow existing code patterns

## License

UNLICENSED - See LICENSE file
