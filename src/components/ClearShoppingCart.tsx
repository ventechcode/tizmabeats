"use client";

import { useEffect } from "react";
import { ShoppingCartContext } from "@/app/providers";
import { useContext } from "react";

// This component clears the shopping cart when the order is completed
export default function ClearShoppingCart() {
  const shoppingCart = useContext(ShoppingCartContext);

  useEffect(() => {
    if (shoppingCart) {
      shoppingCart.clear();
    }
  }, []); // Only runs when these values change

  return null; // This component doesn't render anything
}
