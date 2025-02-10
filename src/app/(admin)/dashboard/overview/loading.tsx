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
  return (
    <div className="flex flex-col items-center justify-center max-w-[90%] md:max-w-[75%] lg:max-w-[70%] xl:max-w-[82%] mx-auto">
      <DashboardHeader
        text={"Loading..."}
        subtext=""
      />
      <DashboardShell className="w-full mt-8 mb-8">
      <DashboardStatsSkeleton />
      <DashboardTableSkeleton columns={5} rows={3} className="col-span-4" />
      <DashboardTableSkeleton columns={3} rows={2} className="col-span-3" />
      <DashboardTableSkeleton columns={3} rows={2} className="col-span-1" />
      </DashboardShell>
    </div>
  );
}
