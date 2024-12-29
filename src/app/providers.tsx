"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface ShoppingCartContextType {
  cart: any[];
  addToCart: (item: any) => void;
  removeFromCart: (id: any) => void;
}

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export function ShoppingCartProvider({ children }: any) {
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (item: any) => setCart((prev) => [...prev, item]);
  const removeFromCart = (id: any) =>
    setCart((prev) => prev.filter((item) => item.id != id));

  return (
    <ShoppingCartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </ShoppingCartContext.Provider>
  );
}

export { ShoppingCartContext };
