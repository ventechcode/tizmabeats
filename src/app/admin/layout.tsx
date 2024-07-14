import React from "react";

function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col justify-between items-center max-h-screen">
      {children}
    </main>
  );
}

export default AdminLayout;
