import { BackgroundBeams } from "@/components/ui/background-beams";

export default function PaymentsLayout({
    children,
  }: Readonly<{ children: React.ReactNode }>) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center">
        {children}
        <BackgroundBeams />
      </main>
    );
  }
  