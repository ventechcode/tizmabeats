
import ProductTable from "@/components/ProductTable";
import { getProducts } from "@/app/actions";

export default async function ProductsPage() {
  const products = await getProducts(); 
  return (
    <div className="container mx-auto mt-12 ">
      <ProductTable />
    </div>
  );
}
