"use client";

import { Beat } from "@/types";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider, useTheme } from "next-themes";
import { createContext, useState, useEffect } from "react";
import { AudioPlayerProvider } from "@/hooks/useAudioPlayer";

interface ShoppingCartContextType {
  cart: any[];
  addToCart: (item: any) => void;
  removeFromCart: (id: any) => void;
  contains: (id: any) => boolean;
  clear: () => void;
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
          cart.map((item: any) => ({
            id: item.id,
            name: item.name,
            license: item.license,
            price: item.price,
            quantity: 1,
          }))
        )
      );
    }
  }, [cart, initialized]);


  const addToCart = (item: any) =>
    setCart((prev) => {
      console.log(item);
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev;
      }
      return [...prev, item];
    });

  const contains = (beat: Beat) =>
    cart.some((item) =>
      beat.licenses.some((license) => license.id === item.id)
    );

  const removeFromCart = (beat: any) => {
    if (typeof beat === "string") {
      return setCart((prev) => prev.filter((item) => item.id !== beat));
    }
    return setCart((prev) =>
      prev.filter(
        (item) => !beat.licenses.some((license: any) => license.id === item.id)
      )
    );
  };

  const clear = () => setCart([]);

  return (
    <ShoppingCartContext.Provider
      value={{ cart, addToCart, removeFromCart, contains, clear }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}

export { ShoppingCartContext };

function InitialThemeSetter() {
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    // Ensure correct theme mapping on first load
    if (resolvedTheme === "light") {
      setTheme("latte");
    } else if (resolvedTheme === "dark") {
      setTheme("mocha");
    }

    // Listener for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "mocha" : "latte");
      console.log("System theme changed to:", e.matches ? "mocha" : "latte");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [resolvedTheme, setTheme]);

  return null;
}

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        enableSystem={true}
        defaultTheme="system"
        storageKey="theme"
        themes={["mocha", "latte"]}
      >
        <InitialThemeSetter />
        <ShoppingCartProvider>
          <AudioPlayerProvider>{children}</AudioPlayerProvider>
        </ShoppingCartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

export { Providers };
