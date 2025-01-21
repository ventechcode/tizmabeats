import { Nav, NavLink } from "@/components/Nav";

export default function ContactLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex flex-col justify-center">
      <Nav className="bg-crust top-0 sticky z-50 w-screen sm:px-8">
        <NavLink href="/beats">Beats</NavLink>
        <NavLink href="/beat-bundles">Beat-Bundles</NavLink>
        <NavLink href="/contact">Contact</NavLink>
      </Nav>
      {children}
    </main>
  );
}