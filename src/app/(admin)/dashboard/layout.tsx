import React from "react";;
import AdminNav from "@/components/AdminNav";

function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <main className="bg-base text-text">
      <AdminNav />
      {children}
    </main>
  );
}

export default AdminLayout;
