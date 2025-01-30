import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Nav } from "@/components/Nav";
import { SpeedInsights } from "@vercel/speed-insights/next";
import MyFooter from "@/components/MyFooter";
import AudioPlayerWrapper from "@/components/AudioPlayerWrapper";
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
      <head>
        <link rel="preload" href="/api/beats" as="fetch"></link>
      </head>
      <body className={`${inter.className} bg-base text-text`}>
        <SpeedInsights />
        <Providers>
          <main className="flex flex-col justify-between min-h-screen">
            <Nav className="z-50 bg-crust w-full relative" />
            <div className="flex-1 pb-16">{children}</div>
            <MyFooter />
          </main>
          <AudioPlayerWrapper />
        </Providers>
      </body>
    </html>
  );
}
