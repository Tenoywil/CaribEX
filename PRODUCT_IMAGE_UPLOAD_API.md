# Product Image Upload API Integration

## Overview
The product creation flow has been updated to support file uploads via multipart/form-data with a two-step process.

## API Endpoints

### 1. Upload Single Image
```
POST /v1/products/upload-image
Content-Type: multipart/form-data
```

**Request**:
- Field: `image` (file)
- Max file size: 5MB
- Supported formats: image/*

**Response**:
```typescript
{
  url: string;      // Public URL of uploaded image
  filename: string; // Original filename
}
```

### 2. Create Product (JSON)
```
POST /v1/products
Content-Type: application/json
```

**Request**:
```typescript
{
  title: string;
  description: string;
  price: number;
  currency: string; // "USD" | "ETH" | "USDC"
  category: string;
  stock: number;
  images: string[]; // Array of image URLs from upload-image endpoint
}
```

**Response**: Product object

### 3. Create Product (Multipart) - Alternative
```
POST /v1/products/multipart
Content-Type: multipart/form-data
```

**Request** (FormData):
- `title`: string
- `description`: string
- `price`: string (number as string)
- `quantity`: string (number as string)
- `category_id`: string
- `images[]`: File[] (multiple image files)

**Response**: Product object

## Frontend Implementation

### Two-Step Process

#### Step 1: Product Details
User fills out:
- Title (required)
- Description (required)
- Price (required, min 0)
- Currency (USD, ETH, USDC)
- Category (required, dropdown)
- Stock quantity (required, min 0)

#### Step 2: Image Upload
1. User selects image files (multiple supported)
2. Each file is validated:
   - Max size: 5MB per file
   - Type: image/* only
3. Files are uploaded one by one to `/v1/products/upload-image`
4. Uploaded images are displayed with preview
5. User can remove uploaded images
6. On submit, product is created with image URLs

### File Validation

```typescript
// Max file size
if (file.size > 5 * 1024 * 1024) {
  error: "File exceeds 5MB limit"
}

// File type
if (!file.type.startsWith('image/')) {
  error: "File is not an image"
}
```

### Success Flow
1. Product created successfully
2. Success message shown for 2 seconds
3. Form is cleared
4. User redirected to seller dashboard

## Component: ProductForm

**Location**: `components/seller/ProductForm.tsx`

**Key Features**:
- Visual progress indicator (Step 1/2)
- File drag-and-drop support
- Real-time upload progress
- Image preview with remove capability
- Form state persistence between steps
- Validation on each step
- Error handling for uploads

**State Management**:
```typescript
interface UploadedImage {
  url: string;      // From API response
  filename: string; // From API response
  file?: File;      // Original file object
}
```

## Usage Example

### Upload Image
```typescript
const formData = new FormData();
formData.append('image', file);

const response = await apiClient.post<UploadedImage>(
  '/v1/products/upload-image',
  formData,
  {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
);
// response: { url: "https://...", filename: "product.jpg" }
```

### Create Product
```typescript
const productData = {
  title: "Sample Product",
  description: "Product description",
  price: 99.99,
  currency: "USD",
  category: "Electronics",
  stock: 10,
  images: ["https://...", "https://..."], // URLs from upload-image
};

dispatch(createProductRequest(productData));
```

## Error Handling

### Upload Errors
- File too large (>5MB)
- Invalid file type (not an image)
- Network errors
- Server errors

### Display
Errors shown in red alert box above upload area.

### User Actions
- Remove failed upload
- Retry upload
- Continue with successfully uploaded images

## Security Considerations

**Frontend**:
- File size validation before upload
- File type validation (client-side)
- HTTPS for image URLs
- No sensitive data in image metadata

**Backend** (Expected):
- Server-side file validation
- Virus scanning
- Image optimization/resizing
- CDN integration for image serving
- Rate limiting on uploads

## Performance Optimizations

**Current**:
- Individual file upload (sequential)
- Progress indicators per file
- Image previews from URLs

**Potential Improvements**:
- Batch upload (parallel)
- Image compression before upload
- Lazy loading for previews
- Upload progress bars per file
- Resumable uploads for large files

## Browser Compatibility

**File Upload**:
- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Mobile browsers ✅

**Drag & Drop**:
- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Mobile (varies)

## Testing

### Manual Testing Checklist
- [ ] Upload single image (< 5MB)
- [ ] Upload multiple images
- [ ] Attempt upload > 5MB file (should fail)
- [ ] Attempt upload non-image file (should fail)
- [ ] Remove uploaded image
- [ ] Complete product creation with images
- [ ] Verify images display in seller dashboard
- [ ] Verify images display in marketplace
- [ ] Test on mobile devices
- [ ] Test drag-and-drop

### Edge Cases
- [ ] Network interruption during upload
- [ ] Duplicate image upload
- [ ] Maximum number of images
- [ ] Navigate back during upload
- [ ] Form reset after success

## Future Enhancements

**Phase 2**:
- [ ] Multiple file upload progress bar
- [ ] Image cropping/editing
- [ ] Image reordering (drag-to-reorder)
- [ ] Primary image selection
- [ ] Image optimization (auto-resize)
- [ ] Upload from URL
- [ ] Upload from camera (mobile)

**Phase 3**:
- [ ] Bulk product import with images
- [ ] Image AI tagging
- [ ] Background removal
- [ ] Watermark support
- [ ] Video support

---

*Last updated: October 2025*
*Implemented for CaribEX seller product management*
