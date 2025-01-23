import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "@/components/Footer";
import { Nav } from "@/components/Nav";

import { SpeedInsights } from "@vercel/speed-insights/next"

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
    <html>
      {/* color schemes: latte frappé macchiatio mocha */}
      <body className={`${inter.className}`}>
        <main className="flex flex-col justify-between h-screen w-screen">
          <SpeedInsights />
          <Providers>
            <Nav className="bg-crust top-0 sticky z-50 w-screen sm:px-8" />
            {children}
            <Footer />
          </Providers>
        </main>
      </body>
    </html>
  );
}
