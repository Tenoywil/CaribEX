# Component Guide

## Overview

This guide provides detailed information about the CaribEX component library, including usage examples, props interfaces, and best practices.

---

## Component Categories

### UI Components (Generic)
- Loader
- EmptyState
- Pagination
- Button (to be created)
- Input (to be created)
- Modal (to be created)

### Layout Components
- Header (to be created)
- Footer (to be created)
- AppLayout (to be created)
- Sidebar (to be created)

### Wallet Components
- WalletBalance
- SendForm
- SendConfirmation (to be created)
- ReceiveModal (to be created)
- WalletTransactions (to be created)

### Marketplace Components
- ProductCard (to be created)
- ProductDetails (to be created)
- BrowsePage (to be created)
- ProductForm (to be created)

### Cart Components
- CartList (to be created)
- CartSummary (to be created)
- CheckoutForm (to be created)

---

## UI Components

### Loader

A simple loading spinner component.

**Usage:**

```tsx
import { Loader } from '@/components/ui/Loader';

<Loader size="md" />
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | 'sm' \| 'md' \| 'lg' | 'md' | Size of the loader |

**Example:**

```tsx
// Small loader
<Loader size="sm" />

// Default medium loader
<Loader />

// Large loader
<Loader size="lg" />
```

---

### EmptyState

Display a message when there's no data to show.

**Usage:**

```tsx
import { EmptyState } from '@/components/ui/EmptyState';

<EmptyState
  title="No products found"
  description="Try adjusting your search criteria"
  action={<button>Browse All</button>}
/>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| title | string | Yes | Main heading text |
| description | string | No | Descriptive text |
| icon | React.ReactNode | No | Icon to display above title |
| action | React.ReactNode | No | Action button or link |

**Example:**

```tsx
<EmptyState
  icon={<ShoppingCartIcon />}
  title="Your cart is empty"
  description="Add some products to get started"
  action={
    <a href="/marketplace" className="btn-primary">
      Browse Marketplace
    </a>
  }
/>
```

---

### Pagination

Navigate through pages of data.

**Usage:**

```tsx
import { Pagination } from '@/components/ui/Pagination';

<Pagination
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => console.log(page)}
/>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| currentPage | number | Yes | Current active page |
| totalPages | number | Yes | Total number of pages |
| onPageChange | (page: number) => void | Yes | Callback when page changes |

**Example:**

```tsx
const [currentPage, setCurrentPage] = useState(1);
const totalPages = Math.ceil(totalItems / itemsPerPage);

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
```

---

## Wallet Components

### WalletBalance

Display wallet balance with quick actions.

**Usage:**

```tsx
import { WalletBalance } from '@/components/wallet/WalletBalance';

<WalletBalance />
```

**Features:**
- Displays current balance and currency
- Quick action buttons for Send and Receive
- Loading state
- Automatically fetches balance from Redux store

**Example:**

```tsx
// Use in a wallet dashboard page
<div className="grid gap-4">
  <WalletBalance />
  <WalletTransactions />
</div>
```

---

### SendForm

Form for sending funds to another wallet.

**Usage:**

```tsx
import { SendForm } from '@/components/wallet/SendForm';

<SendForm />
```

**Features:**
- Recipient input (wallet address or username)
- Amount input with validation
- Optional note field
- Error handling
- Loading state during submission
- Integrates with Redux saga for transaction flow

**Example:**

```tsx
// Use in a modal or dedicated page
<Modal>
  <SendForm />
</Modal>
```

---

## Best Practices

### Component Structure

```tsx
// Good: Separated concerns
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
};

// Bad: Mixed concerns
export const ButtonWithData = () => {
  const data = useSelector(selectData); // Avoid in presentational components
  return <button>{data.label}</button>;
};
```

### TypeScript Props

Always define prop interfaces:

```tsx
// Good: Explicit interface
interface CardProps {
  title: string;
  description?: string;
  image?: string;
  onClic?: () => void;
}

export const Card = ({ title, description, image, onClick }: CardProps) => {
  // Implementation
};

// Bad: Inline types
export const Card = (props: { title: string; description?: string }) => {
  // Implementation
};
```

### Component Composition

Use composition for flexibility:

```tsx
// Good: Composable
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardBody>
    <p>Content</p>
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Bad: Monolithic
<Card
  title="Title"
  content="Content"
  action={<Button>Action</Button>}
