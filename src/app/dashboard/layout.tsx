"use client"

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { Session } from "inspector";
import { SessionProvider } from "next-auth/react";

function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <main className="max-h-screen">
      <nav className="flex space-x-4 py-4 pl-10 bg-mantle">
        <Link href="/dashboard" className={`${pathname == "/dashboard" ? "border-b-2 border-accentColor" : "hover:border-subtext0 hover:border-b-2"} h-8`}>Dashboard</Link>
        <Link href="/dashboard/products" className={`${pathname == "/dashboard/products" ? "border-b-2 border-accentColor" : "hover:border-subtext0 hover:border-b-2"} h-8`}>Products</Link>
        <Link href="/dashboard/customers" className={`${pathname == "/dashboard/customers" ? "border-b-2 border-accentColor" : "hover:border-subtext0 hover:border-b-2"} h-8`}>Customers</Link>
        <Link href="/dashboard/new-product" className={`${pathname == "/dashboard/new-product" ? "border-b-2 border-accentColor" : "hover:border-subtext0 hover:border-b-2"} h-8`}>New Product</Link>
        <Link href="/dashboard/settings" className={`${pathname == "/dashboard/settings" ? "border-b-2 border-accentColor" : "hover:border-subtext0 hover:border-b-2"} h-8`}>Settings</Link>
      </nav>
      <SessionProvider>{children}</SessionProvider>
    </main>
  );
}

export default AdminLayout;
