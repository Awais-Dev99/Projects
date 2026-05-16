"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";

// 1. Define strict types for better development experience
interface CartItem {
  _id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from LocalStorage once on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from storage", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to LocalStorage whenever cart changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  // Add to cart logic
  const addToCart = (product: any) => {
  setCart((prev) => {
    const existing = prev.find((item) => item._id === product._id);
    if (existing) {
      // Correctly increments by only 1
      return prev.map((item) =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
    }
    // Adds the first piece
    return [...prev, { ...product, quantity: 1 }];
  });
};

  // NEW: Update quantity for the +/- buttons in the cart view
  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item._id === productId) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
    setTimeout(() => toast.error("Removed from cart"), 0);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // Memoize values for performance
  const value = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }), [cart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};