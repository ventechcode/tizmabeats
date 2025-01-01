import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [...body.items],
    mode: "payment",
    success_url: `${request.headers.get(
      "origin"
    )}/successfull_payment?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${request.headers.get("origin")}/cancelled_payment`,
  });

  return NextResponse.json({ id: session.id });
}
