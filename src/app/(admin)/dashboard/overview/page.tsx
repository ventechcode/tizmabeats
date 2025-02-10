import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Suspense } from "react";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardStatsSkeleton } from "@/components/dashboard/dashboard-stats-skeleton";
import { RecentBeats } from "@/components/dashboard/recent-beats";
import { DashboardTableSkeleton } from "@/components/dashboard/dashboard-table-skeleton";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { TopProducers } from "@/components/dashboard/top-producers";
import DashboardHeader from "@/components/dashboard/dashboard-header";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col items-center justify-center max-w-[90%] md:max-w-[75%] lg:max-w-[70%] xl:max-w-[82%] mx-auto">
      <DashboardHeader
        text={`Welcome, ${session?.user?.name?.split(" ")[0]}`}
        subtext="Here's what's happening with your store"
      />
      <DashboardShell className="w-full mt-8 mb-8">
        <DashboardStats />
        <RecentBeats />
        <RecentOrders />
        <TopProducers />
      </DashboardShell>
    </div>
  );
}
