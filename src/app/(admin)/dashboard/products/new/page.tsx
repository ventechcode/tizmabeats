import dynamic from "next/dynamic";
import prisma from "@/utils/prisma";
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
    <div className="flex flex-col items-center justify-center max-w-[90%] md:max-w-[75%] lg:max-w-[70%] xl:max-w-[82%] mx-auto h-max ">
      <DashboardHeader text="New Product" subtext="Add a new product" />
      <NewProductForm licenseOptions={licenses} />
    </div>
  );
}