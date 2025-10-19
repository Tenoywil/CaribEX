import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Header } from '@/components/layout/Header';
import { authReducer } from '@/redux/reducers/authReducer';
import { cartReducer } from '@/redux/reducers/cartReducer';
import { productsReducer } from '@/redux/reducers/productsReducer';
import { walletReducer } from '@/redux/reducers/walletReducer';

// Mock Next.js router
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

const createMockStore = (isAuthenticated: boolean, cartItems: number = 0) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      products: productsReducer,
      wallet: walletReducer,
    },
    preloadedState: {
      auth: {
        user: isAuthenticated ? { id: '1', handle: 'testuser', wallet_address: '0x123...' } : null,
        session: isAuthenticated ? { expiresAt: new Date(Date.now() + 3600000).toISOString() } : null,
        isAuthenticated,
        loading: false,
        error: null,
      },
      cart: {
        id: '1',
        items: Array(cartItems).fill({ id: '1', productId: '1', qty: 1, price: 10 }),
        total: cartItems * 10,
        loading: false,
        error: null,
      },
      products: {
        byId: {},
        allIds: [],
        listMeta: { page: 1, total: 0, perPage: 20 },
        loading: false,
        error: null,
      },
      wallet: {
        balance: 100,
        currency: 'USD',
        transactions: [],
        loading: false,
        error: null,
      },
    },
  });
};

describe('Header Component', () => {
  it('renders marketplace and wallet links', () => {
    const store = createMockStore(false);
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    expect(screen.getByText('Marketplace')).toBeInTheDocument();
    expect(screen.getByText('Wallet')).toBeInTheDocument();
    expect(screen.getByText('Cart')).toBeInTheDocument();
  });

  it('shows Connect Wallet button when not authenticated', () => {
    const store = createMockStore(false);
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });

  it('shows user menu when authenticated', () => {
    const store = createMockStore(true);
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('displays cart item count badge when items in cart', () => {
    const store = createMockStore(false, 3);
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows user dropdown menu when clicking user button', () => {
    const store = createMockStore(true);
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    const userButton = screen.getByText('testuser').closest('button');
    fireEvent.click(userButton!);

    // Check for dropdown menu items
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('shows Orders and Seller Dashboard links for authenticated users', () => {
    const store = createMockStore(true);
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    // These should be visible on desktop (using getByText which doesn't check visibility)
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Sell')).toBeInTheDocument();
  });

  it('dispatches logout action when logout is clicked', () => {
    const store = createMockStore(true);
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    // Open user menu
    const userButton = screen.getByText('testuser').closest('button');
    fireEvent.click(userButton!);

    // Click logout
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'auth/logout' }));
  });

  it('closes dropdown when clicking outside', () => {
    const store = createMockStore(true);
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    // Open user menu
    const userButton = screen.getByText('testuser').closest('button');
    fireEvent.click(userButton!);

    // Menu should be visible
    expect(screen.getByText('Logout')).toBeInTheDocument();

    // Click backdrop (fixed inset-0 div)
    const backdrop = document.querySelector('.fixed.inset-0');
    fireEvent.click(backdrop!);

    // Menu should be closed - logout button should not be in document
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });
});
