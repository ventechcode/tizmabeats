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
        <main className="h-screen flex flex-col items-center justify-center ">
          <ShoppingCartProvider>
            <Nav>
              <NavLink href="/beats">Beats</NavLink>
              <NavLink href="/beat-bundles">Beat-Bundles</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </Nav>
            {children}
          </ShoppingCartProvider>
          <footer className="absolute bottom-0 z-40 flex flex-row items-center justify-around text-text w-full p-4 bg-mantle">
            <p>Copyright &copy; 2025 TIZMABEATS</p>
            <p>Privacy Policy</p>
            <p>Terms of Service</p>
            <p>Legal</p>
          </footer>
        </main>
      </body>
    </html>
  );
}
