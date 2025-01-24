import { getCustomers } from "@/app/actions";
import CustomerTable from "@/components/CustomerTable";
import DashboardHeader from "@/components/dashboard/dashboard-header";

export default async function CustomersPage() {
  const customers = await getCustomers();
  return (
    <div className="flex flex-col items-center justify-center max-w-[90%] md:max-w-[75%] lg:max-w-[70%] xl:max-w-[82%] mx-auto h-max">
      <DashboardHeader text="Customers" subtext="Manage your customers" />
      <CustomerTable customers={customers} />
    </div>
  );
}
