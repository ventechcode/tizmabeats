import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav, NavLink, NavLogo, NavShoppingCart } from "@/components/navbar";
import { WavyBackground } from "@/components/ui/wavy-background";
import DotBackground from "@/components/ui/dot-background";

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
      <body
        className={`${inter.className} mocha text-text bg-base`}
      >
        {children}
      </body>
    </html>
  );
}