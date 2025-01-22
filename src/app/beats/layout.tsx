import { Nav, NavLink } from "@/components/Nav";

export default function BeatsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
      {children}
    </main>
  );
}
