"use client";
import React, { createContext, useContext, useState } from 'react';
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Add item to cart (if exists, update quantity)
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.slug === product.slug);
      if (idx > -1) {
        // Update quantity
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [...prev, { ...product, quantity }];
    });
  };

  // Remove item
  const removeFromCart = slug => {
    setCart(prev => prev.filter(item => item.slug !== slug));
  };

  // Clear cart
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
