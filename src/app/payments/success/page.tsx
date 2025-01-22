"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ShoppingCartContext } from "@/app/providers";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Separator } from "@/components/ui/separator";
import { set } from "zod";

export default function Success() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session_id = searchParams.get("session_id");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const shoppingCart = useContext(ShoppingCartContext);
  const [order_id, setOrder_id] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        "/api/checkout_sessions?session_id=" + session_id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      setCustomerEmail(data.customerEmail);
      setCustomerName(data.customerName);
      setItems(await JSON.parse(data.products));
      setOrder_id(data.order_id);

      if (data.session.payment_status == "paid") shoppingCart!.clear();
    };

    fetchData().then(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        {loading ? (
          <div className="loading loading-spinner loading-lg mt-2"></div>
        ) : (
          <div className="bg-mantle shadow-md rounded-lg p-6 max-w-lg w-full text-center">
            <div className="flex items-center justify-center space-x-4">
              <IoMdCheckmarkCircleOutline className="text-3xl scale-150 text-mocha-green" />
              <h1 className="text-3xl font-bold text-mocha-green">
                Payment Successful
              </h1>
            </div>
            <p className="text-subtext1 mt-2 mb-8">
              Thanks for your purchase, {customerName}!
            </p>
            <div className="flex flex-row justify-between items-center">
              <p className="text-subtext2 text-xs py-3 font-semibold">Order:</p>
              <p className="text-subtext0 text-xs py-3 font-semibold">
                {"#" + order_id}
              </p>
            </div>
            <div className="mb-8">
              {items.map((item: any) => (
                <div className="flex flex-col w-full" key={item.id}>
                  <Separator className="w-full" />
                  <div className="flex flex-row items-center">
                    <div className="border-text py-4 flex flex-col items-start w-2/3">
                      <h2 className="text-lg font-medium text-text">
                        {item.beat.name}
                      </h2>
                      <div className="flex flex-row items-center">
                        <p className="text-sm text-subtext2">
                          {item.licenseOption.name}
                        </p>
                        <p className=" ml-1 mt-0.5 text-xs text-subtext0">
                          ({item.licenseOption.contents.join(", ")})
                        </p>
                      </div>
                    </div>
                    <p className="text-subtext0">{item.price}€</p>
                    <button
                      className="text-xs text-blue hover:underline ml-8"
                      onClick={async () => {
                        const res = await fetch(
                          `/api/download?id=${item.download.id}`
                        );
                        const blob = await res.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${item.beat.name}-${item.licenseOption.name}`; // Adjust filename and extension as needed
                        a.click();
                        window.URL.revokeObjectURL(url);
                      }}
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs">
              Order confirmation has been sent to{" "}
              <a className="text-blue hover:underline hover:cursor-pointer">
                {customerEmail}
              </a>{" "}
            </p>

            <button
              className="mt-4 px-4 py-2 bg-text text-crust rounded-md shadow hover:bg-crust hover:text-text duration-300"
              onClick={() => router.push("/beats")}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
