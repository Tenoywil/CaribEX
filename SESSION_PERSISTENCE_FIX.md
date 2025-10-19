# Session Persistence Fix Documentation

## Problem Statement
After successful SIWE (Sign-In With Ethereum) login, the user session was not persisting across page refreshes. This was causing authenticated users to be redirected to the login page when refreshing or navigating to protected pages.

## Root Cause Analysis

### The Issue
1. **Redux state is in-memory only** - When a page refreshes, all Redux state is cleared
2. **Race condition** - Protected pages were checking `isAuthenticated` before the session restoration check completed
3. **No loading state** - There was no way to distinguish between "checking for session" and "no session exists"

### Previous Flow (Broken)
```
Page Load → Redux State Empty (isAuthenticated = false)
          ↓
Protected Page Checks → Sees false → Redirects to /login
          ↓
useAuth Hook Tries to Restore → Too late, already redirected!
```

## Solution Implemented

### Added Session Checking State
A new `isCheckingSession` boolean was added to the auth state to track when we're actively checking for an existing session:

```typescript
interface AuthState {
  // ... existing fields
  isCheckingSession: boolean; // NEW: tracks session restoration
}
```

### New Flow (Fixed)
```
Page Load → isCheckingSession = true
          ↓
useAuth calls /v1/auth/me endpoint
          ↓
If session exists → restoreSession() → isCheckingSession = false, isAuthenticated = true
If no session → checkSessionComplete() → isCheckingSession = false, isAuthenticated = false
          ↓
Protected Pages Wait → Only redirect when isCheckingSession = false AND isAuthenticated = false
```

## Files Modified

### Core Authentication Logic
1. **redux/reducers/authReducer.ts**
   - Added `isCheckingSession` field to state (default: `true`)
   - Added `checkSessionRequest` action
   - Added `checkSessionComplete` action
   - Updated all success/failure actions to set `isCheckingSession = false`

2. **redux/selectors/authSelectors.ts**
   - Added `selectIsCheckingSession` selector

3. **hooks/useAuth.ts**
   - Properly dispatch `checkSessionRequest` when checking
   - Dispatch `checkSessionComplete` when check fails
   - Always check on mount (removed the `isAuthenticated` guard that prevented checks)

4. **types/index.ts**
   - Added `isCheckingSession` to `AuthState` interface

### Protected Pages Updated
All protected pages now wait for the session check to complete:

5. **app/wallet/page.tsx** - Main wallet page
6. **app/checkout/page.tsx** - Checkout flow
7. **app/profile/page.tsx** - User profile
8. **app/cart/page.tsx** - Shopping cart (shows login message only after check)
9. **app/sellers/page.tsx** - Sellers landing page

### Pattern Used in Protected Pages
```typescript
const isAuthenticated = useSelector(selectIsAuthenticated);
const isCheckingSession = useSelector(selectIsCheckingSession);

useEffect(() => {
  // Wait for session check to complete before redirecting
  if (!isCheckingSession && !isAuthenticated) {
    router.push('/login');
  }
}, [isAuthenticated, isCheckingSession, router]);

// Show loading state while checking
if (isCheckingSession || !isAuthenticated) {
  return <Loader size="lg" />;
}
```

## Testing

### Unit Tests Added
New comprehensive test suite in `tests/unit/authReducer.test.ts`:
- ✅ Initial state has `isCheckingSession = true`
- ✅ Session check request/complete actions work correctly
- ✅ Login success sets `isCheckingSession = false`
- ✅ Restore session sets `isCheckingSession = false`
- ✅ Page refresh scenario (check → restore)
- ✅ No session found scenario (check → complete)
- ✅ 11 tests total, all passing

### Manual Testing Steps

#### Test 1: Fresh Login and Persistence
1. Navigate to http://localhost:3000
2. Click "Connect Your Wallet"
3. Connect MetaMask and sign the SIWE message
4. Navigate to /wallet - should show wallet dashboard
5. **Refresh the page** - should remain authenticated and show wallet dashboard
6. Navigate to other protected pages - should all work without redirect

#### Test 2: Session Expiry
1. Log in successfully
2. Clear backend session (via backend API or cookie deletion)
3. Refresh page - should redirect to login

#### Test 3: Direct Navigation While Logged In
1. Log in successfully
2. Navigate directly to http://localhost:3000/wallet - should show wallet
3. Navigate to http://localhost:3000/profile - should show profile
4. All pages should load without flashing login page

#### Test 4: Cart Without Login
1. Browse to /cart without logging in
2. Should show cart with a message to sign in
3. Should not redirect immediately

## Benefits

### User Experience
- ✅ **No more unexpected logouts** - Session persists across page refreshes
- ✅ **Smooth navigation** - No redirect flashes on protected pages
- ✅ **Clear loading states** - Users see loading spinner during session check
- ✅ **Better UX on cart page** - Can browse cart before login

### Developer Experience
- ✅ **Clear separation of concerns** - Loading vs Not Authenticated states
- ✅ **Type-safe** - All changes fully typed
- ✅ **Well-tested** - 11 new unit tests ensure correctness
- ✅ **Consistent pattern** - All protected pages follow same approach

## Cart Functionality
As noted in the issue, **cart functionality was already working properly** and required no changes. The cart system correctly:
- Stores items in Redux
- Syncs with backend via API
- Handles checkout flow smoothly

## Technical Notes

### Why Start with `isCheckingSession = true`?
The initial state must be `true` because on first page load, we don't know if a session exists. Starting with `true` prevents premature redirects while we check.

### Why Not Use localStorage?
The session is stored in an HTTP-only cookie on the backend, which is more secure than localStorage. We just need to wait for the backend check to complete.

### Backend Endpoint Used
The fix relies on the backend endpoint `/v1/auth/me` which:
- Uses the HTTP-only session cookie automatically sent by the browser
- Returns user data if session is valid
- Returns 401 if no session exists

## Rollback Plan
If issues arise, revert commit `e41eb84` to restore previous behavior. However, this will bring back the session persistence issue.

## Future Improvements
1. Add session expiry warning before auto-logout
2. Implement refresh token rotation for longer sessions
3. Add session persistence indicator in UI
4. Consider adding session timeout countdown
