import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Separator } from "@/components/ui/separator";
import prisma from "@/utils/prisma"; // Ensure you have this setup correctly
import { notFound } from "next/navigation";
import DownloadButton from "@/components/DownloadButton";
import ClearShoppingCart from "@/components/ClearShoppingCart";
import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default async function Success({ params }: { params: { id: string } }) {

  // Fetch order details from Prisma
  const order = await prisma.order.findUnique({
    where: {
      id: params.id,
      status: "completed",
    },
    select: {
      id: true,
      createdAt: true,
      total: true,
      user: {
        select: {
          email: true,
          name: true,
        },
      },
      beatLicenses: {
        select: {
          id: true,
          price: true,
          beat: {
            select: {
              name: true,
            },
          },
          download: {
            select: {
              id: true,
              url: true,
            },
          },
          licenseOption: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const { user, total, id, beatLicenses } = order;

  return (
    <div className="w-[90%] md:w-[70%] lg:w-[50%] xl:w-[40%] 2xl:w-[50%] rounded-lg shadow-xl border border-text z-50 bg-transparent my-6">
      <ClearShoppingCart />
      <div className="flex flex-col p-8">
        <div className="flex items-center justify-center space-x-4 pb-4">
          <h1 className="text-4xl xl:text-5xl font-bold text-text">
            Order Details
          </h1>
        </div>
        <p className="text-subtext1 mt-2 mb-8 text-center">
          Download your products from below.
        </p>
        <div className="flex flex-row justify-between items-center">
          <p className="text-subtext2 text-xs py-3 font-semibold">Order:</p>
          <p className="text-subtext0 text-xs py-3 font-semibold">{"#" + id}</p>
        </div>
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-4 w-full mb-2 justify-between">
            <p className="text-subtext2 text-xs py-3 font-semibold">Item</p>
            <p className="text-subtext2 text-xs py-3 font-semibold text-center">
              Amount
            </p>
            <p className="text-subtext2 text-xs py-3 font-semibold justify-self-end">
              Product
            </p>
          </div>
          <Separator className="w-full mb-4" />
          {beatLicenses.map((beatLicense: any) => (
            <div
              className="grid grid-cols-3 gap-4 w-full mb-4 justify-between"
              key={beatLicense?.id}
            >
              <div className="flex flex-col items-start">
                <h2 className="text-lg font-medium text-text">
                  {beatLicense?.beat.name}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <p className="text-sm text-subtext2">
                    {beatLicense?.licenseOption?.name}
                  </p>
                </div>
              </div>
              <p className="text-subtext0 self-center text-center">
                {beatLicense?.price}€
              </p>
              <DownloadButton
                item={beatLicense}
                beatName={beatLicense?.beat.name}
              />
            </div>
          ))}
        </div>
        <p className="text-center text-subtext0">Thanks for shopping with us!</p>
      </div>
    </div>
  );
}
