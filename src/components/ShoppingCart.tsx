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
        <div className="relative hover:text-accentColor hover:duration-300 text-text">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-8 md:size-10"          
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
      <SheetContent
        className={`bg-mantle border-0 flex flex-col ${
          shoppingCart && shoppingCart.cart.length > 0
            ? "justify-start"
            : "justify-between"
        }`}
      >
        <SheetHeader>
          <SheetTitle className="text-text">Shopping Cart</SheetTitle>
          {shoppingCart && shoppingCart.cart.length > 0 ? (
            <SheetDescription className="text-subtext0">
              Items:
            </SheetDescription>
          ) : (
            <SheetDescription className="text-subtext0">
              Your cart is currently empty.
            </SheetDescription>
          )}
        </SheetHeader>
        <div
          className={`flex flex-col space-y-2 space-x-2 ${
            shoppingCart && shoppingCart.cart.length > 0
              ? "overflow-y-scroll"
              : ""
          }`}
        >
          <ul>
            {shoppingCart?.cart.length == 0 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-12 flex flex-col items-center justify-center mx-auto text-text"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            ) : (
              shoppingCart?.cart.map((beat: any) => (
                <li key={beat.id} className=""> {/* Add mr-4 when shopping cart overscroll y */}
                  <div className="flex justify-between items-center px-4 py-3 my-4 bg-surface0 duration-300 rounded-md shadow-lg">
                    <div className="flex flex-col space-y-1">
                      <div>{beat.name}</div>
                      <div className="flex items-center space-x-1">
                        <div className="text-sm text-subtext1">
                          {beat.license.licenseOption.name}
                        </div>
                        <div className="text-subtext0 text-xs">
                          ({beat.license.licenseOption.contents.join(",")})
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <div>
                        <div className="text-subtext1">
                          {beat.license.price}€
                        </div>
                      </div>
                      <div
                        onClick={() => shoppingCart?.removeFromCart(beat.id)}
                      >
                        <p className="text-xs text-subtext0 hover:text-mocha-red duration-300 hover:cursor-pointer">
                          Remove
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="flex flex-row justify-between">
          <div className="font-bold text-text md:text-lg sm:text-xl">
            Total:{" "}
            {shoppingCart?.cart?.reduce((prev, val) => {
              return prev + val.price;
            }, 0)}
            €
            <p className="text-[10px] sm:text-xs md:text-sm font-light text-subtext0 sm:w-max">
              (incl. taxes and shipping costs)
            </p>
          </div>
          <button
            disabled={shoppingCart?.cart.length == 0}
            onClick={handleCheckout}
            className="ml-2 sm:ml-4 h-12 w-24 sm:h-14 sm:w-32 animate-shimmer flex items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-[#4c4f69] transition-colors focus:outline-none hover:text-[#cdd6f4] "
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-md text-text"></span>
            ) : (
              "Checkout"
            )}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
