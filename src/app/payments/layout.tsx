export default function PaymentsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex items-center justify-center min-h-screen">
      {children}
      {/* <BackgroundBeams /> has caused 100% cpu usage at least in dev */} 
    </main>
  );
}
