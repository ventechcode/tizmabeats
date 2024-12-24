import React, { Suspense } from "react";
import { Nav, NavLink, NavLogo } from "@/components/Nav";
import { WavyBackground } from "@/components/ui/wavy-background";
import DotBackground from "@/components/ui/dot-background";
import Beats from "./page";
import AudioPlayer from "@/components/AudioPlayer";

function BeatsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="overflow-hidden">
      <Beats />
    </main>
  );
}

export default BeatsLayout;
