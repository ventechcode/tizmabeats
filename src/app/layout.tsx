import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav, NavLink, NavLogo } from "@/components/Nav";
import { WavyBackground } from "@/components/ui/wavy-background";
import { ShoppingCart } from "lucide-react";
import { ShoppingCartProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tizmabeats",
  description: "Buy quality beats online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} mocha text-text bg-base`}>
        <main className="h-screen flex flex-col items-center justify-between">
          <ShoppingCartProvider>
            <Nav>
              <NavLink href="/beats">Beats</NavLink>
              <NavLink href="/beat-bundles">Beat-Bundles</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </Nav>
            {children}
          </ShoppingCartProvider>
          <footer className="relative bottom-0 z-40 text-center text-text w-full p-4">
            <p>&copy; 2024 Tizmabeats</p>
          </footer>
        </main>
      </body>
    </html>
  );
}
