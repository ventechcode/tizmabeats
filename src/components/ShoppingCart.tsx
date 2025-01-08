import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCartContext } from "@/app/providers";
import { useContext, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Beat } from "@/types";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export default function ShoppingCart() {
  const shoppingCart = useContext(ShoppingCartContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    const res = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: shoppingCart?.cart.map((beat: Beat) => ({
          id: beat.id,
        })),
      }),
    });
    setIsLoading(false);
    const data = await res.json();
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({
      sessionId: data.id,
    });
  };

  return (
    <Sheet>
      <SheetTrigger>
        <div className="absolute right-4 top-5 hover:text-blue hover:duration-300 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>

          {shoppingCart && shoppingCart.cart.length > 0 ? (
            <div className="absolute right-0 bottom-0 transform translate-x-1/4 translate-y-1/3 h-5 w-5 bg-text rounded-full flex items-center justify-center">
              <div className="text-sm font-semibold text-crust">
                {shoppingCart?.cart.length}
              </div>
            </div>
          ) : null}
        </div>
      </SheetTrigger>
      <SheetContent className={`bg-mantle border-0 flex flex-col justify-between ${shoppingCart && shoppingCart.cart.length > 0 ? "justify-start" : "justify-between"}`}>
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          {shoppingCart && shoppingCart.cart.length > 0 ? (
            <SheetDescription className="text-subtext0">
              Items:
            </SheetDescription>
          ) : (
            <SheetDescription>Your cart is currently empty.</SheetDescription>
          )}
        </SheetHeader>
        <div className={`flex flex-col space-y-2 space-x-2 ${shoppingCart && shoppingCart.cart.length > 0 ? "overflow-y-scroll" : ""}`}>
          <ul>
            {shoppingCart?.cart.length == 0 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-12 flex flex-col items-center justify-center mx-auto"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            ) : (
              shoppingCart?.cart.map((beat: any) => (
                <li key={beat.id} className="mr-4">
                  <div className="flex justify-between items-center px-4 py-3 my-4 bg-surface0 duration-300 rounded-md shadow-sm">
                    <div className="flex flex-row items-center space-x-1">
                      <div>{beat.name}</div>
                      <div className="text-sm text-subtext0">
                        ({beat.price}€)
                      </div>
                    </div>
                    <div onClick={() => shoppingCart?.removeFromCart(beat.id)}>
                      <p className="text-xs text-subtext2 hover:text-subtext0 duration-300 hover:cursor-pointer">
                        Remove
                      </p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="w-full flex flex-row items-center justify-around">
          <div className="font-bold text-text md:text-lg sm:text-xl">
            Total:{" "}
            {shoppingCart?.cart?.reduce((prev, val) => {
              return prev + val.price;
            }, 0)}
            €
            <p className="text-[10px] sm:text-xs font-light text-subtext0">
              (incl. taxes and shipping costs)
            </p>
          </div>

          <div className="flex justify-center">
            <button
              className="bg-text text-crust font-semibold sm:w-32 sm:h-12 px-4 py-2 rounded-md hover:bg-blue hover:text-text duration-300"
              onClick={handleCheckout}
            >
              {isLoading ? (
                <div className="loading loading-spinner loading-md text-center mt-1"></div>
              ) : (
                "Checkout"
              )}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
