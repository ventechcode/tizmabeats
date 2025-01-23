import dynamic from "next/dynamic";
import prisma from "@/utils/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
      <h1 className="text-2xl font-bold my-6 uppercase z-50 relative -top-12">Create new product</h1>
      <div className="w-1/4 h-28 text-center bg-mantle rounded-b-full absolute top-28"></div>
      <Link prefetch href="/dashboard/products" className="self-start lg:ml-80 mb-4">
        <ArrowLeft className="w-8 h-8 cursor-pointer" />
      </Link>
      <NewProductForm licenseOptions={licenses} />
    </div>
  );
}