/>
```

### State Management

**Presentational Components:**
- Receive data via props
- Call callbacks for actions
- No Redux/API calls

```tsx
interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => onAddToCart(product.id)}>
        Add to Cart
      </button>
    </div>
  );
};
```

**Container Components:**
- Connect to Redux
- Fetch data
- Handle business logic

```tsx
'use client';

import { useDispatch, useSelector } from 'react-redux';
import { addToCartRequest } from '@/redux/reducers/cartReducer';
import { selectAllProducts } from '@/redux/selectors/productsSelectors';
import { ProductCard } from './ProductCard';

export const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      dispatch(addToCartRequest({
        productId,
        qty: 1,
        price: product.price
      }));
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
};
```

---

## Styling Guidelines

### Tailwind CSS Classes

Use Tailwind utility classes for styling:

```tsx
// Good: Tailwind utilities
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
    Action
  </button>
</div>

// Avoid: Inline styles (except for dynamic values)
<div style={{ padding: '16px', backgroundColor: 'white' }}>
  // Content
</div>
```

### Conditional Classes

Use template literals or classnames library:

```tsx
// Good: Template literal
<button
  className={`px-4 py-2 rounded-lg ${
    variant === 'primary'
      ? 'bg-blue-600 text-white'
      : 'bg-gray-200 text-gray-900'
  }`}
>
  {label}
</button>

// Or use classnames library
import classNames from 'classnames';

<button
  className={classNames(
    'px-4 py-2 rounded-lg',
    {
      'bg-blue-600 text-white': variant === 'primary',
      'bg-gray-200 text-gray-900': variant === 'secondary',
    }
  )}
>
  {label}
</button>
```

---

## Testing Components

### Unit Tests

Test component rendering and interactions:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies primary variant styles', () => {
    render(<Button label="Primary" onClick={() => {}} variant="primary" />);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('btn-primary');
  });
});
```

### Integration Tests

Test component with Redux:

```tsx
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { WalletBalance } from './WalletBalance';
import { walletReducer } from '@/redux/reducers/walletReducer';

describe('WalletBalance', () => {
  it('displays balance from store', () => {
    const store = configureStore({
      reducer: {
        wallet: walletReducer,
      },
      preloadedState: {
        wallet: {
          balance: 1000,
          currency: 'USD',
          transactions: [],
          loading: false,
          error: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <WalletBalance />
      </Provider>
    );

    expect(screen.getByText(/USD 1000\.00/)).toBeInTheDocument();
  });
});
```

---

## Accessibility

### Semantic HTML

Use semantic elements:

```tsx
// Good: Semantic
<nav>
  <ul>
    <li><a href="/home">Home</a></li>
  </ul>
</nav>

// Bad: Divs everywhere
<div className="nav">
  <div className="list">
    <div className="item">
      <span onClick={goHome}>Home</span>
    </div>
  </div>
</div>
```

### ARIA Attributes

Add ARIA labels where needed:

```tsx
<button
  aria-label="Close modal"
  onClick={onClose}
>
  <XIcon />
</button>

<input
  type="text"
  aria-describedby="email-help"
  placeholder="Email"
/>
<span id="email-help" className="text-sm text-gray-600">
  We'll never share your email
</span>
```

### Keyboard Navigation

Ensure keyboard accessibility:

```tsx
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyPress={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Clickable Div
</div>
```

---

## Performance Optimization

### React.memo

Memoize components that receive stable props:

```tsx
import { memo } from 'react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo(({ product }: ProductCardProps) => {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>{product.price}</p>
    </div>
  );
});
```

### useMemo and useCallback

Optimize expensive computations and callbacks:

```tsx
import { useMemo, useCallback } from 'react';

export const ProductList = ({ products }: Props) => {
  // Memoize expensive computation
  const sortedProducts = useMemo(() => {
    return products.sort((a, b) => a.price - b.price);
  }, [products]);

  // Memoize callback
  const handleAddToCart = useCallback((id: string) => {
    dispatch(addToCartRequest({ productId: id, qty: 1 }));
  }, [dispatch]);

  return (
    <div>
      {sortedProducts.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
};
```

---

## Conclusion

This component guide provides the foundation for building consistent, maintainable, and performant components in the CaribEX application. Follow these patterns and best practices to ensure a high-quality codebase.
