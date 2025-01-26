import { BackgroundBeams } from "@/components/ui/background-beams";

export default function PaymentsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex items-center justify-center min-h-screen">
      {children}
      <BackgroundBeams />
    </main>
  );
}
