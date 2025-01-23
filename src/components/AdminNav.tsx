"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TbLogout } from "react-icons/tb";
import {
  Users,
  LayoutDashboard,
  PackageSearch,
  TableProperties,
  Settings,
  CircleUser,
} from "lucide-react";

export default async function AdminNav() {
  const pathname = usePathname();
  const session = useSession();

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
        <div className="flex flex-row items-center justify-center gap-x-2">
          <div className="mt-1">
            <CircleUser size={44} />
          </div>
          <div className="flex flex-col items-start justify-center">
            <h1 className="text-lg font-semibold">
              {session.data?.user?.name}
            </h1>
            <p className="text-xs text-subtext0">{session.data?.user?.email}</p>
          </div>
        </div>
        <TbLogout
          className="scale-150 text-2xl cursor-pointer mr-6 hover:text-accentColor duration-300 tooltip:logout"
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        />
      </div>
    </nav>
  );
}
