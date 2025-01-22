import ProductTable from "@/components/ProductTable";
import { getProducts } from "@/app/actions";
import { Suspense } from "react";

export default async function ProductsPage() {
  let products = await getProducts();
  return (
    <div className="flex flex-col items-center">
      <div className="w-1/3 text-center bg-mantle rounded-b-full mb-12">
        <h1 className="text-2xl font-bold my-6 uppercase">Product Stock</h1>
      </div>
      <div className="container mx-auto">
        <Suspense>
          <ProductTable products={products} />
        </Suspense>
      </div>
    </div>
  );
}
