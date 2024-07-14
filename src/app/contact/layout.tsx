import React from "react";

function ContactLayout({
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

export default ContactLayout;
