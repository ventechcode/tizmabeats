import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/utils/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();

  const price_ids = await prisma.beat.findMany({
    where: {
      id: {
        in: body.items.map((item: any) => item.id),
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "klarna", "paypal"],
    line_items: [...price_ids.map((item: any) => ({price: item.stripePriceId, quantity: 1}))],
    mode: "payment",
    success_url: `${request.headers.get(
      "origin"
    )}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${request.headers.get("origin")}/payments/failure`,
    metadata: { 
      items: JSON.stringify(price_ids),
    }
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
  };  

  return NextResponse.json(data);
}
