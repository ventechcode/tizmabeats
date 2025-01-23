"use client"

import React from "react";;
import { SessionProvider } from "next-auth/react";
import AdminNav from "@/components/AdminNav";

function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <main className="min-h-screen bg-base">
      <SessionProvider>
        <AdminNav />
        {children}
      </SessionProvider>
    </main>
  );
}

export default AdminLayout;
