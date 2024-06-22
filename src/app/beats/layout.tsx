import React from "react";
import { Nav, NavLink, NavLogo, NavShoppingCart } from "@/components/Nav";
import { WavyBackground } from "@/components/ui/WavyBackground";
import DotBackground from "@/components/ui/DotBackground";

function BeatsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col justify-between items-center min-h-screen">
      <Nav>
        <NavLogo imgSrc="/logo.svg" alt="Tizmabeats" />
        <NavLink href="/beats">Beats</NavLink>
        <NavLink href="/beat-bundles">Beat-Bundles</NavLink>
        <NavLink href="/contact">Kontakt</NavLink>
        <NavShoppingCart count={3} />
      </Nav>
      <div>
        {children}
      </div>
      <footer className="text-text text-center w-full p-4">
        <p>&copy; 2024 Tizmabeats</p>
      </footer>
    </main>
  );
}

export default BeatsLayout;
