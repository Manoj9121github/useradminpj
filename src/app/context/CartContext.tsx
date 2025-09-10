"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  image?: string;
}

interface CartItem extends Product {
  selectedQty: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, qty: number) => {
    if (qty < 1 || qty > product.quantity) return;
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(prev =>
        prev.map(item =>
          item.id === product.id
            ? { ...item, selectedQty: item.selectedQty + qty }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, selectedQty: qty }]);
    }
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
