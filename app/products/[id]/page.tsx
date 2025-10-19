'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductByIdRequest } from '@/redux/reducers/productsReducer';
import { addToCartRequest } from '@/redux/reducers/cartReducer';
import { selectProductById, selectProductsLoading } from '@/redux/selectors/productsSelectors';
import { selectCartLoading, selectCartError } from '@/redux/selectors/cartSelectors';
import { ProductDetails } from '@/components/marketplace/ProductDetails';
import { Loader } from '@/components/ui/Loader';
import { useToast } from '@/components/ui/ToastContainer';

export default function ProductPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const productId = params.id as string;
  
  const product = useSelector(selectProductById(productId));
  const loading = useSelector(selectProductsLoading);
  const cartLoading = useSelector(selectCartLoading);
  const cartError = useSelector(selectCartError);
  const { showToast } = useToast();

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductByIdRequest(productId));
    }
  }, [productId, dispatch]);

  // Show toast when cart error occurs
  useEffect(() => {
    if (cartError) {
      showToast(cartError, 'error');
    }
  }, [cartError, showToast]);

  const handleAddToCart = (productId: string, quantity: number) => {
    if (!product) {
      showToast('Product not found', 'error');
      return;
    }

    if (product.stock <= 0) {
      showToast('This product is out of stock', 'warning');
      return;
    }

    if (quantity > product.stock) {
      showToast(`Only ${product.stock} items available in stock`, 'warning');
      return;
    }

    if (cartLoading) {
      return; // Prevent multiple rapid clicks
    }

    dispatch(
      addToCartRequest({
        productId,
        qty: quantity,
        price: product.price,
      })
    );
    showToast(`${product.title} (${quantity}x) added to cart!`, 'success');
  };

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} onAddToCart={handleAddToCart} disabled={cartLoading} />
    </div>
  );
}
