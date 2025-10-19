'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  createProductRequest,
  clearSellerMessages,
} from '@/redux/reducers/sellerReducer';
import {
  selectSellerLoading,
  selectSellerError,
  selectCreateSuccess,
} from '@/redux/selectors/sellerSelectors';
import { ProductFormData } from '@/types';
import { Loader } from '@/components/ui/Loader';
import { apiClient } from '@/lib/apiClient';

interface UploadedImage {
  url: string;
  filename: string;
  file?: File;
}

export const ProductForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const loading = useSelector(selectSellerLoading);
  const error = useSelector(selectSellerError);
  const createSuccess = useSelector(selectCreateSuccess);

  const [step, setStep] = useState<'details' | 'images'>('details');
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: 0,
    currency: 'USD',
    category: '',
    stock: 0,
    images: [],
  });

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (createSuccess) {
      // Show success message then redirect
      setTimeout(() => {
        dispatch(clearSellerMessages());
        // Clear form
        setFormData({
          title: '',
          description: '',
          price: 0,
          currency: 'USD',
          category: '',
          stock: 0,
          images: [],
        });
        setUploadedImages([]);
        setStep('details');
        router.push('/seller/dashboard');
      }, 2000);
    }
  }, [createSuccess, router, dispatch]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleDetailsNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.description ||
      formData.price <= 0 ||
      !formData.category ||
      formData.stock < 0
    ) {
      return;
    }
    setStep('images');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(`File ${file.name} exceeds 5MB limit`);
        continue;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError(`File ${file.name} is not an image`);
        continue;
      }

      try {
        setUploadingImage(true);

        // Create FormData for multipart upload
        const formData = new FormData();
        formData.append('image', file);

        // Upload to /v1/products/upload-image
        const response = await apiClient.post<UploadedImage>(
          '/v1/products/upload-image',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        setUploadedImages((prev) => [...prev, { ...response, file }]);
      } catch (err: any) {
        setUploadError(err.message || 'Failed to upload image');
      } finally {
        setUploadingImage(false);
      }
    }

    // Clear the input
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Collect all uploaded image URLs
    const imageUrls = uploadedImages.map((img) => img.url);

    const productData = {
      ...formData,
      images: imageUrls,
    };

    dispatch(createProductRequest(productData));
  };

  const categories = [
    'Electronics',
    'Clothing',
    'Food',
    'Books',
    'Home & Garden',
    'Sports',
    'Beauty',
    'Toys',
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'details' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}
              >
                {step === 'details' ? '1' : '✓'}
              </div>
              <span className="ml-2 font-medium">Product Details</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div
                className={`h-full bg-blue-600 transition-all ${step === 'images' ? 'w-full' : 'w-0'}`}
              ></div>
            </div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'images' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}
              >
                2
              </div>
              <span className="ml-2 font-medium">Product Images</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {createSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            Product created successfully! Clearing form and redirecting to
            dashboard...
          </div>
        )}

        {/* Step 1: Product Details */}
        {step === 'details' && (
          <form onSubmit={handleDetailsNext} className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Step 1: Product Details</h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter product title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your product"
              />
            </div>

            {/* Price and Currency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="ETH">ETH</option>
                  <option value="USDC">USDC</option>
                </select>
              </div>
            </div>

            {/* Category and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <button type="submit" className="flex-1 btn-primary">
                Next: Add Images →
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Product Images */}
        {step === 'images' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">
              Step 2: Upload Product Images
            </h2>

            {uploadError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {uploadError}
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images (Max 5MB per file)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB each
                  </p>
                </div>
              </div>

              {uploadingImage && (
                <div className="mt-4 flex items-center justify-center">
                  <Loader size="sm" />
                  <span className="ml-2 text-sm text-gray-600">
                    Uploading image...
                  </span>
                </div>
              )}
            </div>

            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Uploaded Images ({uploadedImages.length})
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={img.url}
                        alt={`Product ${index + 1}`}
                        fill
                        loading="lazy"
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {img.filename}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                ← Back to Details
              </button>
              <button
                type="submit"
                disabled={loading || uploadedImages.length === 0}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader size="sm" /> : 'Create Product'}
              </button>
            </div>

            {uploadedImages.length === 0 && (
              <p className="text-sm text-gray-500 text-center">
                Please upload at least one image to continue
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
