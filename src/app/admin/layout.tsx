"use client"

import { TabNavigation, TabNavigationLink } from "@/components/ui/tremor-tab-nagivation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname  = usePathname();

  return (
    <main className="absolute top-24 flex flex-col items-center">
      <TabNavigation>
        <TabNavigationLink active={pathname === "/admin"}><Link href="/admin">Dashboard</Link></TabNavigationLink>
        <TabNavigationLink active={pathname === "/admin/products"}><Link href="/admin/products">Products</Link></TabNavigationLink>
        <TabNavigationLink active={pathname === "/admin/new-product"}><Link href="/admin/new-product">New Product</Link></TabNavigationLink>
        <TabNavigationLink active={pathname === "/admin/customers"}><Link href="/admin/customers">Customers</Link></TabNavigationLink>
        <TabNavigationLink active={pathname === "/admin/settings"}><Link href="/admin/settings">Settings</Link></TabNavigationLink>
      </TabNavigation>
      {children}
    </main>
  );
}

export default AdminLayout;
