'use client';

import { Drawer, Button, Empty, Divider } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  selectCartItems,
  selectCartTotal,
  selectCartLoading,
  selectCartItemCount,
} from '@/redux/selectors/cartSelectors';
import {
  removeFromCartRequest,
  updateCartItemQty,
} from '@/redux/reducers/cartReducer';
import { selectIsAuthenticated } from '@/redux/selectors/authSelectors';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const cartLoading = useSelector(selectCartLoading);
  const itemCount = useSelector(selectCartItemCount);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleRemove = (itemId: string) => {
    if (cartLoading) return;
    dispatch(removeFromCartRequest(itemId));
  };

  const handleQuantityChange = (itemId: string, newQty: number) => {
    if (newQty > 0 && !cartLoading) {
      dispatch(updateCartItemQty({ id: itemId, qty: newQty }));
    }
  };

  const handleCheckout = () => {
    onClose();
    if (isAuthenticated) {
      router.push('/checkout');
    } else {
      router.push('/login');
    }
  };

  const handleViewCart = () => {
    onClose();
    router.push('/cart');
  };

  const shipping = 5.0;
  const tax = total * 0.1;
  const grandTotal = total + shipping + tax;

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <ShoppingCartOutlined className="text-xl" />
          <span className="font-bold">Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
        </div>
      }
      placement="right"
      width={400}
      onClose={onClose}
      open={open}
      footer={
        cartItems.length > 0 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-semibold">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <Divider className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-blue-600">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button block onClick={handleViewCart}>
                View Cart
              </Button>
              <Button 
                type="primary" 
                block 
                onClick={handleCheckout}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Checkout
              </Button>
            </div>
          </div>
        ) : null
      }
    >
      {cartItems.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="space-y-2">
                <p className="text-gray-500">Your cart is empty</p>
                <Button type="primary" onClick={() => { onClose(); router.push('/marketplace'); }}>
                  Browse Products
                </Button>
              </div>
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  Product #{item.productId}
                </h3>
                <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="small"
                    icon={<MinusOutlined />}
                    onClick={() => handleQuantityChange(item.id, item.qty - 1)}
                    disabled={item.qty <= 1 || cartLoading}
                  />
                  <span className="font-semibold w-8 text-center">{item.qty}</span>
                  <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                    disabled={cartLoading}
                  />
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemove(item.id)}
                    disabled={cartLoading}
                    className="ml-auto"
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  ${(item.price * item.qty).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
};
