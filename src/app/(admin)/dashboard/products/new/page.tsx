import dynamic from "next/dynamic";
import prisma from "@/utils/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DashboardHeader from "@/components/dashboard/dashboard-header";

const NewProductForm = dynamic(() => import("./NewProductForm"), {
  ssr: false,
});

const getLicenseOptions = async () => {
  "use server";
  const licenses = await prisma.licenseOption.findMany();
  return licenses;
};

export default async function NewProductPage() {
  const licenses = await getLicenseOptions();
  return (
    <div className="flex flex-col items-center">
      <DashboardHeader text="New Product" subtext="Add a new product" />
      <Link prefetch href="/dashboard/products" className="self-start lg:ml-80 mb-4">
        <ArrowLeft className="w-8 h-8 cursor-pointer" />
      </Link>
      <NewProductForm licenseOptions={licenses} />
    </div>
  );
}