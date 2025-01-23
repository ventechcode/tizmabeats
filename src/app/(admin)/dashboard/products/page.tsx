import ProductTable from "@/components/ProductTable";
import { getProducts } from "@/app/actions";
import { Suspense } from "react";

export default async function ProductsPage() {
  let products = await getProducts();
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold my-6 uppercase z-50 relative -top-12">MANAGE products</h1>
      <div className="w-1/4 h-28 text-center bg-mantle rounded-b-full absolute top-28"></div>
      <div className="container mx-auto">
        <Suspense>
          <ProductTable products={products} />
        </Suspense>
      </div>
    </div>
  );
}
