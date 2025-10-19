# API Integration Guide

## Overview

This document describes the backend API integration for the CaribEX frontend application. The API follows RESTful conventions and uses JSON for request/response payloads.

---

## Base Configuration

### API Client Setup

The application uses a centralized API client located at `/lib/apiClient.ts`:

```typescript
import { apiClient } from '@/lib/apiClient';

// Example usage
const products = await apiClient.get('/v1/products');
const result = await apiClient.post('/v1/cart/items', { productId, qty });
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:4000  # Backend API URL
```

### Authentication

All authenticated requests use HTTP-only cookies. The cookie is set automatically after successful SIWE authentication.

---

## API Endpoints

### Authentication Endpoints

#### Get Nonce
```
GET /v1/auth/nonce
```

**Response:**
```json
{
  "nonce": "random-nonce-string"
}
```

#### Sign In With Ethereum (SIWE)
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

#### Logout
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

### Wallet Endpoints

#### Get Wallet Balance
```
GET /v1/wallet/balance
```

**Response:**
```json
{
  "balance": 1000.50,
  "currency": "USD"
}
```

#### Get Transactions
```
GET /v1/wallet/transactions?page=1&limit=20
```

**Response:**
```json
{
  "transactions": [
    {
      "id": "tx-id",
      "type": "send",
      "amount": 50.00,
      "currency": "USD",
      "status": "completed",
      "from": "0x...",
      "to": "0x...",
      "timestamp": "2024-01-15T10:30:00Z",
      "txHash": "0x..."
    }
  ],
  "page": 1,
  "total": 100
}
```

#### Send Funds (Create Pending Transaction)
```
POST /v1/wallet/send
```

**Request:**
```json
{
  "to": "0x... or username",
  "amount": 50.00,
  "note": "Payment for services"
}
```

**Response:**
```json
{
  "id": "pending-tx-id",
  "message": "Sign this message to confirm transaction..."
}
```

#### Confirm Send Transaction
```
POST /v1/wallet/send/:id/confirm
```

**Request:**
```json
{
  "signature": "0x..."
}
```

**Response:**
```json
{
  "id": "tx-id",
  "type": "send",
  "amount": 50.00,
  "currency": "USD",
  "status": "pending",
  "from": "0x...",
  "to": "0x...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### Products Endpoints

#### List Products
```
GET /v1/products?page=1&limit=20&category=electronics
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `category` (optional): Filter by category
- `search` (optional): Search query
- `sort` (optional): Sort field (price, created_at, popularity)
- `order` (optional): Sort order (asc, desc)

**Response:**
```json
{
  "products": [
    {
      "id": "product-id",
      "name": "Product Name",
      "description": "Product description",
      "price": 99.99,
      "currency": "USD",
      "images": ["url1", "url2"],
      "sellerId": "seller-id",
      "category": "electronics",
      "stock": 10,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T00:00:00Z"
    }
  ],
  "page": 1,
  "total": 250
}
```

#### Get Product by ID
```
GET /v1/products/:id
```

**Response:**
```json
{
  "id": "product-id",
  "name": "Product Name",
  "description": "Detailed product description",
  "price": 99.99,
  "currency": "USD",
  "images": ["url1", "url2"],
  "sellerId": "seller-id",
  "sellerInfo": {
    "id": "seller-id",
    "handle": "seller-name",
    "rating": 4.5
  },
  "category": "electronics",
  "stock": 10,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T00:00:00Z"
}
```

#### Create Product (Seller)
```
POST /v1/products
```

