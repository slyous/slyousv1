import React, { createContext, useContext, useState, useEffect } from 'react';

import { Diamond, CartItem } from '@/src/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (diamond: Diamond) => void;
  removeFromCart: (diamondId: string) => void;
  updateQuantity: (diamondId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('veloura-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('veloura-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (diamond: Diamond) => {
    setCart(prev => {
      const existing = prev.find(item => item.diamond.id === diamond.id);
      if (existing) {
        return prev.map(item => 
          item.diamond.id === diamond.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { diamond, quantity: 1 }];
    });
  };

  const removeFromCart = (diamondId: string) => {
    setCart(prev => prev.filter(item => item.diamond.id !== diamondId));
  };

  const updateQuantity = (diamondId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => 
      item.diamond.id === diamondId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((acc, item) => acc + (item.diamond.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
