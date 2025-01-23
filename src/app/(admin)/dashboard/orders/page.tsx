import DashboardHeader from "@/components/dashboard/dashboard-header";

export default function OrdersPage() {
  return (
    <div className="flex flex-col items-center">
      <DashboardHeader text="Orders" subtext="Manage your orders" />
    </div>
  );
}
