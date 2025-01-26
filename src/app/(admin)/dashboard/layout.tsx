import React from "react";;
import AdminNav from "@/components/AdminNav";

function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <main className="min-h-screen bg-base">
      <AdminNav />
      {children}
    </main>
  );
}

export default AdminLayout;
