import ProductTable from "@/components/ProductTable";
import { getProducts } from "@/app/actions";
import { Suspense } from "react";
import DashboardHeader from "@/components/dashboard/dashboard-header";

export default async function ProductsPage() {
  let products = await getProducts();
  return (
    <div className="flex flex-col items-center justify-center max-w-[90%] md:max-w-[75%] lg:max-w-[70%] xl:max-w-[82%] mx-auto h-max">
      <DashboardHeader text="Products" subtext="Manage your products" />
      <ProductTable products={products} />
    </div>
  );
}
