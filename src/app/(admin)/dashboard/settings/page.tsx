"use client";

import DashboardHeader from "@/components/dashboard/dashboard-header";

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center max-w-[90%] md:max-w-[75%] lg:max-w-[70%] xl:max-w-[82%] mx-auto h-max">
      <DashboardHeader text="Settings" subtext="Manage your settings" />
    </div>
  );
}
