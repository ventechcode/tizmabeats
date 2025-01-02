import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faTrashCan } from "@fortawesome/free-solid-svg-icons";
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
          price: beat.stripePriceId,
          quantity: 1, 
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
        <div className="absolute right-3 sm:right-1 md:right-0 top-6 hover:text-blue hover:duration-300 ">
          <FontAwesomeIcon icon={faShoppingCart} size="2x" />
          {shoppingCart && shoppingCart.cart.length > 0 ? (
            <div className="absolute right-0 bottom-0 transform translate-x-1/2 translate-y-1/2 h-6 w-6 bg-red-400 rounded-full flex items-center justify-center">
              <div className="text-text">{shoppingCart?.cart.length}</div>
            </div>
          ) : null}
        </div>
      </SheetTrigger>
      <SheetContent className="bg-mantle border-0">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          {shoppingCart && shoppingCart.cart.length > 0 ? (
            <SheetDescription>Your Items:</SheetDescription>
          ) : (
            <SheetDescription>Your cart is currently empty.</SheetDescription>
          )}
        </SheetHeader>
        <div className="flex flex-col space-y-2 h-5/6 overflow-y-scroll">
          <ul>
            {shoppingCart?.cart.length == 0 ? (
              <div className="mt-96 text-center">Add items...</div>
            ) : (
              shoppingCart?.cart.map((beat: any) => (
                <li key={beat.id}>
                  <div className="flex justify-between items-center px-4 py-3 my-4 bg-surface0 hover:bg-surface1 duration-300 rounded-md shadow-blue-400 shadow-sm hover:cursor-pointer">
                    <div className="flex flex-row items-center space-x-1">
                      <div>{beat.name}</div>
                      <div className="text-xs text-gray-400">
                        ({beat.price}€)
                      </div>
                    </div>
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      className="cursor-pointer hover:text-red duration-300"
                      onClick={() => {
                        shoppingCart.removeFromCart(beat.id);
                      }}
                    />
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="relative mt-12 flex flex-row items-center justify-between">
          <div className="font-bold text-text md:text-lg sm:text-xl">
            Total:{" "}
            {shoppingCart?.cart?.reduce((prev, val) => {
              return prev + val.price;
            }, 0)}
            €
          </div>
          <div className="flex justify-center">
            <button
              className="bg-text text-crust font-semibold sm:w-32 sm:h-12 px-4 py-2 rounded-md hover:bg-blue hover:text-text duration-300"
              onClick={handleCheckout}
            >
              {isLoading ? <div className="loading loading-spinner loading-md text-center mt-1"></div> : "Checkout"}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
