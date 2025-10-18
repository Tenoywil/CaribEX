'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsRequest } from '@/redux/reducers/productsReducer';
import { addToCartRequest } from '@/redux/reducers/cartReducer';
import {
  selectAllProducts,
  selectProductsLoading,
  selectProductsListMeta,
} from '@/redux/selectors/productsSelectors';
import { ProductCard } from './ProductCard';
import { Pagination } from '@/components/ui/Pagination';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';

export const BrowsePage = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const loading = useSelector(selectProductsLoading);
  const listMeta = useSelector(selectProductsListMeta);

  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchProductsRequest({ page: currentPage, limit: 20 }));
  }, [currentPage, dispatch]);

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      dispatch(
        addToCartRequest({
          productId,
          qty: 1,
          price: product.price,
        })
      );
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Home & Garden'];

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Marketplace</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* Pagination */}
          {listMeta.total > listMeta.perPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(listMeta.total / listMeta.perPage)}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <EmptyState
          title="No products found"
          description="Try adjusting your search or filters"
        />
      )}
    </div>
  );
};
