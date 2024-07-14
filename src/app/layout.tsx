import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav, NavLink, NavLogo, NavShoppingCart } from "@/components/navbar";

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
        <main className="flex flex-col justify-between items-center">
          <Nav>
            <NavLogo imgSrc="/logo.svg" alt="Tizmabeats" />
            <NavLink href="/beats">Beats</NavLink>
            <NavLink href="/beat-bundles">Beat-Bundles</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <NavShoppingCart count={3} />
          </Nav>
          {children}
          <footer className="relative z-50 text-text text-center w-full p-4">
            <p>&copy; 2024 Tizmabeats</p>
          </footer>
        </main>
      </body>
    </html>
  );
}
