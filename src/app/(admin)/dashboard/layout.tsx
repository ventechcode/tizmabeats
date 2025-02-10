import React from "react";;
import AdminNav from "@/components/dashboard/AdminNav";

function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <main>
      <AdminNav />
      {children}
    </main>
  );
}

export default AdminLayout;
