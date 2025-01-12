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
      <body className={`${inter.className} mocha text-text bg-base`}>
        <main>
          <ShoppingCartProvider>
            <Nav>
              <NavLink href="/beats">Beats</NavLink>
              <NavLink href="/beat-bundles">Beat-Bundles</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </Nav>
            {children}
          </ShoppingCartProvider>
        </main>
      </body>
    </html>
  );
}
