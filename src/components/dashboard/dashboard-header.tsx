"use client"

import { useSession } from "next-auth/react";

export default function DashboardHeader() {
    const { data: session } = useSession();

  return (
    <div className="w-1/4 h-28 text-center bg-mantle rounded-b-full absolute top-28">
      <h1 className="text-2xl font-bold mt-6 uppercase">
        Welcome, {session?.user?.name?.split(" ")[0]}!
      </h1>
      <p className="text-sm text-subtext0 mt-1">
        Overview, manage, and track your business here.
      </p>
    </div>
  );
}
