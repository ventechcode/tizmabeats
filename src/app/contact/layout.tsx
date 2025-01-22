import { Nav, NavLink } from "@/components/Nav";

export default function ContactLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex flex-col justify-center">
      {children}
    </main>
  );
}