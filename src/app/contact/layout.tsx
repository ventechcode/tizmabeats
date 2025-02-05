export default function BeatBundlesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      {children}
    </main>
  );
}
