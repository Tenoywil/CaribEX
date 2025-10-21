'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { fetchProductByIdRequest } from '@/redux/reducers/productsReducer';
import { addToCartRequest } from '@/redux/reducers/cartReducer';
import { selectProductById, selectProductsLoading } from '@/redux/selectors/productsSelectors';
import { selectCartLoading, selectCartError } from '@/redux/selectors/cartSelectors';
import { ProductDetails } from '@/components/marketplace/ProductDetails';
import { Loader } from '@/components/ui/Loader';
import { useCartDrawer } from '@/components/cart/CartDrawerProvider';

export default function ProductPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const productId = params.id as string;
  
  const product = useSelector(selectProductById(productId));
  const loading = useSelector(selectProductsLoading);
  const cartLoading = useSelector(selectCartLoading);
  const cartError = useSelector(selectCartError);
  const { openCartDrawer } = useCartDrawer();
  const lastCartActionRef = useRef<{ action: string; quantity: number } | null>(null);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductByIdRequest(productId));
    }
  }, [productId, dispatch]);

  // Listen for cart operation success/failure
  useEffect(() => {
    // This effect runs when cartLoading changes from true to false
    if (!cartLoading && lastCartActionRef.current) {
      const { action, quantity } = lastCartActionRef.current;
      
      if (action === 'add') {
        if (cartError) {
          notification.error({
            message: 'Failed to Add to Cart',
            description: cartError,
            icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
            placement: 'topRight',
            duration: 3,
          });
        } else if (product) {
          notification.success({
            message: 'Added to Cart',
            description: (
              <div>
                <p className="font-semibold">{product.title}</p>
                <p className="text-sm text-gray-600">Quantity: {quantity}</p>
              </div>
            ),
            icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
            placement: 'topRight',
            duration: 2,
            btn: (
              <button
                onClick={() => {
                  notification.destroy();
                  openCartDrawer();
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              >
                View Cart
              </button>
            ),
          });
          // Auto-open cart drawer after a short delay
          setTimeout(() => openCartDrawer(), 500);
        }
      }
      
      lastCartActionRef.current = null;
    }
  }, [cartLoading, cartError, product, openCartDrawer]);

  const handleAddToCart = (productId: string, quantity: number) => {
    if (!product) {
      notification.error({
        message: 'Error',
        description: 'Product not found',
        placement: 'topRight',
        duration: 3,
      });
      return;
    }

    if (product.stock <= 0) {
      notification.warning({
        message: 'Out of Stock',
        description: 'This product is currently out of stock',
        placement: 'topRight',
        duration: 3,
      });
      return;
    }

    if (quantity > product.stock) {
      notification.warning({
        message: 'Insufficient Stock',
        description: `Only ${product.stock} items available in stock`,
        placement: 'topRight',
        duration: 3,
      });
      return;
    }

    if (cartLoading) {
      return; // Prevent multiple rapid clicks
    }

    // Track this action so we can show toast on completion
    lastCartActionRef.current = { action: 'add', quantity };

    dispatch(
      addToCartRequest({
        productId,
        qty: quantity,
        price: product.price,
      })
    );
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
