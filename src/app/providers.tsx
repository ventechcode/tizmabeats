"use client";

import {
  createContext,
  useState,
  useEffect,
} from "react";

interface ShoppingCartContextType {
  cart: any[];
  addToCart: (item: any) => void;
  removeFromCart: (id: any) => void;
  contains: (id: any) => boolean;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(
  undefined
);

export function ShoppingCartProvider({ children }: any) {
  const [cart, setCart] = useState<any[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart)); 
      }
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && initialized) {
      localStorage.setItem(
        "cart",
        JSON.stringify(
          cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
          }))
        )
      );
    }
  }, [cart]);

  const addToCart = (item: any) =>
    setCart((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev;
      }
      return [...prev, item];
    });

  const contains = (id: any) => cart.some((item) => item.id === id);

  const removeFromCart = (id: any) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  return (
    <ShoppingCartContext.Provider value={{ cart, addToCart, removeFromCart, contains }}>
      {children}
    </ShoppingCartContext.Provider>
  );
}

export { ShoppingCartContext };
