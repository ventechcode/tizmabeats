export default async function BeatsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="h-screen">
      {children}
    </main>
  );
}
