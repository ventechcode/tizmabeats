export default function BeatBundlesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex flex-col justify-center">
      {children}
    </main>
  );
}
