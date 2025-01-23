import { getCustomers } from "@/app/actions";
import CustomerTable from "@/components/CustomerTable";
import DashboardHeader from "@/components/dashboard/dashboard-header";

export default async function CustomersPage() {
  const customers = await getCustomers();
  return (
    <div className="flex flex-col items-center">
      <DashboardHeader text="Customers" subtext="Manage your customers" />
      <CustomerTable customers={customers} />
    </div>
  );
}
