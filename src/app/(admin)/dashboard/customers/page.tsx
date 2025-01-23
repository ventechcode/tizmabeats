import { getCustomers } from "@/app/actions";
import CustomerTable from "@/components/CustomerTable";

export default async function CustomersPage() {
  const customers = await getCustomers();
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold my-6 uppercase z-50 relative -top-12">View Customers</h1>
      <div className="w-1/4 h-28 text-center bg-mantle rounded-b-full absolute top-28"></div>
      <div className="container mx-auto max-w-screen">
        <CustomerTable customers={customers} />
      </div>
    </div>
  );
}
