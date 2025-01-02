import { NextRequest, NextResponse } from "next/server";
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

export async function GET(request: NextRequest): Promise<NextResponse> {
  const params = request.nextUrl.searchParams;
  const session_id = params.get("session_id");
  const endpoint = `https://api.stripe.com/v1/checkout/sessions/${session_id}`;
  const session = await fetch(
    endpoint,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.STRIPE_SECRET_KEY,
      },
    }
  );
  const session_data = await session.json();

  const line_items = await fetch(
    endpoint + "/line_items",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.STRIPE_SECRET_KEY,
      },
    }
  );

  const line_items_data = await line_items.json();

  const data = {
    session: session_data,
    line_items: line_items_data.data,
  };  

  console.log(data);

  return NextResponse.json(data);
}
