'use client';

import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchProductsRequest } from '@/redux/reducers/productsReducer';
import { addToCartRequest } from '@/redux/reducers/cartReducer';
import {
  selectAllProducts,
  selectProductsLoading,
  selectProductsListMeta,
} from '@/redux/selectors/productsSelectors';
import {
  selectCartLoading,
  selectCartError,
} from '@/redux/selectors/cartSelectors';
import { ProductCard } from './ProductCard';
import { Pagination } from '@/components/ui/Pagination';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/ToastContainer';

export const BrowsePage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const products = useSelector(selectAllProducts);
  const loading = useSelector(selectProductsLoading);
  const listMeta = useSelector(selectProductsListMeta);
  const cartLoading = useSelector(selectCartLoading);
  const cartError = useSelector(selectCartError);
  const { showToast } = useToast();
  const lastCartActionRef = useRef<{ action: string; productId: string } | null>(null);

  // Initialize state from URL params
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1')
  );
  const [category, setCategory] = useState<string>(
    searchParams.get('category') || ''
  );
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') || ''
  );
  const sortFromParams = searchParams.get('sort');
  const [sortBy, setSortBy] = useState<
    'newest' | 'price-low' | 'price-high' | 'popular'
  >(
    sortFromParams === 'price-low' ||
      sortFromParams === 'price-high' ||
      sortFromParams === 'popular'
      ? sortFromParams
      : 'newest'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(searchParams.get('minPrice') || '0'),
    parseInt(searchParams.get('maxPrice') || '1000'),
  ]);
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (category) params.set('category', category);
    if (searchTerm) params.set('search', searchTerm);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString());
    if (priceRange[1] < 1000) params.set('maxPrice', priceRange[1].toString());

    const queryString = params.toString();
    const newUrl = queryString ? `/marketplace?${queryString}` : '/marketplace';
    router.replace(newUrl, { scroll: false });
  }, [currentPage, category, searchTerm, sortBy, priceRange, router]);

  useEffect(() => {
    if (currentPage >= 1 && currentPage) {
      dispatch(fetchProductsRequest({ page: currentPage, limit: 20 }));
    }
  }, [currentPage, dispatch]);

  // Listen for cart operation success/failure
  useEffect(() => {
    // This effect runs when cartLoading changes from true to false
    // We use a ref to track which action was initiated
    if (!cartLoading && lastCartActionRef.current) {
      const { action, productId } = lastCartActionRef.current;
      
      if (action === 'add') {
        if (cartError) {
          showToast(cartError, 'error');
        } else {
          const product = products.find((p) => p.id === productId);
          if (product) {
            showToast(`${product.title} added to cart!`, 'success');
          }
        }
      }
      
      lastCartActionRef.current = null;
    }
  }, [cartLoading, cartError, products, showToast]);

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      showToast('Product not found', 'error');
      return;
    }

    if (product.stock <= 0) {
      showToast('This product is out of stock', 'warning');
      return;
    }

    if (cartLoading) {
      return; // Prevent multiple rapid clicks
    }

    // Track this action so we can show toast on completion
    lastCartActionRef.current = { action: 'add', productId };

    dispatch(
      addToCartRequest({
        productId,
        qty: 1,
        price: product.price,
      })
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { name: 'Electronics', icon: '💻' },
    { name: 'Clothing', icon: '👕' },
    { name: 'Food', icon: '🍔' },
    { name: 'Books', icon: '📚' },
    { name: 'Home & Garden', icon: '🏡' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Beauty', icon: '💄' },
    { name: 'Toys', icon: '🎮' },
  ];

  // Filter and sort products
  const filteredProducts = products
    .filter((p) => {
      if (searchTerm === undefined || searchTerm === '') {
        return p;
      }

      const matchesSearch =
        !searchTerm ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !category ||
        p.category?.name?.replace('\u0026', ' ').toLowerCase() ===
          category.toLowerCase();
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'popular':
          return b.stock - a.stock; // Using stock as proxy for popularity
        default:
          return 0;
      }
    });

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
              Discover Amazing Products
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Shop from thousands of verified sellers across the Caribbean
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-2xl">🚚</span>
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-2xl">🔒</span>
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-2xl">✨</span>
                <span>Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for products, brands, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            />
          </div>

          {/* Category Chips */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory('')}
                className={`px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${
                  category === ''
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={`px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105 flex items-center gap-2 ${
                    category === cat.name
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <button
              onClick={() => setShowPriceFilter(!showPriceFilter)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Price Range
              </h3>
              <svg
                className={`w-5 h-5 transition-transform ${showPriceFilter ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {showPriceFilter && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-600 font-medium mb-1 block">
                      Min Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={priceRange[1]}
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([
                          parseInt(e.target.value) || 0,
                          priceRange[1],
                        ])
                      }
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <span className="text-gray-400 mt-6">—</span>
                  <div className="flex-1">
                    <label className="text-xs text-gray-600 font-medium mb-1 block">
                      Max Price
                    </label>
                    <input
                      type="number"
                      min={priceRange[0]}
                      max="10000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([
                          priceRange[0],
                          parseInt(e.target.value) || 1000,
                        ])
                      }
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    ${priceRange[0]} - ${priceRange[1]}
                  </span>
                  <button
                    onClick={() => setPriceRange([0, 1000])}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sort and View Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-gray-700">
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as
                      | 'newest'
                      | 'price-low'
                      | 'price-high'
                      | 'popular'
                  )
                }
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">View:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600 font-medium">
            Showing{' '}
            <span className="text-gray-900 font-bold">
              {filteredProducts.length}
            </span>{' '}
            products
          </p>
          {(searchTerm ||
            category ||
            priceRange[0] > 0 ||
            priceRange[1] < 1000) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCategory('');
                setPriceRange([0, 1000]);
                setCurrentPage(1);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear all filters
            </button>
          )}
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length > 0 ? (
          <>
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12'
                  : 'flex flex-col gap-4 mb-12'
              }
            >
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    viewMode={viewMode}
                    disabled={cartLoading}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {listMeta.total > listMeta.perPage && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(listMeta.total / listMeta.perPage)}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="py-16">
            <EmptyState
              title="No products found"
              description="Try adjusting your search or filters to find what you're looking for"
            />
          </div>
        )}
      </div>
    </div>
  );
};
