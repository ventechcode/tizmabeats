import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav, NavLink, NavLogo, NavShoppingCart } from "@/components/Nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tizmabeats",
  description: "Buy beats online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} mocha bg-base`}>
        <Nav>
          <NavLogo imgSrc="/logo.svg" alt="Tizmabeats" />
          <NavLink href="/beats">Beats</NavLink>
          <NavLink href="/beat-bundles">Beat-Bundles</NavLink>
          <NavLink href="/contact">Kontakt</NavLink>
          <NavShoppingCart count={3} />
        </Nav>
        {children}
        </body>
    </html>
  );
}