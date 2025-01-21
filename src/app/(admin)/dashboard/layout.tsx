"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { TbLogout } from "react-icons/tb";
import { SessionProvider, signOut } from "next-auth/react";
import { Nav, NavLink } from "@/components/Nav";

function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <main className="max-h-screen">
      <Nav className="bg-crust top-0 sticky z-50 w-screen sm:px-8">
        <NavLink href="/beats">Beats</NavLink>
        <NavLink href="/beat-bundles">Beat-Bundles</NavLink>
        <NavLink href="/contact">Contact</NavLink>
      </Nav>
      <nav className="flex items-center py-4 pl-10 bg-mantle w-full">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className={`${
              pathname == "/dashboard"
                ? "border-b-2 border-accentColor"
                : "hover:border-subtext0 hover:border-b-2"
            } h-8`}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/products"
            className={`${
              pathname == "/dashboard/products"
                ? "border-b-2 border-accentColor"
                : "hover:border-subtext0 hover:border-b-2"
            } h-8`}
          >
            Products
          </Link>
          <Link
            href="/dashboard/customers"
            className={`${
              pathname == "/dashboard/customers"
                ? "border-b-2 border-accentColor"
                : "hover:border-subtext0 hover:border-b-2"
            } h-8`}
          >
            Customers
          </Link>
          <Link
            href="/dashboard/new-product"
            className={`${
              pathname == "/dashboard/new-product"
                ? "border-b-2 border-accentColor"
                : "hover:border-subtext0 hover:border-b-2"
            } h-8`}
          >
            New Product
          </Link>
          <Link
            href="/dashboard/settings"
            className={`${
              pathname == "/dashboard/settings"
                ? "border-b-2 border-accentColor"
                : "hover:border-subtext0 hover:border-b-2"
            } h-8`}
          >
            Settings
          </Link>
        </div>

        {/* Add ml-auto directly to push the logout icon */}
        <div className="ml-auto">
          <TbLogout
            className="scale-150 text-xl cursor-pointer mr-6 hover:text-accentColor duration-300 tooltip:logout"
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          />
        </div>
      </nav>

      <SessionProvider>{children}</SessionProvider>
    </main>
  );
}

export default AdminLayout;