**Request:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "category": "electronics",
  "stock": 10,
  "images": ["url1", "url2"]
}
```

**Response:**
```json
{
  "id": "product-id",
  "name": "Product Name",
  ...
}
```

#### Update Product
```
PUT /v1/products/:id
```

**Request:**
```json
{
  "name": "Updated Name",
  "price": 89.99,
  "stock": 15
}
```

**Response:**
```json
{
  "id": "product-id",
  "name": "Updated Name",
  ...
}
```

#### Delete Product
```
DELETE /v1/products/:id
```

**Response:**
```json
{
  "success": true
}
```

---

### Cart Endpoints

#### Get Cart
```
GET /v1/cart
```

**Response:**
```json
{
  "id": "cart-id",
  "items": [
    {
      "id": "item-id",
      "productId": "product-id",
      "qty": 2,
      "price": 99.99,
      "product": {
        "name": "Product Name",
        "images": ["url1"]
      }
    }
  ],
  "total": 199.98
}
```

#### Add Item to Cart
```
POST /v1/cart/items
```

**Request:**
```json
{
  "productId": "product-id",
  "qty": 2,
  "price": 99.99
}
```

**Response:**
```json
{
  "cartItem": {
    "id": "item-id",
    "productId": "product-id",
    "qty": 2,
    "price": 99.99
  },
  "cartId": "cart-id"
}
```

#### Update Cart Item
```
PUT /v1/cart/items/:id
```

**Request:**
```json
{
  "qty": 3
}
```

**Response:**
```json
{
  "id": "item-id",
  "qty": 3,
  ...
}
```

#### Remove Item from Cart
```
DELETE /v1/cart/items/:id
```

**Response:**
```json
{
  "success": true
}
```

#### Clear Cart
```
DELETE /v1/cart
```

**Response:**
```json
{
  "success": true
}
```

---

### Order Endpoints

#### Create Order (Checkout)
```
POST /v1/orders
```

**Request:**
```json
{
  "cartId": "cart-id",
  "shippingAddress": "123 Main St, Kingston, Jamaica"
}
```

**Response:**
```json
{
  "id": "order-id",
  "userId": "user-id",
  "items": [...],
  "total": 199.98,
  "status": "pending",
  "shippingAddress": "123 Main St, Kingston, Jamaica",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### Get Order History
```
GET /v1/orders?page=1&limit=20
```

**Response:**
```json
{
  "orders": [
    {
      "id": "order-id",
      "total": 199.98,
      "status": "completed",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "page": 1,
  "total": 10
}
```

#### Get Order Details
```
GET /v1/orders/:id
```

**Response:**
```json
{
  "id": "order-id",
  "userId": "user-id",
  "items": [
    {
      "id": "item-id",
      "productId": "product-id",
      "qty": 2,
      "price": 99.99,
      "product": {
        "name": "Product Name",
        "images": ["url1"]
      }
    }
  ],
  "total": 199.98,
  "status": "completed",
  "shippingAddress": "123 Main St, Kingston, Jamaica",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-16T14:20:00Z"
}
```

---

### Internal Endpoints

#### Invalidate Cache
```
POST /internal/cache/invalidate
```

**Request:**
```json
{
  "pattern": "products:*"
}
```

**Response:**
```json
{
  "success": true,
  "keysInvalidated": 15
}
```

---

## Error Handling

### Error Response Format

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context"
    }
  }
}
```

### Common HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (not authenticated)
- **403**: Forbidden (not authorized)
- **404**: Not Found
- **409**: Conflict (e.g., duplicate entry)
- **429**: Too Many Requests (rate limited)
- **500**: Internal Server Error

### Common Error Codes

- `VALIDATION_ERROR`: Request validation failed
- `AUTH_REQUIRED`: Authentication required
- `INVALID_SIGNATURE`: Invalid SIWE signature
- `INSUFFICIENT_BALANCE`: Not enough funds
- `PRODUCT_NOT_FOUND`: Product doesn't exist
- `OUT_OF_STOCK`: Product out of stock
- `CART_EMPTY`: Cart is empty
- `ORDER_NOT_FOUND`: Order doesn't exist

---

## Rate Limiting

The API implements rate limiting on sensitive endpoints:

- **Authentication**: 5 requests per minute
- **Wallet Operations**: 10 requests per minute
- **Product Creation**: 20 requests per hour
- **General**: 100 requests per minute

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

---

## Webhooks (Future)

For real-time updates, the backend may support webhooks:

- Transaction confirmations
- Order status updates
- Product inventory changes

Frontend can poll or use WebSocket connections for updates.

---

## Testing

### Mock Server (MSW)

For testing, use Mock Service Worker:

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/v1/products', (req, res, ctx) => {
    return res(ctx.json({ products: [], page: 1, total: 0 }));
  })
);
```

### API Client Testing

Test the API client with mocked responses:

```typescript
import { apiClient } from '@/lib/apiClient';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

test('fetches products', async () => {
  mockedAxios.get.mockResolvedValue({ data: { products: [] } });
  const result = await apiClient.get('/v1/products');
  expect(result.products).toEqual([]);
});
```

---

## Conclusion

This API integration guide provides all the necessary endpoints and patterns for building the CaribEX frontend. Follow RESTful conventions and handle errors gracefully for the best user experience.
