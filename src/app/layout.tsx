import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav, NavLink, NavLogo, NavShoppingCart } from "@/components/Nav";
import { WavyBackground } from "@/components/ui/wavy-background";

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
          <Nav>
            <NavLogo imgSrc="/logo.svg" alt="Tizmabeats" />
            <NavLink href="/beats">Beats</NavLink>
            <NavLink href="/beat-bundles">Beat-Bundles</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <NavShoppingCart count={3} />
          </Nav>
          {children}
          <footer className="relative text-center text-text w-full p-4">
            <p>&copy; 2024 Tizmabeats</p>
          </footer>
        </main>
      </body>
    </html>
  );
}
