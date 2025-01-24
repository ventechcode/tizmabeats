export default function BeatBundlesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="h-screen">
      {children}
    </main>
  );
}
