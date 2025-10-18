'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductByIdRequest } from '@/redux/reducers/productsReducer';
import { addToCartRequest } from '@/redux/reducers/cartReducer';
import { selectProductById, selectProductsLoading } from '@/redux/selectors/productsSelectors';
import { ProductDetails } from '@/components/marketplace/ProductDetails';
import { Loader } from '@/components/ui/Loader';

export default function ProductPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const productId = params.id as string;
  
  const product = useSelector(selectProductById(productId));
  const loading = useSelector(selectProductsLoading);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductByIdRequest(productId));
    }
  }, [productId, dispatch]);

  const handleAddToCart = (productId: string, quantity: number) => {
    if (product) {
      dispatch(
        addToCartRequest({
          productId,
          qty: quantity,
          price: product.price,
        })
      );
    }
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
      <ProductDetails product={product} onAddToCart={handleAddToCart} />
    </div>
  );
}
