"use client";

import { useSession } from "next-auth/react";
import Loading from "@/app/loading";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Suspense } from "react";
import { CardSkeleton } from "@/components/dashboard/card-skeleton";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentBeats } from "@/components/dashboard/recent-beats";
import { RecentOrders } from "@/components/dashboard/recent-order";
import { TopProducers } from "@/components/dashboard/top-producers";
import DashboardHeader from "@/components/dashboard/dashboard-header";

export default function Dashboard() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center">
      <DashboardHeader
        text={`Welcome, ${session?.user?.name?.split(" ")[0]}`}
        subtext="Here's what's happening with your store today"
      />
    </div>
  );
}
