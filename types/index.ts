// Core domain types for CaribEX

export interface User {
  id: string;
  handle: string;
  wallet_address: string;
}

export interface Session {
  expiresAt: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  sellerId: string;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsState {
  byId: Record<string, Product>;
  allIds: string[];
  listMeta: {
    page: number;
    total: number;
    perPage: number;
  };
  loading: boolean;
  error: string | null;
}

export interface CartItem {
  id: string;
  productId: string;
  qty: number;
  price: number;
}

export interface CartState {
  id: string | null;
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  from: string;
  to: string;
  timestamp: string;
  txHash?: string;
}

export interface WalletState {
  balance: number;
  currency: string;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  products: ProductsState;
  cart: CartState;
  wallet: WalletState;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress?: string;
  createdAt: string;
  updatedAt: string;
}

// Seller product management types
export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  stock: number;
  images: string[];
}

export interface SellerState {
  myProducts: {
    byId: Record<string, Product>;
    allIds: string[];
  };
  loading: boolean;
  error: string | null;
  createSuccess: boolean;
  updateSuccess: boolean;
}
