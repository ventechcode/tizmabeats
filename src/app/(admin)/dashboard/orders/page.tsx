import { getOrders } from "@/app/actions";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import OrderTable from "@/components/OrderTable";

export const dynamic = 'force-dynamic'
export const revalidate = 0;

export default async function OrdersPage() {
  const orders = await getOrders();
  return (
    <div className="flex flex-col items-center justify-center max-w-[90%] md:max-w-[75%] lg:max-w-[70%] xl:max-w-[82%] mx-auto h-max">
      <DashboardHeader text="Orders" subtext="Manage your orders" />
      <OrderTable orders={orders} />
    </div>
  );
}
