"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ShoppingCartContext } from "@/app/providers";

export default function Success() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session_id = searchParams.get("session_id");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState<
    { id: string; name: string; price: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const shoppingCart = useContext(ShoppingCartContext);

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
      setCustomerEmail(data.session.customer_details.email);
      setCustomerName(data.session.customer_details.name.split(" ")[0]);
      setItems(data.items);

      if (data.session.payment_status === "paid") {
        data.items.forEach((item: any) => {
          shoppingCart?.removeFromCart(item.id);
        });
      }
    };

    fetchData().then(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div>
        {loading ? (
          <div className="loading loading-spinner loading-lg mt-2"></div>
        ) : (
          <div className="bg-mantle shadow-md rounded-lg p-6 max-w-lg w-full text-center">
            <h1 className="text-3xl font-bold text-green">
              Payment Successful!
            </h1>
            <p className="text-subtext1 mt-2">
              Thanks {customerName}, for your purchase.
            </p>
            <p className="text-subtext0 text-xs py-3 mr-64 font-semibold">
              Your Order:
            </p>
            <div className="mb-6">
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className="border-t border-text py-4 flex flex-col items-start"
                >
                  <h2 className="text-lg font-medium text-text">{item.name}</h2>
                  <p className="text-gray-600">Amount: {item.price}€</p>
                </div>
              ))}
            </div>

            <p className="text-xs">
              Receipt has been sent to{" "}
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
