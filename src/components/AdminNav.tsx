"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TbLogout } from "react-icons/tb";
import {
  Users,
  LayoutDashboard,
  PackageSearch,
  TableProperties,
  Settings,
} from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center py-4 pl-10 bg-mantle w-full">
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard"
          className={`${
            pathname == "/dashboard"
              ? "border-b-[3px] border-accentColor"
              : "hover:border-subtext0 hover:border-b-2 hover:text-subtext0"
          } h-8`}
        >
          <div className="flex gap-x-2 items-center justify-center">
            <LayoutDashboard />
            <p className="font-semibold uppercase">Dashboard</p>
          </div>
        </Link>
        <Link
          href="/dashboard/products"
          prefetch={true}
          className={`${
            pathname == "/dashboard/products" || pathname == "/dashboard/products/new"
              ? "border-b-[3px] border-accentColor"
              : "hover:border-subtext0 hover:border-b-2 hover:text-subtext0"
          } h-8`}
        >
          <div className="flex gap-x-2 items-center justify-center">
            <PackageSearch />
            <p className="font-semibold uppercase">Products</p>
          </div>
        </Link>
        <Link
          href="/dashboard/customers"
          className={`${
            pathname == "/dashboard/customers"
              ? "border-b-[3px] border-accentColor"
              : "hover:border-subtext0 hover:border-b-2 hover:text-subtext0"
          } h-8`}
        >
          <div className="flex gap-x-2 items-center justify-center">
            <Users />
            <p className="font-semibold uppercase">Customers</p>
          </div>
        </Link>
        <Link
          href="/dashboard/orders"
          className={`${
            pathname == "/dashboard/orders"
              ? "border-b-[3px] border-accentColor"
              : "hover:border-subtext0 hover:border-b-2 hover:text-subtext0"
          } h-8`}
        >
          <div className="flex gap-x-2 items-center justify-center">
            <TableProperties />
            <p className="font-semibold uppercase">Orders</p>
          </div>
        </Link>
        <Link
          href="/dashboard/settings"
          className={`${
            pathname == "/dashboard/settings"
              ? "border-b-[3px] border-accentColor"
              : "hover:border-subtext0 hover:border-b-2 hover:text-subtext0"
          } h-8`}
        >
          <div className="flex gap-x-2 items-center justify-center">
            <Settings />
            <p className="font-semibold uppercase">Settings</p>
          </div>
        </Link>
      </div>

      {/* Add ml-auto directly to push the logout icon */}
      <div className="ml-auto flex items-center gap-x-12">
        <TbLogout
          className="scale-150 text-2xl cursor-pointer mr-6 hover:text-accentColor duration-300 tooltip:logout"
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        />
      </div>
    </nav>
  );
}
