import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav, NavLink } from "@/components/Nav";
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
      {/* color schemes: latte frappé macchiatio mocha */}
      <body className={`${inter.className} mocha text-text bg-base h-screen`}>
        <main>
          <ShoppingCartProvider>
            {children}
          </ShoppingCartProvider>
        </main>
      </body>
    </html>
  );
}
