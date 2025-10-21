'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CartDrawer } from './CartDrawer';

interface CartDrawerContextType {
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

const CartDrawerContext = createContext<CartDrawerContextType | undefined>(undefined);

export const useCartDrawer = () => {
  const context = useContext(CartDrawerContext);
  if (!context) {
    throw new Error('useCartDrawer must be used within CartDrawerProvider');
  }
  return context;
};

interface CartDrawerProviderProps {
  children: ReactNode;
}

export const CartDrawerProvider = ({ children }: CartDrawerProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openCartDrawer = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCartDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <CartDrawerContext.Provider value={{ openCartDrawer, closeCartDrawer }}>
      {children}
      <CartDrawer open={isOpen} onClose={closeCartDrawer} />
    </CartDrawerContext.Provider>
  );
};
