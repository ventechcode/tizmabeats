import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "@/components/MyFooter";
import { Nav } from "@/components/Nav";
import { SpeedInsights } from "@vercel/speed-insights/next";
import MyFooter from "@/components/MyFooter";
import AudioPlayer from "@/components/AudioPlayer";
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
        <main className="flex flex-col justify-between">
          <SpeedInsights />
          <Providers>
            <Nav className="z-50 bg-crust relative w-full" />
            <div className="flex-grow h-screen">{children}</div>
            <AudioPlayerWrapper />
            <MyFooter />
          </Providers>
        </main>
      </body>
    </html>
  );
}
