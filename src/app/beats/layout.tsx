import React, { Suspense } from "react";
import { Nav, NavLink, NavLogo, NavShoppingCart } from "@/components/navbar";
import { WavyBackground } from "@/components/ui/wavy-background";
import DotBackground from "@/components/ui/dot-background";
import Loading from "./loading";
import Beats from "./page";

function BeatsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className="flex flex-col items-center justify-center">
        <Suspense fallback={<Loading />}>
          <Beats />
        </Suspense>
      </div>
    </main>
  );
}

export default BeatsLayout;
