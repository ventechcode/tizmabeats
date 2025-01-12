"use client"

import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <main className="h-screen">
      <nav className="flex space-x-4 my-6 ml-10">
        <Link href="/admin" className={`${pathname == "/admin" ? "border-b-2 border-accentColor" : "hover:border-subtext0 hover:border-b-2"} h-8`}>Dashboard</Link>
        <Link href="/admin/products" className={`${pathname == "/admin/products" ? "border-b-2 border-accentColor" : "hover:border-subtext0 hover:border-b-2"} h-8`}>Products</Link>
        <Link href="/admin/customers" className={`${pathname == "/admin/customers" ? "border-b-2 border-accentColor" : "hover:border-subtext0 hover:border-b-2"} h-8`}>Customers</Link>
        <Link href="/admin/new-product" className={`${pathname == "/admin/new-product" ? "border-b-2 border-accentColor" : "hover:border-subtext0 hover:border-b-2"} h-8`}>New Product</Link>
        <Link href="/admin/settings" className={`${pathname == "/admin/settings" ? "border-b-2 border-accentColor" : "hover:border-subtext0 hover:border-b-2"} h-8`}>Settings</Link>
      </nav>
      {children}
    </main>
  );
}

export default AdminLayout;
