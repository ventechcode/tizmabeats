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
import { Tooltip } from "@/components/ui/tooltip";

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center py-4 pl-10 bg-mantle w-full">
      <div className="flex items-center justify-between lg:justify-start space-x-4 w-2/3 lg:w-auto">
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
            <p className="hidden md:block font-semibold uppercase">Dashboard</p>
          </div>
        </Link>
        <Link
          href="/dashboard/products"
          prefetch={true}
          className={`${
            pathname == "/dashboard/products" ||
            pathname == "/dashboard/products/new"
              ? "border-b-[3px] border-accentColor"
              : "hover:border-subtext0 hover:border-b-2 hover:text-subtext0"
          } h-8`}
        >
          <div className="flex gap-x-2 items-center justify-center">
            <PackageSearch />
            <p className="hidden md:block font-semibold uppercase">Products</p>
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
            <p className="hidden md:block font-semibold uppercase">Customers</p>
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
            <p className="hidden md:block font-semibold uppercase">Orders</p>
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
            <p className="hidden md:block font-semibold uppercase">Settings</p>
          </div>
        </Link>
      </div>

      {/* Add ml-auto directly to push the logout icon */}
      <div className="ml-auto flex items-center gap-x-12">
        <Tooltip content="Logout" side="left" showArrow={false} className="hidden sm:block bg-surface2 text-subtext1">
          <TbLogout
            className="scale-125 md:scale-150 text-2xl cursor-pointer mr-6 hover:text-accentColor duration-300 tooltip:logout"
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          />
        </Tooltip>
      </div>
    </nav>
  );
}
