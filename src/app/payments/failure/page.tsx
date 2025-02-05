"use client";

import { useRouter } from "next/navigation";

export default function Failure() {
  const router = useRouter();

  return (
    <div className="shadow-xl border border-text z-50 bg-transparent rounded-lg p-6 max-w-lg w-full text-center">
      <h1 className="text-3xl font-bold text-red">Payment Failed!</h1>
      <p className="text-subtext1 mt-2">
        Payment was not successful. Please try again.
      </p>

      <button
        className="mt-4 px-4 py-2 bg-text text-crust rounded-md shadow hover:bg-crust hover:text-text duration-300"
        onClick={() => router.push("/beats")}
      >
        Continue Shopping
      </button>
    </div>
  );
}
