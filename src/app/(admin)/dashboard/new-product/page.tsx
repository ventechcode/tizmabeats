import dynamic from "next/dynamic";
import prisma from "@/utils/prisma";

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
      <div className="w-1/3 text-center bg-mantle rounded-b-full mb-12">
        <h1 className="text-2xl font-bold my-6 uppercase">Create a new Beat</h1>
      </div>
      <NewProductForm licenseOptions={licenses} />
    </div>
  );
}